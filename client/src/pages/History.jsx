import React, { useContext, useState } from "react";
import { TransactionList } from "../components/TransactionList";
import { TransactionContext } from "../context/TransactionContext";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AuthContext } from "../context/AuthContext";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December",
];

const expenseCategories = [
  { name: "Food & Dining", color: "bg-orange-100 text-orange-600" },
  { name: "Transportation", color: "bg-blue-100 text-blue-600" },
  { name: "Shopping", color: "bg-purple-100 text-purple-600" },
  { name: "Bills & Utilities", color: "bg-red-100 text-red-600" },
  { name: "Housing", color: "bg-green-100 text-green-600" },
  { name: "Healthcare", color: "bg-pink-100 text-pink-600" },
  { name: "Education", color: "bg-indigo-100 text-indigo-600" },
  { name: "Entertainment", color: "bg-yellow-100 text-yellow-600" },
];

const incomeCategories = [
  { name: "Salary", color: "bg-green-100 text-green-600" },
  { name: "Freelance", color: "bg-blue-100 text-blue-600" },
  { name: "Investment", color: "bg-purple-100 text-purple-600" },
  { name: "Gift", color: "bg-pink-100 text-pink-600" },
];

const History = () => {
  const { Transactions ,setTransactions,deleteTransaction,} = useContext(TransactionContext);
  const { user } = useContext(AuthContext)
  const transactions = Transactions || [];
  const userName = user?.name || "User";

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // ✨ Extra functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const allCategories = [...expenseCategories, ...incomeCategories];

  const getWeekOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + firstDay.getDay()) / 7);
  };

  const filterByMonthYearWeek = (txn) => {
    const txnDate = new Date(txn.transactionDate);
    if (selectedMonth !== "" && txnDate.getMonth() !== parseInt(selectedMonth))
      return false;
    if (selectedYear !== "" && txnDate.getFullYear() !== parseInt(selectedYear))
      return false;
    if (selectedWeek !== "" && getWeekOfMonth(txnDate) !== parseInt(selectedWeek))
      return false;
    return true;
  };

  const filterByDateRange = (txn) => {
    const txnDate = new Date(txn.transactionDate).toISOString().split("T")[0];
    if (startDate && txnDate < startDate) return false;
    if (endDate && txnDate > endDate) return false;
    return true;
  };

  // ✨ Updated filtered data with search and category filter
  const filteredData = transactions.filter(
    (txn) => filterByDateRange(txn) && filterByMonthYearWeek(txn)
  ).filter((txn) => {
    if (selectedCategory && txn.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        txn.category.toLowerCase().includes(query) ||
        (txn.description || "").toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

const generatePDF = () => {
  const totalIncome = filteredData
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredData
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Filters: two lines
  const firstLine =
    startDate || endDate
      ? [
          {
            text: `Date: ${startDate ? formatDate(startDate) : "NA"} - ${
              endDate ? formatDate(endDate) : "NA"
            }`,
            style: "filterLabel",
            fillColor: "#e8f4fc",
            alignment: "center",
          },
        ]
      : [];

  const secondLine = [];
  if (selectedYear)
    secondLine.push({
      text: `Year: ${selectedYear}`,
      style: "filterLabel",
      fillColor: "#e8f4fc",
      margin: [2, 2, 2, 2],
      alignment: "center",
    });

  if (selectedMonth)
    secondLine.push({
      text: `Month: ${months[selectedMonth]}`,
      style: "filterLabel",
      fillColor: "#e8f4fc",
      margin: [2, 2, 2, 2],
      alignment: "center",
    });

  if (selectedWeek)
    secondLine.push({
      text: `Week: ${selectedWeek}`,
      style: "filterLabel",
      fillColor: "#e8f4fc",
      margin: [2, 2, 2, 2],
      alignment: "center",
    });

  // ✨ Add selected category as a subheader
  if (selectedCategory) {
    secondLine.push({
      text: `Category: ${selectedCategory}`,
      style: "filterLabel",
      fillColor: "#e8f4fc",
      margin: [2, 2, 2, 2],
      alignment: "center",
    });
  }

  const docDefinition = {
    content: [
      { text: "Transaction Report", style: "header" },
      {
        text: `Owner: ${userName[0].toUpperCase() + userName.slice(1).toLowerCase()}`,
        style: "subheader",
      },
      { columns: firstLine, margin: [0, 0, 0, 5] },
      { columns: secondLine, margin: [0, 0, 0, 10] },

      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "*"],
          body: [
            [
              { text: "Date", style: "tableHeader", fillColor: "#4f81bd", color: "#fff" },
              { text: "Category", style: "tableHeader", fillColor: "#4f81bd", color: "#fff" },
              { text: "Type", style: "tableHeader", fillColor: "#4f81bd", color: "#fff" },
              { text: "Amount", style: "tableHeader", fillColor: "#4f81bd", color: "#fff" },
              { text: "Description", style: "tableHeader", fillColor: "#4f81bd", color: "#fff" },
            ],
              ...filteredData.map((txn) => [
                { text: formatDate(txn.transactionDate) },
                { text: txn.category },
                { text: txn.transactionType, color: txn.transactionType === "income" ? "green" : "red" },
                { text: `₹${txn.amount}` },
                { text: txn.description || "-" },
              ]),
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9f9f9" : null),
          hLineColor: "#ccc",
          vLineColor: "#ccc",
        },
        margin: [0, 10, 0, 0],
      },

      {
        columns: [
          { text: `Total Income: ₹${totalIncome}`, style: "totals", color: "green" },
          { text: `Total Expense: ₹${totalExpense}`, style: "totals", color: "red", alignment: "center" },
          { text: `Net Balance: ₹${balance}`, style: "totals", bold: true, alignment: "right" },
        ],
        margin: [0, 15, 0, 0],
      },
    ],
    styles: {
      header: { fontSize: 20, bold: true, alignment: "center", margin: [0, 0, 0, 15], color: "#1f4e79" },
      filterLabel: { fontSize: 11, bold: true, margin: [2, 2, 2, 2], color: "#000" },
      tableHeader: { bold: true, fontSize: 12 },
      totals: { fontSize: 12, bold: true },
    },
    defaultStyle: { fonts: "Helvetica" },
  };

  pdfMake.createPdf(docDefinition).download(
    `${userName[0].toUpperCase() + userName.slice(1).toLowerCase()} - transactions.pdf`
  );
};


  async function handleDeleteTransaction(id) {
    if (!id) return;
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;
    try {
      const res = await deleteTransaction(id);
      if (res.status === 200) {
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      }
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      {/* Filters */}
      {/* Filters */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 items-end">
  {/* Search (col-span-2) */}
  <div className="col-span-1 md:col-span-2">
    <input
      type="text"
      placeholder="Search category/description..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full border rounded p-2 h-10"
    />
  </div>

  {/* Category Dropdown */}
  <div>
    <select
      className="w-full border rounded p-2 h-10"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {allCategories.map((cat) => (
        <option key={cat.name} value={cat.name}>{cat.name}</option>
      ))}
    </select>
  </div>

  {/* Month Dropdown */}
  <div>
    <select
      className="w-full border rounded p-2 h-10"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      <option value="">All Months</option>
      {months.map((m, i) => (
        <option key={i} value={i}>{m}</option>
      ))}
    </select>
  </div>

  {/* Year Dropdown */}
  <div>
    <select
      className="w-full border rounded p-2 h-10"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      <option value="">All Years</option>
      {[2023, 2024, 2025].map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>

  {/* Start Date */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1">Start Date</label>
    <input
      type="date"
      className="w-full border rounded p-2 h-12"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  {/* End Date */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1">End Date</label>
    <input
      type="date"
      className="w-full border rounded p-2 h-12"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Week Dropdown */}
  <div>
    <select
      className="w-full border rounded p-2 h-10"
      value={selectedWeek}
      onChange={(e) => setSelectedWeek(e.target.value)}
    >
      <option value="">All Weeks</option>
      {[1, 2, 3, 4, 5].map((w) => (
        <option key={w} value={w}>Week {w}</option>
      ))}
    </select>
  </div>

  {/* PDF Button */}
  <div>
    <button
      onClick={generatePDF}
      className="w-full bg-blue-600 text-white px-4 py-2 rounded h-10"
    >
      Download PDF
    </button>
  </div>
</div>


      <TransactionList transactions={filteredData} onDeleteTransaction={handleDeleteTransaction} history={true} />
    </div>
  );
};

export default History;
