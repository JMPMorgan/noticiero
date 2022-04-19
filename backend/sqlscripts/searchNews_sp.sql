USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`searchNews`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchNews`(in `opc` int ,
														 in `titleP` varchar(155),
														 in `descriptionP` varchar(255),
														 in `start_dateP` date,
														 in `end_dateP` date,
														 in `keywordsP` varchar(455),
                                                         in `contador_keywordsP` int)
BEGIN
	if(`opc`=0)#Cunado se busca ssolo desde el titulo
    then
			SELECT `news_title`,`news_description`,`archive`,`uuid_news` FROM `news`
				INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
				WHERE `multimedia_news`.`type_archive`<>'.mp4'
				AND `news`.`news_active`=1 AND `news`.`news_status`=3
				AND `news`.`news_title` LIKE CONCAT('%',`titleP`,'%')
				GROUP BY `news`.`uuid_news` ORDER BY `news`.`news_publication`  DESC ;
	elseif(`opc`=1)#Para buscar de forma avanzada en el buscador 
    then
		/*
			Se crea una tabla "Temporal" para guardar el array enviado
            en el `keywordsP`,Para insertarlos de maneras separadas
            luego se cuantas keywords fueron ingresadas
            Luego se preguta cuantos fueron ingresadas
            para saber cual query se ejecutara
        */
			            SELECT COUNT(*)
						FROM information_schema.tables 
						WHERE table_schema = DATABASE()
						AND table_name = "parameter_search" INTO @tableParameterExists;
			if(@tableParameterExists>0)
            then
				SELECT  COUNT(`id`) from `parameter_search` INTO @contador;
            elseif(@tableParameterExists<=0)
            then 
            SET @contador=0;
            end if;
            if(@contador>0)
            then
				/*
                Esto quiere decir que se buscara tambien con keywords
                */
				SELECT `news`.`news_title`,`news`.`news_description`,`multimedia_news`.`archive`,`news`.`uuid_news` FROM `news`
					INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
					INNER JOIN `news_keywords` ON `news_keywords`.`uuid_news`=`news`.`uuid_news`
					INNER JOIN `keywords` ON `keywords`.`uuid_keywords`=`news_keywords`.`uuid_keywords`
					INNER JOIN `parameter_search` ON `parameter_search`.`parameter`=`keywords`.`word_keywords`
					WHERE `news`.`news_title` LIKE(concat('%',`titleP`,'%'))
					AND `news`.`news_description` LIKE(concat('%',`descriptionP`,'%'))
					AND (`news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<= DATE(`end_dateP`))
					AND `parameter_search`.`parameter`=`keywords`.`word_keywords`
					AND `keywords`.`status_keywords`=1 AND `news`.`news_active`=1 AND `news`.`news_status`=3
					GROUP BY `news`.`uuid_news` ORDER BY  `news`.`news_publication`  DESC  LIMIT 20;
					DROP TABLE `parameter_search`;
            elseif(@contador=0)
            then
				SELECT `news`.`news_title`,`news`.`news_description`,`multimedia_news`.`archive`,`news`.`uuid_news` FROM `news`
					INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
					WHERE `news`.`news_title` LIKE(concat('%',`titleP`,'%'))
					AND `news`.`news_description` LIKE(concat('%',`descriptionP`,'%'))
					AND (`news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<= DATE(`end_dateP`))
					 AND `news`.`news_active`=1 AND `news`.`news_status`=3
					GROUP BY `news`.`uuid_news` ORDER BY  `news`.`news_publication`  DESC  LIMIT 20;
            end if;

	elseif(`opc`=2)#Para buscar en news-reporter.html
    then
		/*
        Este query fue creado para el reportero, tener su propio buscador en news-repotert.html
        Si, no se envia minimo las fechas de busqueda no recibe nada
        */
    
						SELECT COUNT(*)
						FROM information_schema.tables 
						WHERE table_schema = DATABASE()
						AND table_name = "parameter_search" INTO @tableParameterExists;
			if(@tableParameterExists>0)
            then
				SELECT  COUNT(`id`) from `parameter_search` INTO @contador;
            elseif(@tableParameterExists<=0)
            then 
            SET @contador=0;
            end if;
            IF(@contador>0)
            THEN
				SELECT `news`.`uuid_news`,`news`.`news_title`,`news`.`news_publication`,`news`.`news_status` ,`news_sections`.`uuid_section`,`news`.`news_active`
					FROM `news`
					INNER JOIN `news_sections` ON `news_sections`.`uuid_news`=`news`.`uuid_news`
                    INNER JOIN `parameter_search` ON `parameter_search`.`parameter`=`news_sections`.`uuid_section`
					WHERE `news`.`news_title` LIKE (CONCAT('%',`titleP`,'%'))
					AND `parameter_search`.`parameter`=`news_sections`.`uuid_section`
					AND `news`.`news_creation`>=DATE(`start_dateP`) AND `news`.`news_creation`<=DATE(`end_dateP`)
					AND `news`.`uuid_userC`=`descriptionP` ORDER BY `news`.`news_creation` ASC;
					DROP TABLE `parameter_search`;
            ELSEIF(@contador=0)
            THEN
				SELECT `news`.`uuid_news`,`news`.`news_title`,`news`.`news_publication`,`news`.`news_status` ,`news`.`news_active`
					FROM `news`
					WHERE `news`.`news_title` LIKE (CONCAT('%',`titleP`,'%'))
					AND `news`.`news_creation`>=DATE(`start_dateP`) AND `news`.`news_creation`<=DATE(`end_dateP`)
					AND `news`.`uuid_userC`=`descriptionP`  ORDER BY `news`.`news_creation` ASC;
            END IF;

	elseif(`opc`=3)#GENERA UNA TABLA TEMPORAL PARA COMPARARLO
    then
     CREATE TABLE IF NOT EXISTS `bd_noticiero`.`parameter_search`(
        `id`  INT NOT NULL AUTO_INCREMENT,
		`parameter` VARCHAR(155) NULL,
		PRIMARY KEY (`id`));
	 INSERT INTO `parameter_search`(`parameter`) VALUES(`keywordsP`);
	
    end if;
END$$

DELIMITER ;
;




