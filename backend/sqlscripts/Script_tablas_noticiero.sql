CREATE DATABASE bd_noticiero;
USE bd_noticiero;
CREATE TABLE `bd_noticiero`.`users` (
  `user_staus` INT NOT NULL,
  `user_name` VARCHAR(155) NOT NULL,
  `user_email` VARCHAR(155) NOT NULL,
  `user_pass` VARCHAR(155) NOT NULL,
  `user_uuid` VARCHAR(155) NOT NULL,
  `user_profilepic` VARCHAR(155) NOT NULL,
  `user_lastname` VARCHAR(155) NOT NULL,
  `user_gender` INT NOT NULL,
  `user_nick` VARCHAR(155) NOT NULL,
  `user_type` INT NOT NULL,
  `last_modification` DATETIME NOT NULL,
  `user_creation` TIMESTAMP NOT NULL,
  PRIMARY KEY (`user_uuid`));

CREATE TABLE `bd_noticiero`.`keywords` (
  `status_keywords` INT NOT NULL,
  `uuid_keywords` VARCHAR(155) NOT NULL,
  `word_keywords` VARCHAR(45) NOT NULL,
  `lasstM_keywords` DATETIME NOT NULL,
  `creation_keywords` DATETIME NOT NULL,
  PRIMARY KEY (`uuid_keywords`));

CREATE TABLE `bd_noticiero`.`news` (
  `news_active` INT NOT NULL,
  `news_description` VARCHAR(255) NOT NULL,
  `news_text` MEDIUMTEXT NOT NULL,
  `news_status` INT NOT NULL,
  `uuid_news` VARCHAR(155) NOT NULL,
  `news_date` DATE NULL,
  `news_publication` DATE NULL,
  `news_creation` TIMESTAMP NOT NULL,
  `uuid_userC` VARCHAR(155) NOT NULL,
  `news_title` VARCHAR(155) NOT NULL,
  PRIMARY KEY (`uuid_news`));
  
ALTER TABLE `news` ADD FOREIGN KEY (`uuid_userC`) 
REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `bd_noticiero`.`sections` (
  `section_name` VARCHAR(155) NOT NULL,
  `uuid_sections` VARCHAR(155) NOT NULL,
  `sections_active` INT NOT NULL,
  `sections_color` VARCHAR(45) NOT NULL,
  `sections_lastM` DATETIME NOT NULL,
  `sections_creation` TIMESTAMP NOT NULL,
  `sections_status` INT NOT NULL,
  PRIMARY KEY (`uuid_sections`));
  
  CREATE TABLE `bd_noticiero`.`likes` (
  `id_likes` INT NOT NULL AUTO_INCREMENT,
  `uuid_userL` VARCHAR(155) NOT NULL,
  `uuid_newsL` VARCHAR(155) NOT NULL,
  `status` INT NOT NULL,
  `likes_lastM` DATETIME NOT NULL,
  `likes_creation` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id_likes`));
  
ALTER TABLE `likes` ADD FOREIGN KEY (`uuid_newsL`) 
REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `likes` ADD FOREIGN KEY (`uuid_userL`) 
REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `bd_noticiero`.`communications` (
  `id_communications` INT NOT NULL AUTO_INCREMENT,
  `uuid_from` VARCHAR(155) NOT NULL,
  `uuid_for` VARCHAR(155) NOT NULL,
  `communication_message` TEXT NOT NULL,
  `communication_date` TIMESTAMP NOT NULL,
  `communication_status` INT NOT NULL,
  `communication_lastM` DATETIME NOT NULL,
  `uuid_referencenews` VARCHAR(155) NULL,
  PRIMARY KEY (`id_communications`));

ALTER TABLE `communications` ADD FOREIGN KEY (`uuid_for`)
 REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;
 
ALTER TABLE `communications` ADD FOREIGN KEY (`uuid_from`) 
REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `communications` ADD FOREIGN KEY (`uuid_referencenews`) 
REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `bd_noticiero`.`news_keywords` (
  `id_news_keywords` INT NOT NULL AUTO_INCREMENT,
  `uuid_news` VARCHAR(155) NOT NULL,
  `uuid_keywords` VARCHAR(155) NOT NULL,
  `creation_news_keywords` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id_news_keywords`));
  
ALTER TABLE `news_keywords` ADD FOREIGN KEY (`uuid_keywords`) 
REFERENCES `keywords`(`uuid_keywords`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `news_keywords` ADD FOREIGN KEY (`uuid_news`) 
REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `bd_noticiero`.`news_sections` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid_news` VARCHAR(155) NOT NULL,
  `uuid_section` VARCHAR(155) NOT NULL,
  `news_sections_date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));
  
