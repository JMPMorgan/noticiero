USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`reportsAdmi`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reportsAdmi`(in `opc` int,in `start_dateP` date,in `end_dateP` date,in `parameterP` varchar(455),in `contadorP` int)
BEGIN
	if(`opc`=0)#Para se selecciona secciones en especifico
    then
        SELECT 
			`news`.`news_title`,
			`sections`.`section_name`,
			`news`.`news_publication`,
			COUNT(`comments`.`uuid_news`) as `comments`,
			COUNT(`likes`.`uuid_newsL`) as `likes`
			FROM `news`
			INNER JOIN `news_sections` ON `news_sections`.`uuid_news`=`news`.`uuid_news`
			INNER JOIN `sections` ON `sections`.`uuid_sections`=`news_sections`.`uuid_section`
            LEFT JOIN `parameter_search` ON `parameter_search`.`parameter`=`news_sections`.`uuid_section`
			LEFT JOIN `comments` ON `comments`.`uuid_news`=`news`.`uuid_news`
			LEFT JOIN `likes` ON `likes`.`uuid_newsL`=`news`.`uuid_news`
			WHERE `news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<=DATE(`end_dateP`)
			AND `parameter_search`.`parameter`=`news_sections`.`uuid_section`
			AND `news`.`news_status`=3 GROUP BY `news_sections`.`id` ORDER BY COUNT(`likes`.`uuid_newsL`) DESC, `sections`.`section_name` ASC;
		DROP TABLE `parameter_search`;
	ELSEIF(`opc`=1)#No se seleccionaron secciones y se obtiene detalle de secciones
    THEN
		SELECT  
			`news`.`news_title`,
			`sections`.`section_name`,
			`news`.`news_publication`,
			COUNT(`comments`.`uuid_news`) as `comments`,
			COUNT(`likes`.`uuid_newsL`) as `likes`
			FROM `news`
			INNER JOIN `news_sections` ON `news_sections`.`uuid_news`=`news`.`uuid_news`
			INNER JOIN `sections` ON `sections`.`uuid_sections`=`news_sections`.`uuid_section`
			LEFT JOIN `comments` ON `comments`.`uuid_news`=`news`.`uuid_news`
			LEFT JOIN `likes` ON `likes`.`uuid_newsL`=`news`.`uuid_news`
			WHERE `news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<=DATE(`end_dateP`)
			AND `news`.`news_status`=3 GROUP BY `news_sections`.`id` ORDER BY COUNT(`likes`.`uuid_newsL`) DESC, `sections`.`section_name` ASC;
	ELSEIF(`opc`=2)#INSERTAR LAS SECCIONES EN UNA TABLA TEMPORAL PARA SU BUSQUEDA
    THEN
         CREATE TABLE IF NOT EXISTS `bd_noticiero`.`parameter_search`(
        `id`  INT NOT NULL AUTO_INCREMENT,
		`parameter` VARCHAR(155) NULL,
		PRIMARY KEY (`id`));
        
		INSERT INTO `parameter_search`(`parameter`) VALUES(`parameterP`);
	ELSEIF(`opc`=3) #No se selecciona la seccion y no se da detalle de secciones
	THEN
		SELECT `news`.`news_title`,`sections`.`section_name`,`news`.`news_publication`,COUNT(`likes`.`uuid_userL`) as `likes`,COUNT(`comments`.`uuid_news`) as `comments`FROM `sections`
			INNER JOIN `news_sections` ON `news_sections`.`uuid_section`=`sections`.`uuid_sections`
			LEFT JOIN `news` ON `news`.`uuid_news`=`news_sections`.`uuid_news`
			LEFT JOIN `likes` on `likes`.`uuid_newsL`=`news`.`uuid_news`
			LEFT JOIN `comments` ON `comments`.`uuid_news`=`news`.`uuid_news` 
			WHERE `news`.`news_status`=3
			AND `news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<=DATE(`end_dateP`)
			GROUP BY `news`.`uuid_news`
			ORDER BY COUNT(`likes`.`uuid_userL`) DESC;
	ELSEIF(`opc`=4)#Se selecciona la seccion y no se da detalle de secciones
    THEN
		SELECT `news`.`news_title`,`sections`.`section_name`,`news`.`news_publication`,COUNT(`likes`.`uuid_userL`) as `likes`,COUNT(`comments`.`uuid_news`) as `comments`FROM `sections`
			INNER JOIN `news_sections` ON `news_sections`.`uuid_section`=`sections`.`uuid_sections`
			LEFT JOIN `news` ON `news`.`uuid_news`=`news_sections`.`uuid_news`
			LEFT JOIN `likes` on `likes`.`uuid_newsL`=`news`.`uuid_news`
			LEFT JOIN `comments` ON `comments`.`uuid_news`=`news`.`uuid_news` 
			WHERE `news`.`news_status`=3
			AND `news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<=DATE(`end_dateP`)
			AND `news_sections`.`uuid_section` IN (SELECT `parameter_search`.`parameter` FROM `parameter_search`)
			GROUP BY `news`.`uuid_news`
			ORDER BY COUNT(`likes`.`uuid_userL`) DESC;
	end if;
END$$

DELIMITER ;
;

