import React, { useContext, useState, useMemo, useRef } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const incomeColors = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#AF19FF"];
const expenseColors = ["#FF4560", "#FF8042", "#FFBB28", "#FF19AF", "#19FF9F"];

export default function Analytics() {
  const { Transactions } = useContext(TransactionContext);
  const transactions = Transactions || [];

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txnDate = new Date(t.transactionDate);
      if (selectedYear && txnDate.getFullYear() !== parseInt(selectedYear)) return false;
      if (selectedMonth && txnDate.getMonth() !== parseInt(selectedMonth)) return false;
      const txnISO = txnDate.toISOString().split("T")[0];
      if (startDate && txnISO < startDate) return false;
      if (endDate && txnISO > endDate) return false;
      return true;
    });
  }, [transactions, selectedYear, selectedMonth, startDate, endDate]);

  // Pie Data
  const incomeData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach(t => {
      if (t.transactionType === "income") {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
      // console.log("map is ", map);
      
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const expenseData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach(t => {
      if (t.transactionType === "expense") {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // Bar Chart: month-wise income vs expense
  const barData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.transactionDate);
      const month = date.getMonth();
      if (!map[month]) map[month] = { month: months[month], income: 0, expense: 0 };
      map[month][t.transactionType] += Number(t.amount);
    });
    return Object.values(map);
  }, [filteredTransactions]);

  // Line Chart: week-wise net balance
  const lineData = useMemo(() => {
    const weekMap = {};
    const getWeekOfMonth = (date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
    };
    filteredTransactions.forEach(t => {
      const date = new Date(t.transactionDate);
      const weekKey = `${date.getMonth()}-${getWeekOfMonth(date)}`;
      if (!weekMap[weekKey]) weekMap[weekKey] = { week: `M${date.getMonth()+1}-W${getWeekOfMonth(date)}`, income: 0, expense: 0 };
      weekMap[weekKey][t.transactionType] += Number(t.amount);
    });
    return Object.values(weekMap).map(w => ({ ...w, net: w.income - w.expense }));
  }, [filteredTransactions]);

  // PDF Export using pdfMake
  const exportPDF = () => {
  const totalIncome = incomeData.reduce((sum, d) => sum + d.value, 0);
  const totalExpense = expenseData.reduce((sum, d) => sum + d.value, 0);

  const createTable = (data, type) => {
    if (!data || data.length === 0) return [["No Data"]];
    const headerColor = type === "income" ? "#00C49F" : "#FF4560";
    const body = [["Category", "Amount"]];
    data.forEach(d => body.push([d.name, `₹${d.value}`]));
    // Add total row
    body.push(["Total", `₹${type === "income" ? totalIncome : totalExpense}`]);
    return { body, headerColor };
  };

  const incomeTable = createTable(incomeData, "income");
  const expenseTable = createTable(expenseData, "expense");

  const barTableBody = [["Month", "Income", "Expense"]];
  barData.forEach(b => barTableBody.push([b.month, `₹${b.income}`, `₹${b.expense}`]));

  const lineTableBody = [["Week", "Income", "Expense", "Net"]];
  lineData.forEach(l => lineTableBody.push([l.week, `₹${l.income}`, `₹${l.expense}`, `₹${l.net}`]));

  const docDefinition = {
    content: [
      { text: "Analytics Report", style: "header", alignment: "center" },
      { text: `Filters: Year: ${selectedYear || "All"}, Month: ${selectedMonth !== "" ? months[selectedMonth] : "All"}, Date: ${startDate || "NA"} - ${endDate || "NA"}`, style: "subheader" },
      
      { text: "Income Categories", style: "subheader", margin: [0, 10, 0, 5], color: "#00C49F" },
      {
        table: { widths: ["*", "*"], body: incomeTable.body },
        layout: {
          fillColor: (rowIndex) => rowIndex === 0 ? incomeTable.headerColor : (rowIndex === incomeTable.body.length-1 ? "#DFF2E1" : null),
          hLineColor: "#ccc",
          vLineColor: "#ccc"
        }
      },

      { text: "Expense Categories", style: "subheader", margin: [0, 10, 0, 5], color: "#FF4560" },
      {
        table: { widths: ["*", "*"], body: expenseTable.body },
        layout: {
          fillColor: (rowIndex) => rowIndex === 0 ? expenseTable.headerColor : (rowIndex === expenseTable.body.length-1 ? "#FDE2E2" : null),
          hLineColor: "#ccc",
          vLineColor: "#ccc"
        }
      },

      { text: "Monthly Income vs Expense", style: "subheader", margin: [0, 10, 0, 5] },
      {
        table: { widths: ["*", "*", "*"], body: barTableBody },
        layout: { fillColor: (rowIndex) => rowIndex === 0 ? "#00C49F" : null, hLineColor: "#ccc", vLineColor: "#ccc" }
      },

      { text: "Weekly Net Balance", style: "subheader", margin: [0, 10, 0, 5] },
      {
        table: { widths: ["*", "*", "*", "*"], body: lineTableBody },
        layout: { fillColor: (rowIndex) => rowIndex === 0 ? "#8884d8" : null, hLineColor: "#ccc", vLineColor: "#ccc" }
      }
    ],
    styles: {
      header: { fontSize: 22, bold: true },
      subheader: { fontSize: 16, bold: true, color: "#1f4e79" }
    },
    defaultStyle: { fonts: "Helvetica" }
  };

  pdfMake.createPdf(docDefinition).download("analytics-report.pdf");
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Analytics Dashboard</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select className="border rounded p-2" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select className="border rounded p-2" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {months.map((m,i) => <option key={i} value={i}>{m}</option>)}
        </select>

        <input type="date" className="border rounded p-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" className="border rounded p-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button onClick={exportPDF} className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">Export PDF</button>
      </div>

      {/* Charts */}
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={incomeData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {incomeData.map((entry,index) => <Cell key={index} fill={incomeColors[index % incomeColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {expenseData.map((entry,index) => <Cell key={index} fill={expenseColors[index % expenseColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Monthly Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="income" fill="#00C49F"/>
              <Bar dataKey="expense" fill="#FF4560"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Weekly Net Balance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="week"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="net" stroke="#8884d8"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
