const { gql } = require('apollo-server')

const enums = gql`
  enum Account_Type {
    TRADING
    EXPENSE
    INCOME
    ASSET
    ROOT
    BANK
    PAYABLE
    LIABILITY
    CREDIT
    RECEIVABLE
    STOCK
    CASH
    MUTUAL
    EQUITY
  }

  enum Actions {
    Buy
    Increase
    Decrease
    Sell
  }

  enum Periods { # need to be lowercased when applied to db.
    DAY
    WEEK
    MONTH
    YEAR
  }

  enum WeekendAdjust { # need to be lowercased when applied to db.
    NONE
    BACK
    FORWARD
  }
`

module.exports = {
  enums
}