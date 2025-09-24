// Analytics.jsx
import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { Pie } from "@nivo/pie";

// Dummy Data
const transactions = [
  { id: 1, amount: 500, type: "Expense", category: "Food", date: "2025-09-01" },
  { id: 2, amount: 1000, type: "Income", category: "Salary", date: "2025-09-01" },
  { id: 3, amount: 200, type: "Expense", category: "Travel", date: "2025-09-02" },
  { id: 4, amount: 150, type: "Expense", category: "Shopping", date: "2025-09-03" },
  { id: 5, amount: 300, type: "Income", category: "Freelance", date: "2025-09-03" },
  { id: 6, amount: 400, type: "Expense", category: "Food", date: "2025-09-04" },
  { id: 7, amount: 600, type: "Income", category: "Salary", date: "2025-09-05" },
  { id: 8, amount: 250, type: "Expense", category: "Travel", date: "2025-09-06" },
  { id: 9, amount: 100, type: "Expense", category: "Shopping", date: "2025-09-06" },
  { id: 10, amount: 500, type: "Income", category: "Freelance", date: "2025-09-07" },
  { id: 11, amount: 300, type: "Expense", category: "Food", date: "2025-09-08" },
  { id: 12, amount: 200, type: "Expense", category: "Travel", date: "2025-09-09" },
  { id: 13, amount: 700, type: "Income", category: "Salary", date: "2025-09-10" },
  { id: 14, amount: 150, type: "Expense", category: "Shopping", date: "2025-09-11" },
  { id: 15, amount: 400, type: "Income", category: "Freelance", date: "2025-09-12" },
  { id: 16, amount: 250, type: "Expense", category: "Food", date: "2025-09-13" },
  { id: 17, amount: 100, type: "Expense", category: "Travel", date: "2025-09-14" },
  { id: 18, amount: 600, type: "Income", category: "Salary", date: "2025-09-15" },
  { id: 19, amount: 200, type: "Expense", category: "Shopping", date: "2025-09-16" },
  { id: 20, amount: 300, type: "Income", category: "Freelance", date: "2025-09-17" },
];

const Analytics = () => {
  // Aggregate Category-wise Expenses
  const categoryData = Object.values(
    transactions
      .filter(t => t.type === "Expense")
      .reduce((acc, t) => {
        const value = Number(t.amount ?? 0);
        if (!acc[t.category]) acc[t.category] = { id: t.category, value: 0 };
        acc[t.category].value += isNaN(value) ? 0 : value;
        return acc;
      }, {})
  );

  // Aggregate Month-wise Income & Expense
  const grouped = transactions.reduce((acc, t) => {
    const month = t.date?.slice(0, 7) || "N/A"; // ensure string
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    const amount = Number(t.amount ?? 0);
    if (t.type === "Income") acc[month].income += isNaN(amount) ? 0 : amount;
    else acc[month].expense += isNaN(amount) ? 0 : amount;
    return acc;
  }, {});

  const months = Object.keys(grouped).sort();

  const lineData = [
    {
      id: "Income",
      color: "green",
      data: months.map(m => {
        const y = Number(grouped[m]?.income ?? 0);
        return { x: m || "N/A", y: isNaN(y) ? 0 : y };
      }),
    },
    {
      id: "Expense",
      color: "red",
      data: months.map(m => {
        const y = Number(grouped[m]?.expense ?? 0);
        return { x: m || "N/A", y: isNaN(y) ? 0 : y };
      }),
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Budget Buddy Dashboard</h1>

      {/* Line Chart */}
      <h2>Month-wise Income vs Expense</h2>
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0 }}
          axisBottom={{ orient: "bottom", legend: "Month", legendOffset: 36, legendPosition: "middle" }}
          axisLeft={{ orient: "left", legend: "Amount", legendOffset: -40, legendPosition: "middle" }}
          colors={{ datum: "color" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableSlices="x"
        />
      </div>

      {/* Pie Chart */}
      <h2 style={{ marginTop: "50px" }}>Category-wise Expenses</h2>
      <div style={{ height: 400 }}>
        <Pie
          data={categoryData}
          margin={{ top: 40, bottom: 40 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "set2" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        />
      </div>
    </div>
  );
};

export default Analytics;
    