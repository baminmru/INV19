﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using MySys.Common.Extensions;
using MySys.Common.Service;
using MySys.Identity.Data;
using MySys.Identity.Models;
using inv19.Services.Users;
using inv19.models;
using inv19.Services.Data.User;
using inv19.Settings;


namespace inv19.Controllers
{

    public class NewUserInfo
    {
        public  string email;
        public string password;
        public string role;
        public string firstName;
        public string lastName;
    }

    [Authorize]
    [ApiController]
    [Route("api/account")]
    public class AccountController : Controller
    {
        private readonly MyContext _context;
        private readonly MySysIdentityDbContext _identityContext;
        private readonly UserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<MyIdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly ILogger _logger;

        public AccountController(MySysIdentityDbContext identityContext,
            MyContext context,
            UserService userService,
            UserManager<ApplicationUser> userManager,
            RoleManager<MyIdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<JwtIssuerOptions> jwtOptions,
            ILogger<AccountController> logger)
        {
            _identityContext = identityContext;
            _context = context;
            _userService = userService;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtOptions = jwtOptions.Value;
            _logger = logger;

            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Json("ok");
        }
     


       

        [HttpPost("Login")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<TokenInfo>))]
        public async Task<ResponseData<TokenInfo>> Login([FromBody] LoginRequest request)
        {
            var response = new ResponseData<TokenInfo>();
            try
            {
            var result = await _signInManager.PasswordSignInAsync(request.email, request.password, false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var currentUser = await _userManager.FindByEmailAsync(request.email);
                string encodedJwt = await CreateToken(currentUser);

                // Serialize and return the response
                var oldTokens = await _identityContext.RefreshTokens.
                    Where(p => p.UserId == currentUser.Id && p.IsExpired).
                    ToListAsync();
                oldTokens.ForEach(p => { p.IsExpired = true; });

                var refresh_token = $"{Guid.NewGuid()}{Guid.NewGuid()}{Guid.NewGuid()}".Replace("-", "");
                var refreshToken = new RefreshToken
                {
                    Id = Guid.NewGuid(),
                    UserId = currentUser.Id,
                    Token = refresh_token,
                    DateIssued = DateTime.Now,
                    IsExpired = false
                };

                response.code = BaseStatus.Success;
                response.data = new TokenInfo
                {
                    access_token = encodedJwt,
                    expires_in = (int)_jwtOptions.ValidFor.TotalSeconds,
                    token_type = "jwt",
                    refresh_token = refresh_token
                };

                _identityContext.Add(refreshToken);
                await _identityContext.SaveChangesAsync();

                return response;
            }

            response.code = BaseStatus.Error;
            response.description = "Не удалось войти в систему";
            return response;
        }
            catch (Exception ex)
            {
                _logger.LogError(ex, "could not login");
                response.code = BaseStatus.Exception;
                response.message = "Ошибка";
                response.description = "Не удалось выполнить вход";
                return response;
            }
        }

        


        [HttpPost("terminallogin")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<Guid>))]
        public async Task<ResponseData<Guid>> TerminalLogin([FromBody] TermLoginRequest request)
        {



            _logger.LogInformation("term login by " +request.email );
            var response = new ResponseData<Guid>();

            var result = await _signInManager.PasswordSignInAsync(request.email, request.password, false, lockoutOnFailure: false);
            if (result.Succeeded)
            {

               

                var user = await _context.xUserInfo.FirstOrDefaultAsync(u => u.email == request.email && u.islocked == 0);
                if (user != null)
                {
                    response.code = BaseStatus.Success;
                    response.data = user.xUserInfoId;
                }
                else
                {
                    response.code = BaseStatus.Error;
                    response.description = "Пользователь не обнаружен";
                    response.data = Guid.Empty;
                }
            }
            else
            {
                response.code = BaseStatus.Error;
                response.description = "Ошибка регистрации";
                response.data = Guid.Empty;
            }
            return response;

            //try
            //{
            //    var result = await _signInManager.PasswordSignInAsync(request.email, request.password, false, lockoutOnFailure: false);
            //    if (result.Succeeded)
            //    {
            //        var currentUser = await _userManager.FindByEmailAsync(request.email);
            //        response.code = BaseStatus.Success;
            //        response.data =currentUser.Id;
            //        return response;
            //    }

            //    response.code = BaseStatus.Error;
            //    response.description = "Не удалось войти в систему";
            //    response.data = Guid.Empty;
            //    return response;
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex, "could not login terminal");
            //    response.code = BaseStatus.Exception;
            //    response.message = "Ошибка";
            //    response.description = "Не удалось выполнить вход";
            //    response.data = Guid.Empty;
            //    return response;
            //}
        }

        [HttpPost("RefreshToken")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<TokenInfo>))]
        public async Task<ResponseData<TokenInfo>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var response = new ResponseData<TokenInfo>();
            var token = await _identityContext.
                RefreshTokens.
                Include(p => p.User).
                Where(p => p.Token == request.RefreshToken && !p.IsExpired).
                AsNoTracking().
                SingleOrDefaultAsync();
            if (token != null)
            {
                var currentUser = token.User;
                string encodedJwt = await CreateToken(currentUser);
                await _signInManager.SignInAsync(currentUser, false);

                response.code = BaseStatus.Success;
                response.data = new TokenInfo
                {
                    access_token = encodedJwt,
                    expires_in = (int)_jwtOptions.ValidFor.TotalSeconds,
                    token_type = "jwt",
                    refresh_token = request.RefreshToken
                };

                return response;
            }

            response.code = BaseStatus.Error;
            response.description = "Не удалось войти в систему";
            return response;
        }
        private async Task<string> CreateToken(ApplicationUser currentUser)
        {
            var roles = await _userManager.GetRolesAsync(currentUser);
            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, currentUser.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                    new Claim(JwtRegisteredClaimNames.Iat,
                              ConvertToUnixTimestamp(_jwtOptions.IssuedAt).ToString(),
                              ClaimValueTypes.Integer64),
                    new Claim(ClaimTypes.NameIdentifier, currentUser.Id.ToString())
                };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);


            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            return encodedJwt;
        }
        private static double ConvertToUnixTimestamp(DateTime date)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan diff = date.ToUniversalTime() - origin;
            return Math.Floor(diff.TotalSeconds);
        }
        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return Content(""); // RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }
       
        [HttpPost("Private")]
        public  IActionResult Private()
        {
            var id = User.GetUserId();
            var roles = User.GetRoles();

            
            return Json(new { id = id, roles = string.Join(',', roles.Select(p=>p.Value)) });
        }

        //[HttpPost("PrivateAdmin")]
        //[Authorize(Roles = "SUPERADMIN")]
        //public async Task<IActionResult> PrivateAdmin()
        //{
        //    return Json(new { name = "Hello from private method" });
        //}
        //[HttpPost("PrivatePost")]
        //public async Task<IActionResult> PrivatePost()
        //{
        //    return Content("Hello from private method");
        //}


        [HttpPost("AddUser")]
       // [AllowAnonymous]
        public async Task<IActionResult> AddUser([FromBody] NewUserInfo newUser)
        {
            try
            {
                System.Diagnostics.Debug.Print(newUser.email);
               var email = newUser.email;
                var user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email
                };

                System.Diagnostics.Debug.Print(newUser.password);
                await _userManager.CreateAsync(user, newUser.password);

                await _userManager.AddToRoleAsync(user, newUser.role);

                _context.Add(new xUserInfo
                {
                    email = email,
                    name = newUser.lastName,
                    family = newUser.firstName,
                    login= user.Id.ToString() ,
                    xUserInfoId = user.Id
                });

                await _context.SaveChangesAsync();
            }
            catch(System.Exception ex)
            {
                System.Diagnostics.Debug.Print("\r\n\r\n");
                System.Diagnostics.Debug.Print(ex.Message);
                System.Diagnostics.Debug.Print("\r\n\r\n");
            }
            return Content("ОК");
        }

        [HttpGet("InitUsers")]
       // [AllowAnonymous]
        public async Task<IActionResult> InitUsers()
        {
            try
            {
                await _roleManager.CreateAsync(new MyIdentityRole
                {
                    Name = MyIdentityRole.ROLE_USER,
                    Id = new Guid("EA275999-49D0-4A0A-658B-08D5AF855020")
                });
            }
            catch { }
            try { 
            

            await _roleManager.CreateAsync(new MyIdentityRole
            {
                Name = MyIdentityRole.ROLE_ADMIN,
                Id = new Guid("BE2C9C98-8174-4798-6589-08D5AF855020")
            });

            }
            catch { }
            try
            {
                await _roleManager.CreateAsync(new MyIdentityRole
            {
                Name = MyIdentityRole.ROLE_SUPERADMIN,
                Id = new Guid("E892F4FF-8FC5-4779-086D-08D6C2FA7668")
            });
            }
            catch { }
            try
            {

                var email = "developer.bami@gmail.com";
                var user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email,
                };
                await _userManager.CreateAsync(user, "Password_INV20");
                await _userManager.AddToRoleAsync(user, MyIdentityRole.ROLE_SUPERADMIN);

                _context.Add(new xUserInfo
                {
                    email = email,
                    name = "Super",
                    family = "Administrator",
                    login = user.Id.ToString(),
                    xUserInfoId = user.Id
                });
            }
            catch { }
            await _context.SaveChangesAsync();

            return Content("User created");
        }

        [HttpGet("AccessDenied")]
       // [AllowAnonymous]
        public async Task<IActionResult> AccessDenied()
        {
            return StatusCode(401);
        }

    }
}

