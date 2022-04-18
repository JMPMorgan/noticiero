use bd_noticiero;
#CUANDO MANDA SECCIONES
SELECT `sections`.`section_name`,
		DATE_FORMAT(`news`.`news_publication`,'%M/%Y') as `date`,
        COUNT(`likes`.`id_likes`) AS `likes`,
        COUNT(`comments`.`uuid_comments`) as `comments` 
        FROM `news_sections`
INNER JOIN `news` ON `news`.`uuid_news`=`news_sections`.`uuid_news`
CROSS JOIN `sections` on `sections`.`uuid_sections`=`news_sections`.`uuid_section`
LEFT JOIN `likes`on `likes`.`uuid_newsL`=`news_sections`.`uuid_news`
LEFT JOIN `comments` ON `comments`.`uuid_news`=`news_sections`.`uuid_news`
WHERE `news`.`news_publication` BETWEEN DATE('2022-01-01') AND DATE('2022-04-17')
AND `sections`.`uuid_sections` IN ('43e6f4edffc2a0dc94d3eb5643e9f873','862529cefd780ea262b48bbba9f6720e','99ad99f2912189d66705178ca94326e8','fe6aef52cd278976acde2a7953f730f8')
group by `sections`.`uuid_sections`,DATE_FORMAT(`news`.`news_publication`,'%M/%Y');


#CUANDO NO MANDA SECCIONES
SELECT `sections`.`section_name`,
		DATE_FORMAT(`news`.`news_publication`,'%M/%Y') as `date`,
        COUNT(`likes`.`id_likes`) AS `likes`,
        COUNT(`comments`.`uuid_comments`) as `comments` 
        FROM `news_sections`
INNER JOIN `news` ON `news`.`uuid_news`=`news_sections`.`uuid_news`
CROSS JOIN `sections` on `sections`.`uuid_sections`=`news_sections`.`uuid_section`
LEFT JOIN `likes`on `likes`.`uuid_newsL`=`news_sections`.`uuid_news`
LEFT JOIN `comments` ON `comments`.`uuid_news`=`news_sections`.`uuid_news`
WHERE `news`.`news_publication` BETWEEN DATE('2022-01-01') AND DATE('2022-04-17')
AND `sections`.`uuid_sections` IN ('43e6f4edffc2a0dc94d3eb5643e9f873','862529cefd780ea262b48bbba9f6720e','99ad99f2912189d66705178ca94326e8','fe6aef52cd278976acde2a7953f730f8')
group by `sections`.`uuid_sections`,DATE_FORMAT(`news`.`news_publication`,'%M/%Y');


SELECT * FROM `likes`;