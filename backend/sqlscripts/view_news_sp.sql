USE `bd_noticiero`;
DROP procedure IF EXISTS `views_news`;

DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `views_news` (in `opc` int,in `uuid_news` varchar(155),in `uuid_user` varchar(155))
BEGIN
	if(`opc`=0)#Ingresar  Visita
    then
    INSERT INTO `views_news`(`uuid_news`,`uuid_user`,`creation_date`)VALUES(`uuid_news`,`uuid_user`,NOW());
    end if;
END$$

DELIMITER ;