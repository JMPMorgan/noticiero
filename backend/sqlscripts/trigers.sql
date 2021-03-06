	DELIMITER $$
     CREATE TRIGGER `agregarLike_log`
     BEFORE DELETE on `likes`
     FOR EACH ROW
     BEGIN 
      INSERT INTO `likes_log`(`uuid_user`,`uuid_news`,`creation_time`)VALUES(OLD.`uuid_userL`,OLD.`uuid_newsL`,NOW());
	END $$
    DELIMITER ; 
     
	DELIMITER $$
     CREATE TRIGGER `agregarComment_log`
     BEFORE DELETE on `comments`
     FOR EACH ROW
     BEGIN 
      INSERT INTO `comments_log`(`uuid_owner`,`comment`,`uuid_news`,`change_status`)VALUES(OLD.`uuid_user`,OLD.`comments_text`,OLD.`uuid_news`,NOW());
	END $$
    DELIMITER ; 
    
    	DELIMITER $$
     CREATE TRIGGER `agregarSections_log`
     BEFORE DELETE on `news_sections`
     FOR EACH ROW
     BEGIN 
      INSERT INTO `news_sections_log`(`uuid_sections`,`uuid_news`,`creation_date`)VALUES(OLD.`uuid_section`,OLD.`uuid_news`,NOW());
	END $$
    DELIMITER ; 