import { useState, useEffect } from "react";
import { getTransactions, addTransaction, deleteTransaction, getMonthlySummary } from "./api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ เพิ่ม CSS inline สำหรับ Dark / Light mode
const appStyle = {
  light: {
    backgroundColor: "#f8f9fa",
    color: "#212529",
    minHeight: "100vh",
    transition: "all 0.3s",
  },
  dark: {
    backgroundColor: "#1e1e1e",
    color: "#f1f1f1",
    minHeight: "100vh",
    transition: "all 0.3s",
  },
};

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("อื่นๆ");
  const [filterMonth, setFilterMonth] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  const fetchData = async () => {
    const data = await getTransactions(filterMonth);
    setTransactions(data);
    if (filterMonth) {
      const sum = await getMonthlySummary(filterMonth);
      setSummary(sum);
    } else {
      setSummary({ income: 0, expense: 0, balance: 0 });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterMonth]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("กรอกข้อมูลให้ครบ");
    await addTransaction({ title, amount: parseFloat(amount), type, category });
    setTitle("");
    setAmount("");
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchData();
  };

  const totalIncome = transactions.filter(t => t.type==="income").reduce((a,b)=>a+b.amount,0);
  const totalExpense = transactions.filter(t => t.type==="expense").reduce((a,b)=>a+b.amount,0);
  const balance = totalIncome - totalExpense;

  const expenseData = transactions.filter(t=>t.type==="expense")
    .reduce((acc,t)=>{acc[t.category]=(acc[t.category]||0)+t.amount; return acc},{});

  const pieData = {
    labels: Object.keys(expenseData),
    datasets:[{ label:"Expense", data:Object.values(expenseData), backgroundColor:["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40"], hoverOffset:4 }]
  };

  return (
    <div style={darkMode ? appStyle.dark : appStyle.light}>
      <div style={{ maxWidth: 700, margin:"auto", padding:20 }}>
        <h1>💰 รายรับ-รายจ่าย</h1>
        <button onClick={()=>setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <br/><br/>
        <input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} />
        <form onSubmit={handleAdd} style={{ display:"flex", gap:8, marginBottom:20 }}>
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="income">รายรับ</option>
            <option value="expense">รายจ่าย</option>
          </select>
          <input placeholder="ชื่อรายการ" value={title} onChange={e=>setTitle(e.target.value)}/>
          <input type="number" placeholder="จำนวนเงิน" value={amount} onChange={e=>setAmount(e.target.value)}/>
          <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)}/>
          <button type="submit">เพิ่ม</button>
        </form>

        <h3>รวมรายรับ: {totalIncome} บาท</h3>
        <h3>รวมรายจ่าย: {totalExpense} บาท</h3>
        <h2>💰 เงินคงเหลือ: {balance} บาท</h2>

        {filterMonth && <h3>Monthly Summary: 💵 {summary.income} / 💸 {summary.expense} / 💰 {summary.balance}</h3>}

        <ul>
          {transactions.map(t=>(
            <li key={t.id}>
              {t.type==="income"?"💵":"💸"} {t.title} - {t.amount} บาท ({t.category}) 
              {t.date && ` (${new Date(t.date).toLocaleString()})`}
              <button onClick={()=>handleDelete(t.id)} style={{marginLeft:10}}>ลบ</button>
            </li>
          ))}
        </ul>

        {Object.keys(expenseData).length>0 && <>
          <h3>กราฟรายจ่ายตาม Category</h3>
          <Pie data={pieData}/>
        </>}
      </div>
    </div>
  );
}
