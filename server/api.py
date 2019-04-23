from flask import Flask, request
from flask_restful import Resource, Api, abort, reqparse
import piecash

app = Flask(__name__)
api = Api(app)

db = '../mymoney.sqlite.gnucash'
book = piecash.open_book('sqlite:///../mymoney.sqlite.gnucash?check_same_thread=False', readonly=True, do_backup=False, open_if_lock=True)

# need to add query parameters to all plural resources
class Accounts(Resource):
    # can filter by name, type, fullname, commodity
    def get(self):
        accounts = [{'name': account.name, 
        'parent': account.parent.name, 
        'type': account.type,
        'guid': account.guid} for account in book.accounts]
        return accounts

class Account(Resource):
    def get(self, account_guid):
        account = book.accounts(guid=account_guid)
        return {
            'name': account.name, 
            'parent': account.parent.name, 
            'type': account.type,
            'guid': account.guid
        }

class Transactions(Resource):
    def get(self):
        if request.args:
            args = request.args.to_dict()
            print(args)
            query = ""
            for k,v in args:
                query += str(k) + "=" + str(v) + ','
        transactions = []
        for c in (book.transactions(query) if query else book.transactions:
            splits = [{
                        'memo': s.memo,
                        'quantity': s.quantity.to_eng_string(),
                        'value': s.value.to_eng_string(),
                        'account_guid': s.account_guid,
                        'guid': s.guid,
                    } for s in c.splits]
            transactions.append({
                'description': c.description,
                'currency': {'namespace': c.currency.namespace, 'mnemonic': c.currency.mnemonic},
                'post_date': c.post_date.isoformat(),
                'enter_date': c.enter_date.isoformat(),
                'notes': c.notes,
                'guid': c.guid,
                'splits': splits
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
class Transaction(Resource):
    def get(self, transaction_guid):
        abort_if_transaction_doesnt_exist(transaction_guid)
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

api.add_resource(Accounts, '/accounts')
api.add_resource(Account, '/account/<account_guid>')
api.add_resource(Transactions, '/transactions')
api.add_resource(Transaction, '/transaction/<transaction_guid>')
api.add_resource(Splits, '/splits')

if __name__ == '__main__':
    app.run(debug=True)