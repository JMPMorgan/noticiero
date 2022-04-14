USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`countNotificationsAdmi`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `countNotificationsAdmi`(in `opc` int)
BEGIN
	if(`opc`=0)#NUMERO DE NOTICIAS PARA ESTE DIA
    then
		SELECT 
			count(distinct(`news`.`uuid_news`)) as`number` FROM
			((`news`
			JOIN `users` ON (`users`.`user_uuid` = `news`.`uuid_userC`))
			JOIN `multimedia_news` ON (`multimedia_news`.`uuid_noticia` = `news`.`uuid_news`))
		WHERE `news`.`news_status` = 1 AND `news`.`news_date` = CURRENT_TIMESTAMP();
	elseif(`opc`=1)#NUMBERO DE NOTICIAS PARA ESTA SEMANA
    then 
		SELECT count(distinct(`news`.`uuid_news`))  as `number`  FROM ((`news`JOIN `users` ON (`users`.`user_uuid` = `news`.`uuid_userC`))JOIN `multimedia_news` ON (`multimedia_news`.`uuid_noticia` = `news`.`uuid_news`))
             WHERE
				`news`.`news_status` = 1
				AND `news`.`news_date` <= CURRENT_TIMESTAMP() + INTERVAL 7 DAY ;
	elseif(`opc`=2)#NUMBERO DE NOTICIAS PARA LA SIGUIENTE SEMANA
    then
		SELECT count(distinct(`news`.`uuid_news`)) as`number`  FROM ((`news`JOIN `users` ON (`users`.`user_uuid` = `news`.`uuid_userC`))JOIN `multimedia_news` ON (`multimedia_news`.`uuid_noticia` = `news`.`uuid_news`))
             WHERE
				`news`.`news_status` = 1
				AND `news`.`news_date` > CURRENT_TIMESTAMP() + INTERVAL 7 DAY;
	
    elseif(`opc`=3)#NUMBERO DE NOTICIAS PARA DIAS ANTERIORES A AYER
    then
		SELECT 
			count(distinct(`news`.`uuid_news`))`number` FROM
			((`news`
			JOIN `users` ON (`users`.`user_uuid` = `news`.`uuid_userC`))
			JOIN `multimedia_news` ON (`multimedia_news`.`uuid_noticia` = `news`.`uuid_news`))
		WHERE `news`.`news_status` = 1 AND `news`.`news_date` < CURRENT_TIMESTAMP();
    end if;
END$$

DELIMITER ;
;