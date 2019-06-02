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
