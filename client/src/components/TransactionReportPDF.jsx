// TransactionReportPDF.jsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  section: { marginBottom: 10 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
  },
  colHeader: { flex: 1, fontWeight: "bold", fontSize: 12 },
  col: { flex: 1, fontSize: 10 },
  summary: { marginTop: 15, padding: 10, borderTopWidth: 1, borderColor: "#000" },
});

export default function TransactionReportPDF({ transactions, filters }) {
  const totalIncome = transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Transaction Report</Text>

        {/* Filters Info */}
        <View style={styles.section}>
          {(filters.startDate || filters.endDate) && (
            <Text>
              Date Range: {filters.startDate || "NA"} - {filters.endDate || "NA"}
            </Text>
          )}
          {filters.selectedMonth && filters.selectedYear && (
            <Text>
              Month: {filters.selectedMonth} {filters.selectedYear}
            </Text>
          )}
          {filters.selectedWeek && <Text>Week: {filters.selectedWeek}</Text>}
        </View>

        {/* Table Header */}
        <View style={[styles.row, { backgroundColor: "#eee" }]}>
          <Text style={styles.colHeader}>Date</Text>
          <Text style={styles.colHeader}>Category</Text>
          <Text style={styles.colHeader}>Type</Text>
          <Text style={styles.colHeader}>Amount</Text>
          <Text style={styles.colHeader}>Description</Text>
        </View>

        {/* Table Rows */}
        {transactions.length > 0 ? (
          transactions.map((txn, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={styles.col}>
                {new Date(txn.transactionDate).toLocaleDateString()}
              </Text>
              <Text style={styles.col}>{txn.category}</Text>
              <Text style={styles.col}>{txn.transactionType}</Text>
              <Text style={styles.col}>₹{txn.amount}</Text>
              <Text style={styles.col}>{txn.description || "-"}</Text>
            </View>
          ))
        ) : (
          <Text>No Transactions Found</Text>
        )}

        {/* Summary */}
        <View style={styles.summary}>
          <Text>Total Income: ₹{totalIncome}</Text>
          <Text>Total Expense: ₹{totalExpense}</Text>
          <Text>Net Balance: ₹{balance}</Text>
        </View>
      </Page>
    </Document>
  );
}
