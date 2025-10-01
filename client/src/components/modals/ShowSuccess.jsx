const ShowSuccess = ({ isIncome, isEdit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center w-[90%] max-w-sm">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Transaction {isEdit ? "Updated" : "Added"}!
        </h3>

        {/* Message */}
        <p className="text-gray-600">
          Your {isIncome ? "income" : "expense"} has been recorded successfully.
        </p>
      </div>
    </div>
  );
};

export default ShowSuccess;
