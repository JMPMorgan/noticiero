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
     BEFORE UPDATE on `comments`
     FOR EACH ROW
     BEGIN 
      INSERT INTO `comments_log`(`uuid_comment`,`old_status`,`new_status`,`change_status`)VALUES(OLD.`uuid_comments`,OLD.`status`,NEW.`status`,NOW());
	END $$
    DELIMITER ; 