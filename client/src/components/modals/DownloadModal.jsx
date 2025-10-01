import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import CustomDropdown from "../CustomDropdown";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const months = [
  "January","February","March","April","May","June","July",
  "August","September","October","November","December",
];

const expenseCategories = [
  "Food & Dining","Transportation","Shopping","Bills & Utilities",
  "Housing","Healthcare","Education","Entertainment",
];

const incomeCategories = ["Salary","Freelance","Investment","Gift"];

const allCategories = [...expenseCategories, ...incomeCategories];

const DownloadModal = ({ transactions, userName, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedWeek, setSelectedWeek] = useState("All Weeks");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Years list
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Dropdown Options
  const monthOptions = ["All Months", ...months];
  const yearOptions = ["All Years", ...availableYears.map((y) => y.toString())];
  const weekOptions = ["All Weeks", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const categoryOptions = ["All Categories", ...allCategories];

  // Week calculation
  const getWeekOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + firstDay.getDay()) / 7);
  };

  // Filtering transactions
  const filterData = () => {
    return transactions.filter((txn) => {
      const txnDate = new Date(txn.transactionDate);

      if (startDate && txnDate < new Date(startDate)) return false;
      if (endDate && txnDate > new Date(endDate)) return false;

      if (selectedMonth !== "All Months" && txnDate.getMonth() !== months.indexOf(selectedMonth)) {
        return false;
      }

      if (selectedYear !== "All Years" && txnDate.getFullYear() !== parseInt(selectedYear)) {
        return false;
      }

      if (selectedWeek !== "All Weeks" && getWeekOfMonth(txnDate) !== parseInt(selectedWeek.split(" ")[1])) {
        return false;
      }

      if (selectedCategory !== "All Categories" && txn.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}/${
      (d.getMonth() + 1).toString().padStart(2, "0")
    }/${d.getFullYear()}`;
  };

  // PDF generation
  const generatePDF = () => {
    const data = filterData();

    if (!data || data.length === 0) {
      alert("No transactions available for your selected filters.");
      return;
    }

    const totalIncome = data
      .filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = data
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Filters text
    const filters = [];
    filters.push(`Date: ${startDate || "NA"} - ${endDate || "NA"}`);
    filters.push(`Month: ${selectedMonth}`);
    filters.push(`Year: ${selectedYear}`);
    filters.push(`Week: ${selectedWeek}`);
    filters.push(`Category: ${selectedCategory}`);

    const docDefinition = {
      content: [
        { text: "Transaction Report", style: "header" },
        { text: `Owner: ${userName}`, style: "subheader" },

        // Filters
        ...filters.map((f) => ({
          text: f,
          style: "filterLabel",
          fillColor: "#eff6ff",
          margin: [0, 2, 0, 2],
          alignment: "center",
        })),

        // Table
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "*"],
            body: [
              [
                { text: "Date", style: "tableHeader", fillColor: "#dbeafe", color: "#1e3a8a" },
                { text: "Category", style: "tableHeader", fillColor: "#dbeafe", color: "#1e3a8a" },
                { text: "Type", style: "tableHeader", fillColor: "#dbeafe", color: "#1e3a8a" },
                { text: "Amount", style: "tableHeader", fillColor: "#dbeafe", color: "#1e3a8a" },
                { text: "Description", style: "tableHeader", fillColor: "#dbeafe", color: "#1e3a8a" },
              ],
              ...data.map((txn, idx) => [
                { text: formatDate(txn.transactionDate), fillColor: idx % 2 === 0 ? "#f1f5f9" : "#ffffff" },
                { text: txn.category, fillColor: idx % 2 === 0 ? "#f1f5f9" : "#ffffff" },
                {
                  text: txn.transactionType,
                  color: txn.transactionType === "income" ? "green" : "red",
                  fillColor: idx % 2 === 0 ? "#f1f5f9" : "#ffffff",
                },
                {
                  text: `₹${txn.amount}`,
                  bold: true,
                  color: txn.transactionType === "income" ? "green" : "red",
                  fillColor: idx % 2 === 0 ? "#f1f5f9" : "#ffffff",
                },
                { text: txn.description || "-", fillColor: idx % 2 === 0 ? "#f1f5f9" : "#ffffff" },
              ]),
            ],
          },
          layout: { hLineColor: "#e5e7eb", vLineColor: "#e5e7eb" },
          margin: [0, 10, 0, 10],
        },

        // Totals
        {
          columns: [
            { text: `Total Income: ₹${totalIncome}`, color: "green", bold: true, fillColor: "#dcfce7" },
            { text: `Total Expense: ₹${totalExpense}`, color: "red", bold: true, alignment: "center", fillColor: "#fee2e2" },
            { text: `Net Balance: ₹${balance}`, bold: true, alignment: "right", fillColor: "#fef9c3" },
          ],
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true, alignment: "center", color: "#1e40af" },
        subheader: { fontSize: 14, margin: [0, 5, 0, 10] },
        tableHeader: { bold: true, fontSize: 12 },
        filterLabel: { fontSize: 11, bold: true },
      },
      defaultStyle: { fonts: "Helvetica" },
    };

    pdfMake.createPdf(docDefinition).download(`${userName}-transactions.pdf`);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto p-6">
        <h2 className="text-lg font-bold mb-4 text-center">Download Options</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Start Date */}
          <div>
            <label className="text-sm font-semibold">Start Date</label>
            <input
              type="date"
              max={today}
              className="w-full border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-sm font-semibold">End Date</label>
            <input
              type="date"
              max={today}
              className="w-full border p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Month */}
          <CustomDropdown label="Month" options={monthOptions} value={selectedMonth} onChange={setSelectedMonth} />

          {/* Year */}
          <CustomDropdown label="Year" options={yearOptions} value={selectedYear} onChange={setSelectedYear} />

          {/* Week */}
          <CustomDropdown label="Week" options={weekOptions} value={selectedWeek} onChange={setSelectedWeek} />

          {/* Category */}
          <CustomDropdown label="Category" options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} />
        </div>

        <div className="flex justify-between gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={generatePDF} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
