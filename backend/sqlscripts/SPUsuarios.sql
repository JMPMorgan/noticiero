USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`usersSP`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usersSP`(in`opcion`int ,in `uuid` varchar(155),in `name` varchar(155),in `lastname` varchar(155),in `password` varchar(155),
in `gender` int, in `emai` varchar(155),in `path_pp` varchar(155),in `nick` varchar(155),in `type_user` int)
BEGIN
	/*
    Insert
    */
	IF(`opcion`=0) 
    THEN
    INSERT INTO `bd_noticiero`.`users`
	(`user_status`,`user_name`,`user_email`,`user_pass`,`user_uuid`,`user_profilepic`,`user_lastname`,`user_gender`,`user_nick`,`user_type`,`last_modification`,`user_creation`)
	VALUES(0,`name`,`email`,`password`,`uuid`,`path_pp`,`lastname`,`gender`,`nick`,`type_user`,NOW(),NOW());
	
    /*
    Update
    */
    ELSEIF (`opcion`=1)
    THEN
    UPDATE `users` SET `user_name`=`name`, `user_email` =`emai`,
                    `user_pass`=`password` WHERE `user_uuid`=`uuid`;
                    
	/*
    Delete Logico
    */
	ELSEIF (`opcion`=2)
    THEN
    UPDATE `users` SET `user_status`=1 WHERE `user_uuid`=`uuid`;
    
    /*
    */
    ELSEIF(`opcion`=3)
    THEN
    SELECT `user_name` FROM `users` WHERE `user_uuid`=`uuid`;
    
	ELSE
		select ("Error");

    END IF;
    
END$$

DELIMITER ;
;