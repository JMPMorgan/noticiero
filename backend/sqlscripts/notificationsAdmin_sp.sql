USE `bd_noticiero`;
DROP procedure IF EXISTS `notificationsAdmin`;

DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `notificationsAdmin` (in `opc` int)
BEGIN
	if(`opc`=0)# Noticias para este dia
    then
    select * from `newswithoutapprovalfortoday`;
	elseif(`opc`=1)#noticias para esta semana
    then
    select * from `newswithoutapprovalforthisweek`;
    elseif(`opc`=2)#noticias para 2 o mas semanas
    then
    select * from `newswithoutapprovalfornextweek`;
    elseif(`opc`=3)#noticias que ya pasaron del dia actual
    then 
    select * from `newswithoutapprovalpreviousdays`;
    end if;
END$$

DELIMITER ;


#NOTICIAS QUE FALTAN PARA APROBAR PARA DIAS ANTERIORES
SELECT `news`.`news_text`,`news`.`news_title`,`news`.`news_date`,
        `news`.`uuid_news`,`news`.`uuid_userC`,`users`.`user_name`
        ,`users`.`user_lastname`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`,
        `multimedia_news`.`archive`,`multimedia_news`.`type_archive`,`multimedia_news`.`name_archive`	
        FROM `news` 
        INNER JOIN `users` ON `users`.`user_uuid`=`news`.`uuid_userC`
        INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
        WHERE `news`.`news_status`=1 AND `news`.`news_date` < NOW();



#VIEW pARA LAS NOTICIAS SIN APROBAR PARA HOY
SELECT `news`.`news_text`,`news`.`news_title`,`news`.`news_date`,
        `news`.`uuid_news`,`news`.`uuid_userC`,`users`.`user_name`
        ,`users`.`user_lastname`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`,
        `multimedia_news`.`archive`,`multimedia_news`.`type_archive`,`multimedia_news`.`name_archive`	
        FROM `news` 
        INNER JOIN `users` ON `users`.`user_uuid`=`news`.`uuid_userC`
        INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
        WHERE `news`.`news_status`=1 AND `news`.`news_date` =NOW();
        


# noticia sin aprobar que pasaron esta semana
SELECT `news`.`news_text`,`news`.`news_title`,`news`.`news_date`,
        `news`.`uuid_news`,`news`.`uuid_userC`,`users`.`user_name`
        ,`users`.`user_lastname`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`,
        `multimedia_news`.`archive`,`multimedia_news`.`type_archive`,`multimedia_news`.`name_archive`	
        FROM `news` 
        INNER JOIN `users` ON `users`.`user_uuid`=`news`.`uuid_userC`
        INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
        WHERE `news`.`news_status`=1 AND `news`.`news_date` <= ADDDATE(NOW(),INTERVAL 7 DAY);
        
        
	#NOTICIAS PARA QUE FALTAN APROBAR DESPUES DE 7 DIAS
SELECT `news`.`news_text`,`news`.`news_title`,`news`.`news_date`,
        `news`.`uuid_news`,`news`.`uuid_userC`,`users`.`user_name`
        ,`users`.`user_lastname`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`,
        `multimedia_news`.`archive`,`multimedia_news`.`type_archive`,`multimedia_news`.`name_archive`	
        FROM `news` 
        INNER JOIN `users` ON `users`.`user_uuid`=`news`.`uuid_userC`
        INNER JOIN `multimedia_news` on `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
        WHERE `news`.`news_status`=1 AND `news`.`news_date` > ADDDATE(NOW(),INTERVAL 7 DAY);