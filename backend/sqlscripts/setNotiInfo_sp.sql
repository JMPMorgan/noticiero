CREATE PROCEDURE `setNotiInfo_sp` (in `opc` int,in `uuid` varchar(155),in `uuid_2` varchar(155),in `description` varchar(155),
								   in `text` mediumtext ,in `status` int,in `date` date,in `publication_date` date,in `title` varchar(155), in `archive` mediumblob)
BEGIN
	IF(`opc`=0) #INSERTAR NOTICIAS
    THEN
		INSERT INTO `bd_noticiero`.`news`
		(`news_active`,`news_description`,`news_text`,`news_status`,`uuid_news`,`news_date`,`news_publication`,`news_creation`,`uuid_userC`,`news_title`)
			VALUES
		(1,`description`,`text`,`status`,`uuid`,`date`,`publication_date`,NOW(),`uuid_2`,`title`);
	ELSEIF(`opc`=1)#INSERTAR RELACION ENTRE PALABRAS CLAVES_NOTICIA
    THEN
		INSERT INTO `bd_noticiero`.`news_keywords`
			(`uuid_news`,`uuid_keywords`,`creation_news-keywords`)
		VALUES
			(`uuid`,`uuid_2`,NOW());
	ELSEIF(`opc`=2)#INSERTAR RELACION ENTRE SECTIONS_NOTICIAS
    THEN
		INSERT INTO `bd_noticiero`.`news_sections`
			(`uuid_news`,`uuid_section`,`news_sections_date`)
		VALUES
			(`uuid`,`uuid_2`,NOW());
	ELSEIF(`opc`=3)
    THEN
		INSERT INTO `bd_noticiero`.`multimedia_news`
			(`type_archive`,`name_archive`,`archive`,`uuid_noticia`,`creation_time`,`lastM_multinews`)
		VALUES
			(`description`,`title`,`archive`,`uuid`,NOW(),NOW());
    END IF;
END