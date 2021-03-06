USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`notificationsReporter`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `notificationsReporter`(in `opc` int , in `uuid` varchar(155))
BEGIN
	IF(`opc`=0) #noticias para modificacion
    THEN
		SELECT 	`communication`.`communication_message`,
			`communication`.`uuid_referencenews`,
			`multimedia_news`.`type_archive`,
			`multimedia_news`.`name_archive`,
			`multimedia_news`.`archive`,
			`news`.`news_status`,
			`news`.`news_date`,
			`news`.`news_title`,
			`news`.`news_text`
			FROM `communication`
			INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`communication`.`uuid_referencenews`
			INNER JOIN `news` on `news`.`uuid_news`=`communication`.`uuid_referencenews`
			WHERE `communication`.`uuid_for`=`uuid`
            and `news`.`news_status`=2 
            and `communication`.`communication_status`=0
            GROUP BY `communication`.`uuid_referencenews`;
	ELSEIF(`opc`=1)#Noticias enviadas para revision
    THEN
		SELECT 	`communication`.`communication_message`,
			`communication`.`uuid_referencenews`,
			`multimedia_news`.`type_archive`,
			`multimedia_news`.`name_archive`,
			`multimedia_news`.`archive`,
			`news`.`news_status`,
			`news`.`news_date`,
			`news`.`news_title`,
			`news`.`news_text`
			FROM `communication`
			INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`communication`.`uuid_referencenews`
			INNER JOIN `news` on `news`.`uuid_news`=`communication`.`uuid_referencenews`
			WHERE `communication`.`uuid_for`=`uuid`
            and `news`.`news_status`=1 
            and `communication`.`communication_status`=0
            GROUP BY `communication`.`uuid_referencenews`;
	ELSEIF(`opc`=2)#Noticias publicadas esta semana
    THEN
		SELECT 	`communication`.`communication_message`,
		`communication`.`uuid_referencenews`,
		`multimedia_news`.`type_archive`,
		`multimedia_news`.`name_archive`,
        `multimedia_news`.`archive`,
        `news`.`news_status`,
        `news`.`news_date`,
        `news`.`news_title`,
        `news`.`news_text`
        FROM `communication`
        INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`communication`.`uuid_referencenews`
        INNER JOIN `news` on `news`.`uuid_news`=`communication`.`uuid_referencenews`
        WHERE `communication`.`uuid_for`='a9bda5983a9d69a384326fc660f63c41' 
        and `news`.`news_status`=3  
        and `news`.`news_publication`> DATE(NOW() - INTERVAL 7 DAY) 
        and `communication`.`communication_status`=0
        GROUP BY `communication`.`uuid_referencenews` ;
	ELSEIF(`opc`=3)#Check si el reportero se quiere elimar
    THEN
		SELECT `communication_message`,
				`communication_status`,
                `uuid_referencenews`
                FROM `communication` WHERE `uuid_for`=`uuid` 
				AND `communication_status`=0 
                AND `communication_message`='ELIMINACION'
                and `communication`.`communication_status`=0;
    END IF;
END$$

DELIMITER ;
;


