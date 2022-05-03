USE `bd_noticiero`;
DROP procedure IF EXISTS `location_news_sp`;

DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `location_news_sp` (in `uuid_newsP` varchar(155),in `countryP` varchar(155),in `cityP` varchar(155),in `latP` float,in `lngP` float )
BEGIN
	INSERT INTO `location_news`(`uuid_news`,`country`,`city`,`lat`,`lng`) VALUES (`uuid_newsP`,`countryP`,`cityP`,`latP`,`lngP`);
END$$

DELIMITER ;