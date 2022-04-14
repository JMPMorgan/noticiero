use bd_noticiero;

SELECT distinct
	t.table_schema as bd_noticiero,
    t.table_name,
    (CASE WHEN t.table_type='BASE TBALE' THEN 'TABLE'
		WHEN t.table_type='VIEW' THEN 'view'
        ELSE t.table_type
    END) as table_type,
    c.column_name,
    c.column_type,
    c.column_default,
    c.column_key,
    c.is_nullable,
    c.extra,
    c.column_comment
FROM information_schema.tables as t
inner join information_schema.columns as c
on t.table_name=c.table_name
AND t.table_schema=c.table_schema
WHERE t.table_type in ('BASE TABLE','VIEW')
AND t.table_schema='bd_noticiero'
ORDER BY 
	t.table_name,
    c.ordinal_position,
    c.column_name,
    t.table_schema;