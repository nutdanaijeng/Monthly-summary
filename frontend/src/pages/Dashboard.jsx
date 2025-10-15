import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ✅ ต้อง register ก่อนใช้ Pie Chart
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ summary, transactions }) {
  // ✅ คำนวณรายจ่ายตามหมวดหมู่
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        label: "รายจ่าย (บาท)",
        data: Object.values(expenseData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard: ภาพรวมประจำเดือน</h2>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", margin: "20px 0", flexWrap: "wrap" }}>
        <h3>💵 รายรับ: {summary.income.toLocaleString()} บาท</h3>
        <h3>💸 รายจ่าย: {summary.expense.toLocaleString()} บาท</h3>
        <h3>💰 คงเหลือ: {summary.balance.toLocaleString()} บาท</h3>
      </div>

      {Object.keys(expenseData).length > 0 ? (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
          <h3>📊 กราฟรายจ่ายตามหมวดหมู่</h3>
          <Pie data={pieData} />
        </div>
      ) : (
        <p>ไม่มีข้อมูลรายจ่ายสำหรับเดือนนี้</p>
      )}
    </div>
  );
}
