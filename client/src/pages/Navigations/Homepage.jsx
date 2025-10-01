import { useContext, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { SummaryCard } from "../../components/Transactions/SummaryCard.jsx";
import { TransactionList } from "../../components/Transactions/TransactionList.jsx";
import { Link } from "react-router-dom";
import { TransactionContext } from "../../context/TransactionContext.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-hot-toast"; // ✅ Toast import

export function Homepage() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [motivation, setMotivation] = useState("");
  const [time, setTime] = useState(new Date());

  const { deleteTransaction, setTransactions, getSummery, Transactions } =
    useContext(TransactionContext);
axios.defaults.withCredentials = true;
  const { user } = useContext(AuthContext);

  const tips = [
    "💡 Track every small expense, it adds up over time!",
    "🔥 You're doing great! Keep your savings consistent.",
    "🎯 Save at least 20% of your income every month.",
    "📊 Reviewing expenses weekly keeps you financially aware.",
    "🚀 Small steps lead to big financial goals!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric", month: "long", year: "numeric" 
    });
  };

  const showDay = (date) => {
    return date.toLocaleDateString("en-IN", { weekday: "long" });
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // ✅ Fetch latest 24h transactions
  async function fetchLatestTransactions() {
    const backendUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${backendUrl}/transaction/latest`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.status === 201) {
        setLatestTransactions(res.data.data.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      
      console.error("Error fetching latest transactions", error);
      toast.error(error?.response?.data?.message || "Failed to fetch latest transactions ❌"); // ✅ Toast
    }
  }

  // ✅ Fetch summary
  async function fetchSummary() {
    try {
      const res = await getSummery();
      if (res.status === 201) {
        const data = res.data.data;
        setBalance(data.balance);
        setTotalIncome(data.totalIncome);
        setTotalExpense(data.totalExpense);
      }
    } catch (error) {
      console.error("Error fetching summary", error);
      toast.error("Failed to fetch summary ❌"); // ✅ Toast
    }
  }

  // ✅ Delete Transaction
  async function handleDeleteTransaction(id) {
    if (!id) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteTransaction(id);
      if (res.status === 200) {
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
        fetchLatestTransactions(); // refresh
        toast.success("Transaction deleted successfully ✅"); // ✅ Toast
      }
    } catch (error) {
     
      toast.error("Failed to delete transaction ❌"); // ✅ Toast
    }
  }

  useEffect(() => {
    fetchSummary();
    fetchLatestTransactions();
    setMotivation(tips[Math.floor(Math.random() * tips.length)]);
  }, [Transactions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Box */}
        <div className="mb-8 p-6 rounded-2xl md:w-[50%] bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg">
          <h2 className="text-2xl font-bold">
            {getGreeting()}, <span className="capitalize">{user?.name || "User"} 👋</span>
          </h2>
          <p className="text-lg font-semibold">{showDay(time)}</p>
          <p className="text-sm opacity-90">{formatDate(time)}</p>
          <p className="text-sm opacity-80 mt-1">{formatTime(time)}</p>
        </div>

        {/* Motivation Tip */}
        <div className="mb-8 p-4 rounded-lg bg-yellow-100 text-yellow-800 shadow-sm text-center font-medium">
          {motivation}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard title="Total Income" amount={totalIncome} type="income" />
          <SummaryCard title="Total Expenses" amount={totalExpense} type="expense" />
          <SummaryCard title="Balance" amount={balance} type="balance" />
        </div>

        {/* Add Transaction Button */}
        <div className="mb-6">
          <Link
            to="/home/add-transaction"
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors inline-flex items-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </Link>
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={latestTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          history={false}
        />
      </div>
    </div>
  );
}
