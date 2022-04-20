USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`usersSP`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usersSP`(in`opcion`int ,
in `uuid` varchar(155),in `name` varchar(155),in `lastname` varchar(155),in `password` varchar(155),
in `gender` int, in `email` varchar(155),in `path_pp` varchar(155),in `nick` varchar(155),in `type_user` int)
BEGIN
	
	IF(`opcion`=0)#VERIFICA SI EL NICKNAME O EL EMAIL YA FUE REGISTRADO
    THEN
		#UTILIZADO EN SIGNUP.php
		SELECT `user_name`,`user_email` from `users` where `user_email` = `email` OR `user_nick`=`nick` AND `user_status`=0;
	ELSEIF(`opcion`=1)#Insertar un nuevo usuario
    THEN
		#UTILIZADO EN SIGNUP.php
		INSERT into `users`(`user_name`,`user_email`,`user_pass`,`user_uuid`,`user_lastname`,`user_gender`,`user_nick`,`user_profilepic`,`user_type`)
        VALUES(`name`,`email`,`password`,`uuid`,`lastname`,`gender`,`nick`,`path_pp`,`type_user`);
	ELSEIF(`opcion`=2)#Para login para saber si fue el email el que se ingreso
    THEN
		#UTILIZADO EN login.php
		SELECT `user_uuid` FROM `users` WHERE `user_pass`=`password` AND `user_email`=`email` AND `user_status`=0;
	ELSEIF(`opcion`=3)#Login para verificar si se utilizo el nick name ademas de estar activo el usuario
    THEN
		#UTILIZADO EN login.php
		SELECT `user_uuid` FROM `users` WHERE `user_pass`=`password` AND `user_nick`=`nick` AND `user_status`=0;
	ELSEIF(`opcion`=4) #Para saber si existe el usuario que se va editar
    THEN 
		#UTILIZADO en editprofile.php y editReportersByAdmin.php
		SELECT COUNT(*) FROM `users` WHERE `user_uuid`=`uuid` AND `user_status`=0;
	ELSEIF(`opcion`=5)#Sirve para editar cuando se va hacer update sin imagen
    THEN
		#UTILIZADO en editprofile.php
		UPDATE `users` SET `user_name`=`name`, `user_email` =`email`,
                    `user_pass`=`password` WHERE `user_uuid`=`uuid` AND `user_status`=0;
	ELSEIF(`opcion`=6)#Sirve para editar cuando se va hacer update con imagen
    THEN 
		#UTILIZADO en editprofile.php
        UPDATE `users` SET `user_name`=`name`, `user_email` =`email`,
                    `user_pass`=`password`, `user_profilepic`=`path_pp` WHERE `user_uuid`=`uuid` AND `user_status`=0;
                    
	ELSEIF(`opcion`=7)#Sirve para saber si es un admin
    THEN
		#UTILIZADO en  deleteUser.php
        SELECT COUNT(*) FROM `users` WHERE `user_uuid`=`uuid` AND `user_type`=0;
	ELSEIF(`opcion`=8)#Sirve para eliminar el usuario
    THEN
		#UTILIZADO en  deleteUser.php
		UPDATE `users` SET `user_status`=1 WHERE `user_uuid`=`uuid`;
	ELSEIF(`opcion`=9)
    THEN
		#UTILIZADO en getprofilesbyadmin.php y en data.php
        SELECT `users`.`user_status`,`users`.`user_name`,`users`.`user_email`,`users`.`user_pass`,`users`.`user_uuid`,`users`.`user_profilepic`,
		`users`.`user_lastname`,`users`.`user_gender`,`users`.`user_nick`,`users`.`user_type`,`users`.`last_modification`,`users`.`user_creation`
		FROM `bd_noticiero`.`users` WHERE `users`.`user_uuid`=`uuid`;
	ELSEIF(`opcion`=10)
    THEN
		#UTILIZADO en dataReporters.php
		SELECT `user_name`,`user_lastname`,`user_nick`,`user_uuid` FROM `users` WHERE `user_type`=1 AND `user_status`=0;

    END IF;
	/*
    Insert
	IF(`opcion`=0) 
    THEN
    INSERT INTO `bd_noticiero`.`users`
	(`user_status`,`user_name`,`user_email`,`user_pass`,`user_uuid`,`user_profilepic`,`user_lastname`,`user_gender`,`user_nick`,`user_type`,`last_modification`,`user_creation`)
	VALUES(0,`name`,`email`,`password`,`uuid`,`path_pp`,`lastname`,`gender`,`nick`,`type_user`,NOW(),NOW());
	

    Update

    ELSEIF (`opcion`=1)
    THEN
    UPDATE `users` SET `user_name`=`name`, `user_email` =`emai`,
                    `user_pass`=`password` WHERE `user_uuid`=`uuid`;
                    
    Delete Logico

	ELSEIF (`opcion`=2)
    THEN
    UPDATE `users` SET `user_status`=1 WHERE `user_uuid`=`uuid`;
    
    /*
    ELSEIF(`opcion`=3)
    THEN
    SELECT `user_name` FROM `users` WHERE `user_uuid`=`uuid`;
    
	ELSE
		select ("Error");

    END IF;
    */
END$$

DELIMITER ;
;
