# SQL Commands to return various info

SQL commands on a sqlite databASe for gnucash. Commands are to retrieve info for all parts of a web interface that would include reporting and entering of data.

## Returns all expenses grouped by month

```SQL
SELECT strftime('%Y-%m',post_date) AS "month", 
SUM(splits.quantity_num / splits.quantity_denom) AS quantity, accounts.name
from transactions
LEFT JOIN splits ON splits.tx_guid = transactions.guid
LEFT JOIN accounts ON splits.account_guid = accounts.guid
WHERE accounts.account_type LIKE "%EXPENSE%"
group by "month", account_guid
```

## Return a list of all transactions with all splits for a given account

```SQL
select transactions.description, transactions.post_date, a.name, parent.name AS parent from splits 
left join transactions on splits.tx_guid = transactions.guid
left join splits AS s on transactions.guid = s.tx_guid
left join accounts AS a on s.account_guid = a.guid
left join accounts AS parent on a.parent_guid = parent.guid
where splits.account_guid = "346723ca372c085551eb2fe8fc3f01f1"
order by transactions.post_date desc
```

## Return a list of all balances

```SQL
select sum(s.value_num / s.value_denom) AS 'value', sum(s.quantity_num / s.quantity_denom) AS 'quantity', a.name, parent.name 
from splits AS s
left join accounts AS a on s.account_guid = a.guid
left join accounts AS parent on a.parent_guid = parent.guid
group by s.account_guid
order by quantity desc
```

## Return an OUTER JOIN from sqlite

Sqlite doesn't support OUTER JOIN so you can make it up with a union all from opposing LEFT JOINs.

```SQL
SELECT splits.*, transactions.* FROM splits
LEFT JOIN transactions ON splits.tx_guid = transactions.guid
UNION ALL
SELECT splits.*, transactions.* FROM transactions
LEFT JOIN splits ON transactions.guid = splits.tx_guid
WHERE splits.tx_guid IS NULL
```

## Recursive CTE

The Recursive Common Table Expression or CTE is able to return the nested structure of hierarchical self-referencing data.

```SQL
WITH RECURSIVE `ancestors` AS (
	SELECT a.*, 0 AS depth
	FROM accounts AS a
	WHERE a.guid = "fd4dd79886327b270a0fa8efe6a07972" 
	
	union ALL
	
	SELECT a.*, c.depth + 1 AS depth
	FROM accounts AS a
	INNER JOIN ancestors AS c ON c.guid = a.parent_guid
	)

SELECT * from ancestors
```

## Example Returns nested JSON object

<https://bender.io/2013/09/22/returning-hierarchical-data-in-a-single-sql-query/>

```SQL
WITH RECURSIVE employeetree AS (
  WITH employeeprojects AS (
    SELECT
      p.employee_id,
      json_agg(p.*) as projects
    FROM (
      SELECT
        p.*,
        date_part('day', age(now(), dateassigned::timestamp)) as age
      FROM project p
    ) AS p
    GROUP BY p.employee_id
  )

  SELECT
    e.*,
    null::json as superior,
    COALESCE(ep.projects, '[]') as projects
  FROM employee e
  LEFT JOIN employeeprojects ep
    USING(employee_id)
  WHERE superior_id IS NULL

  UNION ALL

  SELECT
    e.*,
    row_to_json(sup.*) as superior,
    COALESCE(ep.projects, '[]') as projects
  FROM employee e
  INNER JOIN employeetree sup
    ON sup.employee_id = e.superior_id
  LEFT JOIN employeeprojects ep
    ON ep.employee_id = e.employee_id
)

SELECT *
FROM employeetree
WHERE employee_id = 7
```

## Return a single nested JSON object with root at top

<https://tapoueh.org/blog/2018/01/exporting-a-hierarchy-in-json-with-recursive-queries/>

```SQL
with recursive dndclasses_from_parents as
(
         -- Classes with no parent, our starting point
      select id, name, '{}'::int[] as parents, 0 as level
        from dndclasses
       where parent_id is NULL

   union all

         -- Recursively find sub-classes and append them to the result-set
      select c.id, c.name, parents || c.parent_id, level+1
        from      dndclasses_from_parents p
             join dndclasses c
               on c.parent_id = p.id
       where not c.id = any(parents)
),
    dndclasses_from_children as
(
         -- Now start from the leaf nodes and recurse to the top-level
         -- Leaf nodes are not parents (level > 0) and have no other row
         -- pointing to them as their parents, directly or indirectly
         -- (not id = any(parents))
     select c.parent_id,
            json_agg(jsonb_build_object('Name', c.name))::jsonb as js
       from dndclasses_from_parents tree
            join dndclasses c using(id)
      where level > 0 and not id = any(parents)
   group by c.parent_id

  union all

         -- build our JSON document, one piece at a time
         -- as we're traversing our graph from the leaf nodes, 
         -- the bottom-up traversal makes it possible to accumulate
         -- sub-classes as JSON document parts that we glue together
     select c.parent_id,
     
               jsonb_build_object('Name', c.name)
            || jsonb_build_object('Sub Classes', js) as js

       from dndclasses_from_children tree
            join dndclasses c on c.id = tree.parent_id
)
-- Finally, the traversal being done, we can aggregate
-- the top-level classes all into the same JSON document,
-- an array.
select jsonb_pretty(jsonb_agg(js))
  from dndclasses_from_children
 where parent_id IS NULL;
 ```

Working on my SQL for recursive tree:

This returns the first half correctly.

```SQL
with recursive accountclasses_from_parents as
(
         -- Classes with no parent, our starting point
      select guid, name, "" as parents, 0 as level
        from accounts
       where guid = "fd4dd79886327b270a0fa8efe6a07972"

   union all

         -- Recursively find sub-classes and append them to the result-set
      select c.guid, c.name, parents || c.parent_guid, level+1
        from accountclasses_from_parents p
             join accounts c
               on c.parent_guid = p.guid
       --where not c.guid LIKE '%'||parents||'%'
)
select * from accountclasses_from_parents
```

Second half of this query not exactly correct I guess: 

```SQL
with recursive accountclasses_from_parents as
(
  -- Classes with no parent, our starting point
  select guid, name, "" as parents, 0 as level
  from accounts
  where guid = "fd4dd79886327b270a0fa8efe6a07972"

  union all

  -- Recursively find sub-classes and append them to the result-set
  select c.guid, c.name, parents || c.parent_guid, level+1
  from accountclasses_from_parents p
  join accounts c
  on c.parent_guid = p.guid
  --where not c.guid LIKE '%'||parents||'%'
),
  accounts_from_children as
(
  -- Now start from the leaf nodes and recurse to the top-level
  -- Leaf nodes are not parents (level > 0) and have no other row
  -- pointing to them as their parents, directly or indirectly
  -- (not id = any(parents))
  select c.parent_guid, json_group_array(json_object('Name', c.name)) as js
  from accountclasses_from_parents tree
  join accounts c using(guid)
  where level > 0 and not guid LIKE '%'||parents||'%'
  group by c.parent_guid

  union all

  -- build our JSON document, one piece at a time
  -- as we're traversing our graph from the leaf nodes, 
  -- the bottom-up traversal makes it possible to accumulate
  -- sub-classes as JSON document parts that we glue together
  select c.parent_guid,
     
  json_object('Name', c.name) || json_object('Children', js) as js

  from accounts_from_children tree
  join accounts c on c.guid = tree.parent_guid
)
-- Finally, the traversal being done, we can aggregate
-- the top-level classes all into the same JSON document,
-- an array.
select json_group_array(js)
from accounts_from_children
where parent_guid IS NULL;
```
