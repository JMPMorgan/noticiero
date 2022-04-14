CREATE DEFINER=`root`@`localhost` PROCEDURE `searchKeywords`(in `word` varchar(155))
BEGIN
 #BUSCA LAS KEYWORDS QUE ESTAN EN LA BD PARA INGRESARLAS EN UNA NOTICIA
	SELECT `word_keywords`,`uuid_keywords` from `keywords` where `status_keywords`=1 AND `word_keywords` like CONCAT(`word`,'%') Limit 5 ;
END