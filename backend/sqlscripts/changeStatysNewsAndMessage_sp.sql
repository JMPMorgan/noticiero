USE `bd_noticiero`;
DROP procedure IF EXISTS `changeStatusNewsAndMessage`;

DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `changeStatusNewsAndMessage` (in `date` datetime,in `uuid` varchar(155))
BEGIN
	#CAMBIAR EL STATUS DEL MENSAJE PARA QUE YA NO SE MUESTRE EN EL REPORTERO Y QUE PUEDA EDITAR LA NOTICIA PARA DESPUES
	UPDATE `communication` SET `communication_status`=1 WHERE `communication_date`=`date`;
    UPDATE `news` set `news_status`=0 WHERE `uuid_news` = `uuid`;
END$$

DELIMITER ;

