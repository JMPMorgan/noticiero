USE bd_noticiero;

CREATE FUNCTION `UUID_NEWS` ()
RETURNS VARCHAR(155) DETERMINISTIC NO SQL RETURN @uuid;

CREATE VIEW `getnewsedit` AS
SELECT `news`.`news_active`,`news`.`news_description`,`news`.`news_text`,`news`.`news_archive1`,`news`.`news_archive2`,`news`.`news_archive3`,`news`.`news_archive4`,`news`.`news_archive5`,
`news`.`news_status`,
		`news`.`uuid_news`,`news`.`uuid_userC`,`news`.`news_title` FROM `news` 
        WHERE `uuid_news`=UUID_NEWS();  
        
CREATE  OR REPLACE VIEW `getsectionnewsedit` AS
	#Obtiene las secciones relacionadas a la noticia que se quiere editar
	SELECT `sections`.`section_name`,`sections`.`uuid_sections` FROM `sections`
    INNER JOIN `news_sections` ON `news_sections`.`uuid_news`=UUID_NEWS()
	WHERE `sections`.`uuid_sections`=`news_sections`.`uuid_section`;


CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `bd_noticiero`.`getkeywordsnewsedit` AS
    SELECT 
        `bd_noticiero`.`keywords`.`uuid_keywords` AS `uuid_keywords`,
        `bd_noticiero`.`keywords`.`word_keywords` AS `word_keywords`,
        `bd_noticiero`.`keywords`.`status_keywords` as `status_keywords`,
        `bd_noticiero`.`keywords`.`lastM_keywords` as `lastM_keywords`,
        `bd_noticiero`.`keywords`.`creation_keywords` as `creation_keywords`	
    FROM
        (`bd_noticiero`.`keywords`
        JOIN `bd_noticiero`.`news_keywords` ON (`bd_noticiero`.`news_keywords`.`uuid_news` = UUID_NEWS()))
    WHERE
        `bd_noticiero`.`keywords`.`uuid_keywords` = `bd_noticiero`.`news_keywords`.`uuid_keywords`;
        

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `bd_noticiero`.`getsectionnewsedit` AS
    SELECT 
        `bd_noticiero`.`sections`.`section_name` AS `section_name`,
        `bd_noticiero`.`sections`.`uuid_sections` AS `uuid_sections`,
        `bd_noticiero`.`sections`.`sections_active` as `sections_active`,
        `bd_noticiero`.`sections`.`sections_color` as `sections_color`,
        `bd_noticiero`.`sections`.`sections_lastM` as `sections_lastM`,
        `bd_noticiero`.`sections`.`sections_creation` as `sections_creation`,
        `bd_noticiero`.`sections`.`sections_status` as `sections_status`
    FROM
        (`bd_noticiero`.`sections`
        JOIN `bd_noticiero`.`news_sections` ON (`bd_noticiero`.`news_sections`.`uuid_news` = UUID_NEWS()))
    WHERE
        `bd_noticiero`.`sections`.`uuid_sections` = `bd_noticiero`.`news_sections`.`uuid_section`;
        
        
CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `bd_noticiero`.`usernews` AS
    SELECT 
        `bd_noticiero`.`users`.`user_status` AS `user_status`,
        `bd_noticiero`.`users`.`user_name` AS `user_name`,
        `bd_noticiero`.`users`.`user_email` AS `user_email`,
        `bd_noticiero`.`users`.`user_pass` AS `user_pass`,
        `bd_noticiero`.`users`.`user_uuid` AS `user_uuid`,
        `bd_noticiero`.`users`.`user_profilepic` AS `user_profilepic`,
        `bd_noticiero`.`users`.`user_lastname` AS `user_lastname`,
        `bd_noticiero`.`users`.`user_gender` AS `user_gender`,
        `bd_noticiero`.`users`.`user_nick` AS `user_nick`,
        `bd_noticiero`.`users`.`user_type` AS `user_type`,
        `bd_noticiero`.`users`.`last_modification` AS `last_modification`,
        `bd_noticiero`.`users`.`user_creation` AS `user_creation`
    FROM
        (`bd_noticiero`.`users`
        JOIN `bd_noticiero`.`news` ON (`bd_noticiero`.`news`.`uuid_userC` = `bd_noticiero`.`users`.`user_uuid`))
    WHERE
        `bd_noticiero`.`news`.`uuid_news` = UUID_NEWS()
        

CREATE  OR REPLACE VIEW `getmultimedia_news` AS
	SELECT `multimedia_news`.`idmulti_news`,`multimedia_news`.`name_archive`,`multimedia_news`.`type_archive`,`multimedia_news`.`archive`,`multimedia_news`.`uuid_noticia`,`multimedia_news`.`creation_time`,
    `multimedia_news`.`lastM_multinews` FROM `multimedia_news` WHERE `uuid_noticia`=UUID_NEWS();
    
USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`getNSK_sp`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getNSK_sp`(IN `opc` int,IN `uuid_newsP` varchar(155))
BEGIN
	#SP para obtener la informacion relacionada a una noticia
	SET @uuid:=`uuid_newsP`;
	IF(`opc`=0)#Obtener la noticia sin keywords ni sections
    THEN
		SELECT news.* FROM `getnewsedit` news; 
	ELSEIF(`opc`=1)#Obtener sections
    THEN
		SELECT sections.* from `getsectionnewsedit` sections;
    
    ELSEIF(`opc`=2)#Obtener Keywords
	THEN
		SELECT keywords.* from `getkeywordsnewsedit` keywords;
	ELSEIF(`opc`=3) #obtener la multimedia de la noticia
    THEN 
		SELECT multimedia_news.* from `getmultimedia_news` multimedia_news;
	ELSEIF(`opc`=4)#Obtener la informacion del usuario que hizo la noticia
    THEN
		select users.* from `usernews` users;
	ELSEIF(`opc`=5)#Obtiene la noticias del reportero registrado 
	THEN
		#Se utiliza en loadNews.php
		SELECT `news_title`,DATE_FORMAT(`news_date`,'%d/%c/%Y') as `news_date`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`,`news_active`,`uuid_news`,`news_status` 
        FROM `news` WHERE `uuid_userC`=`uuid_newsP`;
    END IF;
END$$

DELIMITER ;
;


CALL getNSK_sp(1,'e75c4f82143aa939a0ceda66436f62a4');
        
        


