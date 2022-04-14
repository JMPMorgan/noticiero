	DELIMITER $$
     CREATE TRIGGER `agregarLike_log`
     BEFORE DELETE on `likes`
     FOR EACH ROW
     BEGIN 
      INSERT INTO `likes_log`(`uuid_user`,`uuid_news`,`creation_time`)VALUES(OLD.`uuid_userL`,OLD.`uuid_newsL`,NOW());
	END $$
    DELIMITER ; 
     