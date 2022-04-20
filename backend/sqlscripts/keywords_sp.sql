DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `keywords` (in `opc` int , in `keywordP` varchar(155),in `uuidP` varchar(155))
BEGIN
	IF (`opc`=0)
    THEN #Insertar una nueva keyword
		#Utilizado en insertkeyword.php
		INSERT INTO `keywords` (`word_keywords`,`creation_keywords`,`uuid_keywords`,`status_keywords`) 
            VALUES(`keywordP`,NOW(),`uuidP`,1);
	ELSEIF(`opc`=1)
    THEN
		#Utilizado en getSectionsKeywords.php
		SELECT `uuid_keywords`,`word_keywords` FROM `keywords` WHERE `status_keywords`=1;
	ELSEIF(`opc`=2)
    THEn
		#UTILIZADO en editKeywords.php
		UPDATE `keywords` SET `word_keywords`=`keywordP` WHERE `uuid_keywords`=`uuidP`;
	ELSEIF(`opc`=3)
    THEN	
		#UTILIZADO en deleteKeywords.php
		UPDATE `keywords` SET `status_keywords`=0  WHERE `uuid_keywords`=`uuidP`;
    END IF;
END$$

DELIMITER ;