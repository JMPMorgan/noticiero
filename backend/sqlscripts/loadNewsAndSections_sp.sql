USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`loadNewsAndSections`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `loadNewsAndSections`(in `opc` int,in `uuid_section` varchar(155) )
BEGIN
if(`opc`=0)
then 
	#Obtiene las secciones para el navbar
	    	SELECT `section_name`,`uuid_sections`,`sections_color` FROM `sections` WHERE `sections_active` =1 AND `sections_status`<=100  
            ORDER BY `sections`.`sections_status` DESC LIMIT 5;
elseif(`opc`=1)
then
	#Obtiene las primeras 10 secciones  ordenadas por mayores status
	SELECT `section_name`,`uuid_sections` FROM `sections` WHERE `sections_active`=1  ORDER BY `sections_status` DESC LIMIT 10;
elseif(`opc`=2)
then 
	/*
	OBTENER LAS NOTICIAS PARA MOSTRAR POR SU UUID_SECTION y  BASADAS EN SU VISITAS Y SU FECHA DE PUBLICACION
	Se ordena por la fecha de publicaion mas reciente
	y luego que sea la noticia mas visitada
	*/
	SELECT `news`.`news_title`,`news`.`news_description`,`news`.`uuid_news`,
	`multimedia_news`.`archive`,
	`news_sections`.`uuid_section` 
	FROM `news`
	INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
	INNER JOIN `news_sections` ON `news_sections`.`uuid_news`=`news`.`uuid_news`
	INNER JOIN `views_news` ON `views_news`.`uuid_news`=`news`.`uuid_news`
	WHERE `news`.`news_status`=3 AND `multimedia_news`.`type_archive`<>'.mp4' 
	AND `news`.`news_publication` = (SELECT  MAX(`news`.`news_publication`))
	AND `news_sections`.`uuid_section`=`uuid_section`
	GROUP BY `news`.`uuid_news` ORDER BY `news`.`news_publication` DESC, `views_news`.`uuid_news` ASC;
elseif(`opc`=3)#Obtenre el nombre la seccion que se quiere buscar
then
	SELECT `sections`.`section_name`,`sections`.`uuid_sections`,`sections`.`sections_color` FROM `sections` 
    WHERE `sections`.`uuid_sections`=`uuid_section`
    AND `sections`.`sections_active`=1;
elseif(`opc`=4)#Obtener todas las noticias relacionadas con solo una seccion
then
	SELECT `news`.`news_title`,`news`.`news_description`,`news`.`uuid_news`,`multimedia_news`.`archive`
		FROM `news_sections` 
		INNER JOIN `news` ON `news`.`uuid_news`=`news_sections`.`uuid_news`
		INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
		WHERE `news_sections`.`uuid_section`=`uuid_section`
		AND `news`.`uuid_news`=`news_sections`.`uuid_news`
		AND `multimedia_news`.`type_archive`<>'.mp4'
		AND `news`.`news_status`=3 
		GROUP BY `news`.`uuid_news`
		ORDER BY `news`.`news_publication` DESC;
elseif(`opc`=5)#Obtener las noticias publicadas esta semana
THEN
	SELECT `news`.`news_title`,`news`.`news_description`,`news`.`uuid_news`,`multimedia_news`.`archive`
		FROM `news` 
		INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
		WHERE `multimedia_news`.`type_archive`<>'.mp4'
        AND `news_publication`>=DATE(NOW()- INTERVAL 7 DAY)
		AND `news`.`news_status`=3 
		GROUP BY `news`.`uuid_news`
		ORDER BY `news`.`news_publication` DESC;
elseif(`opc`=6) #Obtener las noticias mas visitadas
THEN
	SELECT `news`.`news_title`,`news`.`uuid_news`,`multimedia_news`.`archive`
    FROM `news`
    INNER JOIN `multimedia_news`on `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
    INNER JOIN `views_news` ON `views_news`.`uuid_news`=`news`.`uuid_news`
    WHERE `multimedia_news`.`type_archive`<>'.mp4'
        AND `news`.`news_status`=3
    GROUP by `news`.`uuid_news`
    ORDER BY COUNT(`views_news`.`uuid_news`) DESC LIMIT 5;
end if;
END$$

DELIMITER ;
;
