
USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`comments_sp`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `comments_sp`(in`opc` int ,in `uuid` varchar(155) ,in`uuid_user`  varchar(155),in `uuid_news` varchar(155),in `uuid_main` varchar(155), in `comment` text)
BEGIN
set @uuid=`uuid_news`;
 if(`opc`=0)#cargar comentarios main
 then
	SELECT * from `comments_mains`;
 
	/* SELECT `uuid_comments`,`comments`.`uuid_main`,DATE_FORMAT(`comments_creation`,'%d/%c/%Y') as `comments_creation`,`comments_text`,`users`.`user_nick`,`users`.`user_profilepic`
     FROM `comments`
	 INNER JOIN `users` ON`users`.`user_uuid`=`comments`.`uuid_user`
	 WHERE `status`=1 and `uuid_main` IS NULL ;*/
 elseif(`opc`=1)#Insertar Comentario
 then
	INSERT into `comments`
		   (`uuid_comments`,`uuid_user`,`uuid_news`,`status`,`comments_text`,`comments_creation`) 
    VALUES (`uuid`,`uuid_user`,`uuid_news`,1,`comment`,NOW());
 elseif(`opc`=2)#Insertar Comentario en Comentario
 then
	INSERT into `comments`
		   (`uuid_comments`,`uuid_user`,`uuid_news`,`status`,`comments_text`,`comments_creation`,`uuid_main`) 
    VALUES (`uuid`,`uuid_user`,`uuid_news`,1,`comment`,NOW(),`uuid_main`);
 elseif(`opc`=3)#"Borrar" Comentario
 then
	DELETE FROM  `comments` WHERE `comments`.`uuid_main`=`uuid`;
	DELETE FROM  `comments` WHERE `uuid_comments`=`uuid`;
 elseif(`opc`=4) #Cargar los comentarios hijos
 then
	SELECT * from `comments_child`;
elseif(`opc`=5)#Verificar si el usuario que entro puede borrrar comentarios
then
	SELECT COUNT(*) as `permission` FROM `news`
    WHERE `uuid_news`=`uuid_news`
    AND `uuid_userC`=`uuid_user` 
    AND `news_status`=3;
 end if;
END$$

DELIMITER ;
;

