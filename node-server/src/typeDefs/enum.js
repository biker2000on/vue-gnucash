const { gql } = require('apollo-server')

const enums = gql`
  enum Account_type {
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
`

module.exports = {
  enums
}