ALTER TABLE `news_sections` ADD FOREIGN KEY (`uuid_news`)
 REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;
 
ALTER TABLE `news_sections` ADD FOREIGN KEY (`uuid_section`) 
REFERENCES `sections`(`uuid_sections`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `bd_noticiero`.`comments` (
  `uuid_comments` VARCHAR(155) NOT NULL,
  `uuid_user` VARCHAR(155) NOT NULL,
  `uuid_news` VARCHAR(155) NOT NULL,
  `status` INT NOT NULL,
  `comments_text` VARCHAR(255) NOT NULL,
  `comments_creation` TIMESTAMP NOT NULL,
  PRIMARY KEY (`uuid_comments`));
  
ALTER TABLE `comments` ADD FOREIGN KEY (`uuid_news`) 
REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `comments` ADD FOREIGN KEY (`uuid_user`) 
REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `bd_noticiero`.`comments` 
ADD COLUMN `uuid_main` VARCHAR(155) NULL COMMENT 'Llave foranea de a quien pertenece el comentario al que esta respondiendo si es el caso(FK)' AFTER `comments_creation`;
ALTER TABLE `comments` ADD FOREIGN KEY (`uuid_main`) REFERENCES `comments`(`uuid_comments`) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE `bd_noticiero`.`multimedia_news` (
  `idmulti_news` INT NOT NULL AUTO_INCREMENT COMMENT 'Clave Primaria',
  `type_archive` VARCHAR(45) NULL COMMENT 'Tipo de arhivo del archivo(jpg,mp4,etc..)',
  `archive` MEDIUMBLOB NULL COMMENT 'archivo en formato blob',
  `name_archive` VARCHAR(155) NULL COMMENT 'Nombre del archivo',
  `uuid_noticia` VARCHAR(155) NULL COMMENT 'Llave foranea de el id de la noticia a la que pertenece el archivo',
  `creation_time` TIMESTAMP NULL COMMENT 'Fecha de Creacion',
  `lastM_multinews` DATETIME NULL COMMENT 'Ultima vez que se modifico',
  PRIMARY KEY (`idmulti_news`));

ALTER TABLE `multimedia_news` ADD FOREIGN KEY (`uuid_noticia`) 
REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE `bd_noticiero`.`likes_log` (
  `idlikes_log` INT NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria',
  `creation_time` TIMESTAMP NULL COMMENT 'Fecha de cuando se quito el like',
  `uuid_user` VARCHAR(155) NULL COMMENT 'id del usuario',
  `uuid_news` VARCHAR(155) NULL COMMENT 'id de la noticia',
  PRIMARY KEY (`idlikes_log`))
COMMENT = 'Tabla donde se guarda la eliminacion de los likes en las noticias';

ALTER TABLE `likes_log` ADD FOREIGN KEY (`uuid_news`) REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `likes_log` ADD FOREIGN KEY (`uuid_user`) REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;


CREATE TABLE `bd_noticiero`.`views_news` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Clave Primaria',
  `uuid_user` VARCHAR(155) NULL COMMENT 'usuario que hizo la visita',
  `uuid_news` VARCHAR(155) NULL COMMENT 'Id de la noticia',
  `creation_date` TIMESTAMP NULL COMMENT 'Fecha de cuando se hizo la noticia',
  PRIMARY KEY (`id`))
COMMENT = 'Tabla para almacenar las visitas a las noticias';

ALTER TABLE `views_news` ADD FOREIGN KEY (`uuid_news`) REFERENCES `news`(`uuid_news`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `views_news` ADD FOREIGN KEY (`uuid_user`) REFERENCES `users`(`user_uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `bd_noticiero`.`comments_log` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria',
  `uuid_comment` VARCHAR(155) NULL COMMENT 'Id del comentario que se esta cambiando',
  `old_status` INT NULL COMMENT 'Viejo status del comentario',
  `change_status` TIMESTAMP NULL COMMENT 'Fecha de cuando cambio ese status',
  `new_status` INT NULL COMMENT 'Nuevo status del comentario',
  PRIMARY KEY (`id`))
COMMENT = 'Tabla donde se almacena el cambio de status en los comentarios';

ALTER TABLE `comments_log` ADD FOREIGN KEY (`uuid_comment`) REFERENCES `comments`(`uuid_comments`) ON DELETE RESTRICT ON UPDATE RESTRICT;

