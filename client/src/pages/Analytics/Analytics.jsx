import React, { useContext, useState, useMemo } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AuthContext } from "../../context/AuthContext";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const incomeColors = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#AF19FF"];
const expenseColors = ["#FF4560", "#FF8042", "#FFBB28", "#FF19AF", "#19FF9F"];

export default function Analytics() {
  const { Transactions } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);
  

  const transactions = Transactions || [];

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const txnDate = new Date(t.transactionDate);
      if (selectedYear && txnDate.getFullYear() !== parseInt(selectedYear))
        return false;
      if (selectedMonth && txnDate.getMonth() !== parseInt(selectedMonth))
        return false;
      const txnISO = txnDate.toISOString().split("T")[0];
      if (startDate && txnISO < startDate) return false;
      if (endDate && txnISO > endDate) return false;
      return true;
    });
  }, [transactions, selectedYear, selectedMonth, startDate, endDate]);

  // Dynamically generate years based on transactions + current year
  const availableYears = useMemo(() => {
    if (!transactions.length) return [];

    // Extract all years from transactions
    const yearsSet = new Set(
      transactions.map((t) => new Date(t.transactionDate).getFullYear())
    );

    const yearsArray = Array.from(yearsSet).sort((a, b) => b - a);

    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 2; // last 3 years minimum

    // Ensure at least last 3 years are included
    for (let y = currentYear; y >= minYear; y--) {
      if (!yearsSet.has(y)) yearsArray.push(y);
    }

    // Remove duplicates + sort descending
    return Array.from(new Set(yearsArray)).sort((a, b) => b - a);
  }, [transactions]);

  // Pie Data
  const incomeData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      if (t.transactionType === "income") {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const expenseData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      if (t.transactionType === "expense") {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // Bar Chart: month-wise income vs expense
  const barData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      const date = new Date(t.transactionDate);
      const month = date.getMonth();
      if (!map[month])
        map[month] = { month: months[month], income: 0, expense: 0 };
      map[month][t.transactionType] += Number(t.amount);
    });
    return Object.values(map);
  }, [filteredTransactions]);

  // PDF Export using pdfMake
  const exportPDF = () => {
    if (filteredTransactions.length === 0) return;

    const totalIncome = incomeData.reduce((sum, d) => sum + d.value, 0);
    const totalExpense = expenseData.reduce((sum, d) => sum + d.value, 0);

    const createTable = (data, type) => {
      if (!data || data.length === 0) return [["No Data"]];
      const headerColor = type === "income" ? "#00C49F" : "#FF4560";
      const body = [["Category", "Amount"]];
      data.forEach((d) => body.push([d.name, `₹${d.value}`]));
      body.push([
        "Total",
        `₹${type === "income" ? totalIncome : totalExpense}`,
      ]);
      return { body, headerColor };
    };

    const incomeTable = createTable(incomeData, "income");
    const expenseTable = createTable(expenseData, "expense");

    const barTableBody = [["Month", "Income", "Expense"]];
    barData.forEach((b) =>
      barTableBody.push([b.month, `₹${b.income}`, `₹${b.expense}`])
    );

    // Filter text formatting
    let filterText = `Year: ${selectedYear || "All"}\nMonth: ${
      selectedMonth !== "" ? months[selectedMonth] : "All"
    }`;
    if (startDate || endDate) {
      filterText += `\nDate: ${startDate || "NA"} - ${endDate || "NA"}`;
    }

    const docDefinition = {
      pageMargins: [40, 40, 40, 40],
      content: [
        {
          text: "Analytics Report",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          text: `Owner : ${user.name[0].toUpperCase() + user.name.slice(1)}`,
          style: "subheader",
          margin: [0, 0, 0, 5],
        },
        { text: "Filters", style: "subheader", margin: [0, 0, 0, 5] },
        { text: filterText, margin: [0, 0, 0, 15] },

        {
          text: "Income Categories",
          style: "subheader",
          color: "#00C49F",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*"],
            body: incomeTable.body,
          },
          layout: {
            fillColor: (rowIndex) =>
              rowIndex === 0
                ? incomeTable.headerColor
                : rowIndex === incomeTable.body.length - 1
                ? "#DFF2E1"
                : rowIndex % 2 === 0
                ? "#F7F7F7"
                : null,
            hLineColor: "#ccc",
            vLineColor: "#ccc",
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
        },

        {
          text: "Expense Categories",
          style: "subheader",
          color: "#FF4560",
          margin: [0, 20, 0, 5],
        },
        {
          table: {
            widths: ["*", "*"],
            body: expenseTable.body,
          },
          layout: {
            fillColor: (rowIndex) =>
              rowIndex === 0
                ? expenseTable.headerColor
                : rowIndex === expenseTable.body.length - 1
                ? "#FDE2E2"
                : rowIndex % 2 === 0
                ? "#F7F7F7"
                : null,
            hLineColor: "#ccc",
            vLineColor: "#ccc",
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
        },

        {
          text: "Monthly Income vs Expense",
          style: "subheader",
          margin: [0, 20, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*"],
            body: barTableBody,
          },
          layout: {
            fillColor: (rowIndex) =>
              rowIndex === 0
                ? "#00C49F"
                : rowIndex % 2 === 0
                ? "#F7F7F7"
                : null,
            hLineColor: "#ccc",
            vLineColor: "#ccc",
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 16, bold: true, color: "#1f4e79" },
      },
      defaultStyle: { fonts: "Helvetica" },
    };

    pdfMake.createPdf(docDefinition).download("analytics-report.pdf");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Analytics Dashboard
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Year */}
        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="border rounded p-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="border rounded p-2 w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Export PDF Button */}
        <div className="col-span-2">
          <button
            onClick={exportPDF}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* No Transactions Subheading */}
      {filteredTransactions.length === 0 ? (
        <h2 className="text-xl font-semibold text-center text-gray-500 mt-10">
          No transactions right now. Please add transactions first.
        </h2>
      ) : (
        /* Charts */
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {incomeData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={incomeColors[index % incomeColors.length]}
                      />
                    ))}
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
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={expenseColors[index % expenseColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-8">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Income vs Expense
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#00C49F" />
                <Bar dataKey="expense" fill="#FF4560" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
