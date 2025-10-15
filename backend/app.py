from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
collection_name = "transactions"

# แปลง document ให้ JSON serializable
def serialize_doc(doc):
    data = doc.to_dict()
    data["id"] = doc.id
    if "date" in data:
        data["date"] = data["date"].isoformat()
    return data


@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    month = request.args.get("month")  # format: YYYY-MM
    docs = db.collection(collection_name).stream()
    data = [serialize_doc(d) for d in docs]

    if month:
        data = [d for d in data if d.get("date", "").startswith(month)]
    return app.response_class(
        response=json.dumps(data, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )

# POST 
@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.json
    new_doc = {
        "title": data["title"],
        "amount": float(data["amount"]),
        "type": data["type"],
        "category": data.get("category", "อื่นๆ"),
        "date": firestore.SERVER_TIMESTAMP
    }
    db.collection(collection_name).add(new_doc)
    return jsonify({"message": "Transaction added!"}), 201

# DELETE 
@app.route("/api/transactions/<id>", methods=["DELETE"])
def delete_transaction(id):
    db.collection(collection_name).document(id).delete()
    return jsonify({"message": "Transaction deleted!"}), 200

# Monthly summary API
@app.route("/api/summary", methods=["GET"])
def monthly_summary():
    month = request.args.get("month")  # format YYYY-MM
    docs = db.collection(collection_name).stream()
    data = [serialize_doc(d) for d in docs if d.get("date", "").startswith(month)]

    income = sum(d["amount"] for d in data if d["type"] == "income")
    expense = sum(d["amount"] for d in data if d["type"] == "expense")
    balance = income - expense
    return jsonify({"income": income, "expense": expense, "balance": balance})

if __name__ == "__main__":
    app.run(port=5000, debug=True)

