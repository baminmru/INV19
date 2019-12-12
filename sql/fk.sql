


	 delete from invg_subgrp where invg_grpId not in ( select invg_grpId from invg_grp) 
	 go 
	 ALTER TABLE invg_subgrp 
                                ADD CONSTRAINT FK_invg_subgrp_Parent
                                FOREIGN KEY (invg_grpId)
                                REFERENCES invg_grp (invg_grpId)
                                ON DELETE CASCADE 
	 go 





	 delete from inva_real where inva_infoId not in ( select inva_infoId from inva_info) 
	 go 
	 ALTER TABLE inva_real 
                                ADD CONSTRAINT FK_inva_real_Parent
                                FOREIGN KEY (inva_infoId)
                                REFERENCES inva_info (inva_infoId)
                                ON DELETE CASCADE 
	 go 

	 delete from inva_absnt where inva_infoId not in ( select inva_infoId from inva_info) 
	 go 
	 ALTER TABLE inva_absnt 
                                ADD CONSTRAINT FK_inva_absnt_Parent
                                FOREIGN KEY (inva_infoId)
                                REFERENCES inva_info (inva_infoId)
                                ON DELETE CASCADE 
	 go 

	 delete from inva_extra where inva_infoId not in ( select inva_infoId from inva_info) 
	 go 
	 ALTER TABLE inva_extra 
                                ADD CONSTRAINT FK_inva_extra_Parent
                                FOREIGN KEY (inva_infoId)
                                REFERENCES inva_info (inva_infoId)
                                ON DELETE CASCADE 
	 go 





	 delete from invwh_cell where invwh_locId not in ( select invwh_locId from invwh_loc) 
	 go 
	 ALTER TABLE invwh_cell 
                                ADD CONSTRAINT FK_invwh_cell_Parent
                                FOREIGN KEY (invwh_locId)
                                REFERENCES invwh_loc (invwh_locId)
                                ON DELETE CASCADE 
	 go 