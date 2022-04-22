USE `bd_noticiero`;
DROP procedure IF EXISTS `bd_noticiero`.`sections`;
;

DELIMITER $$
USE `bd_noticiero`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sections`(in `opc` int,in  `name` varchar(155),in `color` varchar(45),in `importance` int, in `uuid` varchar(155))
BEGIN
	if(`opc`=0)#Insertar una section
    then
		INSERT INTO `sections` (`section_name`,`sections_color`,`sections_active`,`sections_status`,
            `sections_creation`,`sections_lastM`,`uuid_sections`) 
            VALUES(`name`,`color`,1,`importance`,NOW(),NOW(),`uuid`);
	elseif(`opc`=1)#Verifica si el nombre de la seleccion se va insertar
    then 
		SELECT count(`section_name`) as `numero` FROM `sections` WHERE `section_name`=`name` and `sections_active`=1;
	elseif(`opc`=2)#Update section
    then
		UPDATE `sections` set `section_name`=`name`,`sections_color`=`color`,`sections_status`=`importance`,`sections_lastM`=NOW() WHERE `uuid_sections`=`uuid`;
	elseif(`opc`=3)#Select de una seccion aunque se haya borrado
    THEN 
		SELECT `section_name`,`uuid_sections` FROM `sections` ORDER BY `sections_status` DESC;
	elseif(`opc`=4)#Update de el status maximo 
    THEN 
		#Utilizado en changeStatusSections.php
		UPDATE `sections` SET `sections_status`=`importance` WHERE `uuid_sections`=`uuid` ;
	elseif(`opc`=5)#Obtiene informacion de sections
    THEN
		#Utilizado en getSectionsKeywords.php
        SELECT `uuid_sections`,`section_name`,`sections_color`,`sections_status` FROM `sections` WHERE `sections_active`=1;
	elseif(`opc`=6)#Obtiene cuantas secciones estan en status maximo
	THEN
		SELECT COUNT(`uuid_sections`) as `numero` FROM `sections` WHERE `sections_status`=100;
	elseif(`opc`=7)#"Eliminar"  Sections y eliminar las relaciones de las secciones con la noticias
    THEN
		UPDATE `sections` SET `sections_active`=0 WHERE `uuid_sections`=`uuid`;
        DELETE FROM `news_sections` WHERE `uuid_section`=`uuid`;
	elseif(`opc`=8)#Select de todas las secciones no "Eliminadas"
    THEN
		SELECT `section_name`,`uuid_sections` FROM `sections` WHERE `sections_active`=1 ORDER BY `sections_status` DESC;
    end if;
END$$

DELIMITER ;
;