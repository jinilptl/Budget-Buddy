import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TransactionList({ transactions = [], onDeleteTransaction, history = false }) {
  const navigate = useNavigate();
// console.log("Transactions in TransactionList:", transactions);

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {history ? "All Transactions" : "Recent Transactions ( last 24 hrs )"}
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {["Date", "Category", "Amount", "Type", "Description", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className={`py-3 px-2 font-medium text-gray-700 ${
                    heading === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-2 text-sm text-gray-600">
                  {formatDate(tx.transactionDate)}
                </td>
                <td className="py-3 px-2 text-sm text-gray-900">{tx.category}</td>
                <td
                  className={`py-3 px-2 text-sm font-medium ${
                    tx.transactionType === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {tx.transactionType === "expense" ? "-" : "+"}
                  {formatAmount(tx.amount)}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      tx.transactionType === "income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tx.transactionType}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-gray-600 max-w-xs truncate">
                  {tx.description || "-"}
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/home/edit-transaction/${tx._id}`)}
                      className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                      aria-label="Edit transaction"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx._id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">{tx.category}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(tx.transactionDate)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/home/edit-transaction/${tx._id}`)}
                  className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                  aria-label="Edit transaction"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteTransaction(tx._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`text-lg font-medium ${
                  tx.transactionType === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {tx.transactionType === "expense" ? "-" : "+"}
                {formatAmount(tx.amount)}
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  tx.transactionType === "income"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {tx.transactionType}
              </span>
            </div>

            {tx.description && (
              <p className="text-sm text-gray-600 mt-2">{tx.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
