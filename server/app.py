from flask import Flask, request
from flask_restful import Resource, Api, abort, reqparse
from flask_cors import CORS
import piecash

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

# db = '/mnt/c/Users/Justin/Documents/Finance/mymoney.sqlite.gnucash'
db = r'C:\Users\Justin\Documents\Finance\mymoney.sqlite.gnucash'
book = piecash.open_book('sqlite:///' + db + '?check_same_thread=False', readonly=True, do_backup=False, open_if_lock=True)

# need to add query parameters to all plural resources

def account_hierarchy(account_guid):
    account = book.accounts(guid=account_guid)
    if account.children:
        return {
            'name': account.name, 
            'type': account.type,
            'guid': account.guid,
            'children': [account_hierarchy(acct.guid) for acct in account.children]
        }
    else:
        return {
            'name': account.name, 
            'type': account.type,
            'guid': account.guid,
            'children': []
        }
class Accounts(Resource):
    # can filter by name, type, fullname, commodity
    def get(self):
        return [account_hierarchy(acct.guid) for acct in book.root_account.children]
        # accounts = [{'name': account.name, 
        # 'parent': account.parent.name, 
        # 'type': account.type,
        # 'guid': account.guid} for account in book.accounts]
        # return accounts

class Account(Resource):
    def get(self, account_guid):
        account = book.accounts(guid=account_guid)
        return {
            'name': account.name, 
            'parent': account.parent.name, 
            'type': account.type,
            'guid': account.guid
        }

class Account_Register(Resource):
    def get(self, account_guid):
        account = book.accounts(guid=account_guid)
        transaction_splits = {}
        start = request.args.get('start', 1, int)
        limit = request.args.get('limit', 20, int)
        transaction_splits['count'] = 10000 #placeholder amount to quicken up query time, might take it out
        transaction_splits['start'] = start
        transaction_splits['limit'] = limit
        # splits = account.splits
        if transaction_splits['start'] == 1:
            transaction_splits['previous'] = ''
        else: 
            transaction_splits['previous'] = f"/account/{account_guid}/transactions?start={max(start - limit,1)}&limit={limit}"
        if transaction_splits['start'] + transaction_splits['limit'] < transaction_splits['count']:
            transaction_splits['next'] = f"/account/{account_guid}/transactions?start={start + limit}&limit={limit}"
        else:
            transaction_splits['next'] = ''

        transaction_splits['results'] = [get_transaction(c.transaction_guid) for c in account.splits[(-start - limit):(-start)]]
        return transaction_splits


class Transactions(Resource):
    def get(self):
        if request.args:
            args = request.args.to_dict()
            print(args)
            query = ""
            for k,v in args:
                query += str(k) + "=" + str(v) + ','
        transactions = []
        for c in (book.transactions(query) if query else book.transactions):
            # splits = [{
            #             'memo': s.memo,
            #             'quantity': s.quantity.to_eng_string(),
            #             'value': s.value.to_eng_string(),
            #             'account_guid': s.account_guid,
            #             'guid': s.guid,
            #         } for s in c.splits]
            transactions.append({
                'description': c.description,
                'currency': {'namespace': c.currency.namespace, 'mnemonic': c.currency.mnemonic},
                'post_date': c.post_date.isoformat(),
                'enter_date': c.enter_date.isoformat(),
                'notes': c.notes,
                'guid': c.guid,
                # 'splits': splits
            })
        return transactions

class Splits(Resource):
    def get(self):
        args = request.args.to_dict()
        print(args)
        query = ""
        for k,v in args:
            query += str(k) + "=" + str(v) + ','
        splits = []
        for c in book.splits(query):
                    splits.append({
                        'memo': c.memo,
                        'quantity': c.quantity.to_eng_string(),
                        'value': c.value.to_eng_string(),
                        'account_guid': c.account_guid,
                        'transaction_guid': c.transaction_guid,
                        'guid': c.guid,
                    })
        return splits

class Commodities(Resource):
    def get(self):
        commodities = [{'namespace': c.namespace, 
        'mnemonic': c.mnemonic, 
        'cusip': c.cusip, 
        'fraction': c.fraction} for c in book.commodities]
        return commodities

def abort_if_transaction_doesnt_exist(transaction_guid):
    try:
        book.transactions(guid=transaction_guid)
    except:
        abort(404, message="Transaction with GUID = {} doesn't exist".format(transaction_guid))

def get_transaction(transaction_guid):
    c = book.transactions(guid=transaction_guid)
    splits = [{
                    'memo': s.memo,
                    'quantity': s.quantity.to_eng_string(),
                    'value': s.value.to_eng_string(),
                    'account_guid': s.account_guid,
                    'guid': s.guid,
                } for s in c.splits]
    return {
        'description': c.description,
        'currency': {'namespace': c.currency.namespace, 'mnemonic': c.currency.mnemonic},
        'post_date': c.post_date.isoformat(),
        'enter_date': c.enter_date.isoformat(),
        'notes': c.notes,
        'guid': c.guid,
        'splits': splits,
    }
class Transaction(Resource):
    def get(self, transaction_guid):
        abort_if_transaction_doesnt_exist(transaction_guid)
        return get_transaction(transaction_guid)


api.add_resource(Accounts, '/accounts')
api.add_resource(Account, '/account/<account_guid>')
api.add_resource(Account_Register, '/account/<account_guid>/transactions')
api.add_resource(Transactions, '/transactions')
api.add_resource(Transaction, '/transaction/<transaction_guid>')
api.add_resource(Splits, '/splits')

if __name__ == '__main__':
    # app.run(debug=True)
    app.run()