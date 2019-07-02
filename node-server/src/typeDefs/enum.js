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
    day
    week
    month
    year
  }

  enum WeekendAdjust { # need to be lowercased when applied to db.
    none
    back
    forward
  }
`

module.exports = {
  enums
}