--Trying to calculate a running balance for an account.

WITH RECURSIVE running(id, name, gdppc, rt) AS (
    SELECT row1._rowid_, row1.name, row1.gdppc, COALESCE(row1.gdppc,0)
    FROM gdppc AS row1
    WHERE row1._rowid_ = (
        SELECT a._rowid_
        FROM gdppc AS a
        ORDER BY a.gdppc, a.name, a._rowid_
        LIMIT 1)
    UNION ALL
    SELECT row_n._rowid_, row_n.name, row_n.gdppc, COALESCE(row_n.gdppc,0)+running.rt
    FROM gdppc AS row_n INNER JOIN running
    ON row_n._rowid_ = (
        SELECT a._rowid_
        FROM gdppc AS a
        WHERE (a.gdppc, a.name, a._rowid_) > (running.gdppc, running.name, running.id)
        ORDER BY a.gdppc, a.name, a._rowid_
        LIMIT 1))
SELECT running.name, running.gdppc, running.rt
FROM running;

WITH RECURSIVE running AS (
  SELECT *, COAlESCE(s.value_num,0) as running_balance
  FROM splits AS s 
  JOIN transactions t ON t.guid = s.tx_guid
  WHERE s.account_guid = '346723ca372c085551eb2fe8fc3f01f1'
  ORDER BY t.post_date
  LIMIT 1

  UNION ALL

  SELECT *, COAlESCE(s.value_num,0) + next.running_balance as running_balance
  FROM splits AS s 
  JOIN transactions t ON t.guid = s.tx_guid
  INNER JOIN running
  ON s.guid = (
    SELECT a.guid
    FROM splits a 
    JOIN transactions x on a.tx_guid = x.guid
    WHERE s.account_guid = '346723ca372c085551eb2fe8fc3f01f1' AND 
    ORDER BY x.post_date


