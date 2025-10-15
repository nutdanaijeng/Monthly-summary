from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Firebase Initialization
try:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    collection_name = "transactions"
    print("Firebase connection successful.")
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    db = None

# Helper function to serialize Firestore document
def serialize_doc(doc):
    if not doc.exists:
        return None
    data = doc.to_dict()
    data["id"] = doc.id
    # Convert Firestore Timestamp to ISO 8601 string format
    if "date" in data and isinstance(data["date"], datetime):
        data["date"] = data["date"].isoformat()
    return data

# [GET] All transactions with efficient server-side filtering
@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    if not db:
        return jsonify({"error": "Database connection not available"}), 500

    month = request.args.get("month")  # format: YYYY-MM
    query = db.collection(collection_name)

    # UPDATED: Server-side filtering for better performance
    if month:
        try:
            start_date = datetime.strptime(month, "%Y-%m")
            # Calculate the end date (start of the next month)
            next_month = start_date.replace(day=28) + timedelta(days=4)
            end_date = next_month - timedelta(days=next_month.day - 1)
            query = query.where("date", ">=", start_date).where("date", "<", end_date)
        except ValueError:
            return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
    
    # Order by date descending
    query = query.order_by("date", direction=firestore.Query.DESCENDING)

    docs = query.stream()
    data = [serialize_doc(doc) for doc in docs]

    return app.response_class(
        response=json.dumps(data, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )

# [POST] Add a new transaction with data validation
@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    if not db:
        return jsonify({"error": "Database connection not available"}), 500

    data = request.json
    
    # UPDATED: Data Validation
    required_fields = ["title", "amount", "type"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields: title, amount, type"}), 400
    
    if data["type"] not in ["income", "expense"]:
        return jsonify({"error": "Type must be 'income' or 'expense'"}), 400

    try:
        amount = float(data["amount"])
    except ValueError:
        return jsonify({"error": "Amount must be a number"}), 400

    new_doc = {
        "title": data["title"],
        "amount": amount,
        "type": data["type"],
        "category": data.get("category", "อื่นๆ"),
        "date": firestore.SERVER_TIMESTAMP # Let Firestore set the creation time
    }
    
    try:
        _, new_ref = db.collection(collection_name).add(new_doc)
        created_doc = serialize_doc(new_ref.get())
        return jsonify(created_doc), 201
    except Exception as e:
        return jsonify({"error": f"Could not add transaction: {e}"}), 500

# [PUT] Update an existing transaction
# NEW: This is the new endpoint
@app.route("/api/transactions/<id>", methods=["PUT"])
def update_transaction(id):
    if not db:
        return jsonify({"error": "Database connection not available"}), 500

    doc_ref = db.collection(collection_name).document(id)
    
    # UPDATED: Error handling for non-existent document
    if not doc_ref.get().exists:
        return jsonify({"error": "Transaction not found"}), 404
        
    data = request.json
    update_data = {}

    # Build the dictionary of fields to update
    if "title" in data:
        update_data["title"] = data["title"]
    if "amount" in data:
        try:
            update_data["amount"] = float(data["amount"])
        except ValueError:
            return jsonify({"error": "Amount must be a number"}), 400
    if "type" in data:
        if data["type"] not in ["income", "expense"]:
             return jsonify({"error": "Type must be 'income' or 'expense'"}), 400
        update_data["type"] = data["type"]
    if "category" in data:
        update_data["category"] = data["category"]
    
    if not update_data:
        return jsonify({"error": "No fields to update provided"}), 400

    try:
        doc_ref.update(update_data)
        updated_doc = serialize_doc(doc_ref.get())
        return jsonify(updated_doc), 200
    except Exception as e:
        return jsonify({"error": f"Could not update transaction: {e}"}), 500

# [DELETE] Delete a transaction
@app.route("/api/transactions/<id>", methods=["DELETE"])
def delete_transaction(id):
    if not db:
        return jsonify({"error": "Database connection not available"}), 500

    doc_ref = db.collection(collection_name).document(id)

    # UPDATED: Error handling for non-existent document
    if not doc_ref.get().exists:
        return jsonify({"error": "Transaction not found"}), 404

    try:
        doc_ref.delete()
        return jsonify({"message": f"Transaction with id {id} has been deleted."}), 200
    except Exception as e:
        return jsonify({"error": f"Could not delete transaction: {e}"}), 500

# [GET] Monthly summary (this endpoint could be merged or kept separate)
@app.route("/api/summary", methods=["GET"])
def monthly_summary():
    # This logic is now very similar to GET /api/transactions?month=...
    # It can be kept for convenience
    if not db:
        return jsonify({"error": "Database connection not available"}), 500

    month = request.args.get("month")
    if not month:
        return jsonify({"error": "Month parameter is required. Use format YYYY-MM"}), 400
    
    try:
        start_date = datetime.strptime(month, "%Y-%m")
        next_month = start_date.replace(day=28) + timedelta(days=4)
        end_date = next_month - timedelta(days=next_month.day - 1)
        
        query = db.collection(collection_name).where("date", ">=", start_date).where("date", "<", end_date)
        docs = query.stream()

        income = 0.0
        expense = 0.0
        for doc in docs:
            data = doc.to_dict()
            if data.get("type") == "income":
                income += data.get("amount", 0)
            elif data.get("type") == "expense":
                expense += data.get("amount", 0)
        
        balance = income - expense
        return jsonify({"income": income, "expense": expense, "balance": balance})

    except ValueError:
        return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
    except Exception as e:
        return jsonify({"error": f"Could not generate summary: {e}"}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)