USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`views_news`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `views_news`(in `opc` int,in `uuid_news` varchar(155),in `uuid_user` varchar(155))
BEGIN
	if(`opc`=0)#Ingresar  Visita
    then
    INSERT INTO `views_news`(`uuid_news`,`uuid_user`,`creation_date`)VALUES(`uuid_news`,`uuid_user`,NOW());
    elseif(`opc`=1)#Devuelve la data de la ultima noticia creada por el reportero
    then
	SELECT distinct(DATE_FORMAT(`creation_date`,'%W')) as `days`,
		COUNT(1) total
		FROM `views_news` 
		INNER JOIN `news` ON `views_news`.`uuid_news`=`news`.`uuid_news`
		where `creation_date`> DATE(NOW()-INTERVAL 7 DAY)
		AND `news`.`uuid_userC`=`uuid_user`
		AND `news`.`news_publication`=(SELECT MAX(`news_publication`) FROM `news`)
		GROUP BY (DATE_FORMAT(`creation_date`,'%W')) ORDER BY (DATE_FORMAT(`creation_date`,'%W')) DESC;
    end if;
    
END$$

DELIMITER ;
;