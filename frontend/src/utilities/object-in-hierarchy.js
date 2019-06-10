export default function object_in_hierarchy(guid, accounts) {
  for (let acct of accounts) {
    if (acct.guid == guid) {
      return acct
    }
  }
  for (let acct of accounts) {
    if (acct.children) {
      // console.log(acct.children)
      let account = object_in_hierarchy(guid, acct.children)
      if (account) {
        return account
      }
    }
  }
  return undefined
}