USE `bd_noticiero`;
DROP procedure IF EXISTS `sections`;

DELIMITER $$
USE `bd_noticiero`$$
CREATE PROCEDURE `sections` (in `opc` int,in  `name` varchar(155),in `color` varchar(45),in `importance` int, in `uuid` varchar(155))
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
    end if;
END$$

DELIMITER ;