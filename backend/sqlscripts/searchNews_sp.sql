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
	elseif(`opc`=1)#Para buscar de forma avanzada
    then
		/*
			Se crea una tabla "Temporal" para guardar el array enviado
            en el `keywordsP`,Para insertarlos de maneras separadas
            luego se cuantas keywords fueron ingresadas
            Luego se preguta cuantos fueron ingresadas
            para saber cual query se ejecutara
        */
			CREATE TABLE `bd_noticiero`.`keywords_search` (
				`id` INT NOT NULL AUTO_INCREMENT,
				`keyword` VARCHAR(155) NULL,
				PRIMARY KEY (`id`));
			SET	@id=1;
            WHILE(@id<=`contador_keywordsP`)
            DO
				INSERT INTO `keywords_search`(`keyword`) VALUES(SUBSTRING_INDEX(`keywordsP`,"|",@id));
				SET @id=@id+1;
            END WHILE;
			SELECT  COUNT(`id`) from `keywords_search` INTO @contador;
            if(@contador>0)
            then
				/*
                Esto quiere decir que se buscara tambien con keywords
                */
				SELECT `news`.`news_title`,`news`.`news_description`,`multimedia_news`.`archive`,`news`.`uuid_news` FROM `news`
					INNER JOIN `multimedia_news` ON `multimedia_news`.`uuid_noticia`=`news`.`uuid_news`
					INNER JOIN `news_keywords` ON `news_keywords`.`uuid_news`=`news`.`uuid_news`
					INNER JOIN `keywords` ON `keywords`.`uuid_keywords`=`news_keywords`.`uuid_keywords`
					INNER JOIN `keywords_search` ON `keywords_search`.`keyword`=`keywords`.`word_keywords`
					WHERE `news`.`news_title` LIKE(concat('%',`titleP`,'%'))
					AND `news`.`news_description` LIKE(concat('%',`descriptionP`,'%'))
					AND (`news`.`news_publication`>=DATE(`start_dateP`) AND `news`.`news_publication`<= DATE(`end_dateP`))
					AND `keywords_search`.`keyword`=`keywords`.`word_keywords`
					AND `keywords`.`status_keywords`=1 AND `news`.`news_active`=1 AND `news`.`news_status`=3
					GROUP BY `news`.`uuid_news` ORDER BY  `news`.`news_publication`  DESC  LIMIT 20;
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
			DROP TABLE `keywords_search`;
    end if;
END$$

DELIMITER ;
;

