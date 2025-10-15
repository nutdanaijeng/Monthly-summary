import React, { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("อาหาร");

  // 🔹 โหลดข้อมูลจาก backend ทันทีเมื่อเปิดหน้า
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", err);
    }
  };

  // 🔹 เพิ่มรายการใหม่
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    const newItem = {
      title,
      amount: parseFloat(amount),
      type,
      category,
    };

    try {
      await addTransaction(newItem);
      await fetchTransactions(); // โหลดข้อมูลใหม่
      setTitle("");
      setAmount("");
      setCategory("อาหาร");
      setType("expense");
    } catch (err) {
      console.error("เพิ่มรายการไม่สำเร็จ:", err);
    }
  };

  // 🔹 ลบรายการ
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (err) {
      console.error("ลบไม่สำเร็จ:", err);
    }
  };

  return (
    <div>
      <h2>เพิ่มและดูรายการรายรับ-รายจ่าย</h2>

      {/* 🔸 ฟอร์มเพิ่มรายการ */}
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <input
          placeholder="ชื่อรายการ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="จำนวนเงิน"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          placeholder="หมวดหมู่"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">เพิ่มรายการ</button>
      </form>

      {/* 🔸 ตารางแสดงข้อมูล */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <span>
              {t.type === "income" ? "💵" : "💸"} {t.title} ({t.category})
              <strong
                style={{
                  color: t.type === "income" ? "green" : "red",
                  marginLeft: "10px",
                }}
              >
                {t.amount.toLocaleString()} บาท
              </strong>
            </span>
            <span>
              {t.date && `(${new Date(t.date).toLocaleDateString()})`}
              <button
                onClick={() => handleDelete(t.id)}
                style={{ marginLeft: 10 }}
              >
                ลบ
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
