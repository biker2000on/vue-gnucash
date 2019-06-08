-- Returns a table of results for display in transaction journal.

SELECT 
  CASE
    WHEN x.value_num > 0 THEN CAST(x.value_num as real) / CAST(x.value_denom as REAL)
    WHEN x.value_num < 0 THEN NULL
    ELSE 0
  END as debit_value,
  CASE
    WHEN x.value_num > 0 THEN NULL
    WHEN x.value_num < 0 THEN CAST(ABS(x.value_num) as real) / CAST(x.value_denom as REAL)
    ELSE 0
  END as credit_value,
  CASE
    WHEN x.quantity_num > 0 THEN CAST(x.quantity_num as real) / CAST(x.quantity_denom as REAL)
    WHEN x.quantity_num < 0 THEN NULL
    ELSE 0
  END as debit_quantity,
  CASE
    WHEN x.quantity_num > 0 THEN NULL
    WHEN x.quantity_num < 0 THEN CAST(ABS(x.quantity_num) as real) / CAST(x.quantity_denom as REAL)
    ELSE 0
  END as credit_quantity,
  max(
    CASE
      WHEN a.account_type != 'TRADING'
      AND s.account_guid != '346723ca372c085551eb2fe8fc3f01f1' THEN a.name
      ELSE NULL
    END
  ) as 'account_guid',
  a.name,
  t.description,
  t.post_date,
  c.mnemonic,
  a.account_type,
  json_group_array(
    json_object(
      'account_guid',
      a.guid,
      'value',
      CAST(s.value_num AS REAL) / CAST(s.value_denom AS REAL),
      'quantity',
      CAST(s.quantity_num AS REAL) / CAST(s.quantity_denom AS REAL),
      'debit_quantity',
      CASE
        WHEN s.quantity_num > 0 THEN CAST(s.quantity_num as real) / CAST(s.quantity_denom as REAL)
        WHEN s.quantity_num < 0 THEN NULL
        ELSE 0
      END,
      'credit_quantity',
      CASE
        WHEN s.quantity_num > 0 THEN NULL
        WHEN s.quantity_num < 0 THEN CAST(ABS(s.quantity_num) as real) / CAST(s.quantity_denom as REAL)
        ELSE 0
      END,
      'debit_value',
      CASE
        WHEN s.value_num > 0 THEN CAST(s.value_num as real) / CAST(s.value_denom as REAL)
        WHEN s.value_num < 0 THEN NULL
        ELSE 0
      END,
      'credit_value',
      CASE
        WHEN s.value_num > 0 THEN NULL
        WHEN s.value_num < 0 THEN CAST(ABS(s.value_num) as real) / CAST(s.value_denom as REAL)
        ELSE 0
      END
    )
  ) as 'splits'
FROM
  splits x
  join transactions t on t.guid = x.tx_guid
  join splits s on t.guid = s.tx_guid
  join accounts a on s.account_guid = a.guid
  join commodities c on c.guid = t.currency_guid
where
  x.account_guid = '346723ca372c085551eb2fe8fc3f01f1'
Group BY
  t.guid
ORDER BY t.post_date