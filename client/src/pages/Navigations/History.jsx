import React, { useContext, useState, useMemo } from "react";
import { TransactionList } from "../../components/Transactions/TransactionList";
import { TransactionContext } from "../../context/TransactionContext";
import { AuthContext } from "../../context/AuthContext";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import DownloadModal from "../../components/modals/DownloadModal";
import toast from "react-hot-toast";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const months = [
  "January","February","March","April","May","June","July",
  "August","September","October","November","December",
];

const History = () => {
  const { Transactions, setTransactions, deleteTransaction } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const transactions = Transactions || [];
  const userName = user?.name || "User";

  // Main UI filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique categories for dropdown
  const categories = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  // Filtering for display
  const filteredData = useMemo(() => {
    return transactions.filter((txn) => {
      const txnDate = new Date(txn.transactionDate);

      // Month & Year filter
      if (selectedMonth !== "" && txnDate.getMonth() !== parseInt(selectedMonth)) return false;
      if (selectedYear !== "" && txnDate.getFullYear() !== parseInt(selectedYear)) return false;

      // Category filter
      if (selectedCategory && txn.category !== selectedCategory) return false;

      // Search filter: category, description, or transaction type
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          txn.category.toLowerCase().includes(query) ||
          (txn.description || "").toLowerCase().includes(query) ||
          (txn.transactionType || "").toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [transactions, selectedMonth, selectedYear, selectedCategory, searchQuery]);

  async function handleDeleteTransaction(id) {
    if (!id) return;
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;
    try {
      const res = await deleteTransaction(id);
      if (res.status === 200) {
         toast.success("Transaction deleted successfully ✅");
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
        
      }
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  }

// Dynamically calculate years
const availableYears = useMemo(() => {
  if (!transactions.length) return [];

  // Extract all years from transaction dates
  const yearsSet = new Set(
    transactions.map(txn => new Date(txn.transactionDate).getFullYear())
  );

  const yearsArray = Array.from(yearsSet).sort((a, b) => b - a); // descending order

  const currentYear = new Date().getFullYear();

  // Ensure at least last 3 years including current year
  const minYear = currentYear - 2;
  for (let y = currentYear; y >= minYear; y--) {
    if (!yearsSet.has(y)) yearsArray.push(y);
  }

  // Remove duplicates + sort again
  return Array.from(new Set(yearsArray)).sort((a, b) => b - a);
}, [transactions]);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      {/* Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end">
        {/* Search */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search category/description/type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded p-2 h-10"
          />
        </div>

        {/* Month */}
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

        {/* Year */}
        {/* <div>
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
        </div> */}


        <div>
  <select
    className="w-full border rounded p-2 h-10"
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
  >
    <option value="">All Years</option>
    {availableYears.map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>
</div>



        {/* Category */}
        <div>
          <select
            className="w-full border rounded p-2 h-10"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Download Options button */}
      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Options
        </button>
      </div>

      {/* Transaction list */}
      <TransactionList
        transactions={filteredData}
        onDeleteTransaction={handleDeleteTransaction}
        history={true}
      />

      {/* Modal */}
      {isModalOpen && (
        <DownloadModal
          transactions={transactions}
          userName={userName}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default History;
