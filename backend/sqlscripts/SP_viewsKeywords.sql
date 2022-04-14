use bd_noticiero;
USE `bd_noticiero`;
DROP procedure IF EXISTS `viewsKeywords`;

DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `viewsKeywords` (in `opc` int, in `uuid` varchar(155))
BEGIN
	SET @uuid:=`uuid`;
	if(`opc`=0) #TODAS LAS KEYWORDS
    then
		SELECT keywords.* from `allkeywords` keywords;
    
    elseif(`opc`=1)#Solo las que estan activas
	then 
		SELECT keywords.* from `keywords_actives` keywords;
	elseif(`opc`=2)#Las keywords relacionadas con la noticia
    then
		SELECT keywords.* from `keywordsnews` keywords;
    end if;
END$$

DELIMITER ;