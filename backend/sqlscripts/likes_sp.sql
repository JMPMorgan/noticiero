USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`likes_sp`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `likes_sp`(in `opc` int,in `uuid_user` varchar(155),in `uuid_news` varchar(155))
BEGIN
	if(`opc`=0)#Obtener la cantidad de likes
    then
		SELECT COUNT(`id_likes`) as `likes` FROM `likes` WHERE `uuid_newsL`=`uuid_news`;
    elseif(`opc`=1)#Insertar Like
    then
		INSERT INTO `likes`(`uuid_userL`,`uuid_newsL`,`status`,`likes_lastM`,`likes_creation`)
        VALUES(`uuid_user`,`uuid_news`,1,NOW(),NOW());
	elseif(`opc`=2)#Borrar Like
    then
		DELETE FROM `likes` where `uuid_userL`=`uuid_user`;
	elseif(`opc`=3)#OBTENER EL LIKE DEL USUARIO QUE ENTRA EN LA NOTICIA
	then
		SELECT `id_likes` FROM `likes` WHERE `uuid_userL`=`uuid_user` AND `uuid_newsL`=`uuid_news`;
    end if;
END$$

DELIMITER ;
;
