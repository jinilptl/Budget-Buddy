import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function SummaryCard({ title, amount, type, className = '' }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-6 w-6 text-green-500" />;
      case 'expense':
        return <TrendingDown className="h-6 w-6 text-red-500" />;
      case 'balance':
        return <DollarSign className="h-6 w-6 text-teal-500" />;
      default:
        return <DollarSign className="h-6 w-6 text-gray-500" />;
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-500';
      case 'expense':
        return 'text-red-500';
      case 'balance':
        return amount >= 0 ? 'text-teal-500' : 'text-red-500';
      default:
        return 'text-gray-900';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'income':
        return 'bg-green-50 border-green-100';
      case 'expense':
        return 'bg-red-50 border-red-100';
      case 'balance':
        return amount >= 0 ? 'bg-teal-50 border-teal-100' : 'bg-red-50 border-red-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border ${getBackgroundColor()} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
        {getIcon()}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${getAmountColor()}`}>
            {type === 'balance' && amount < 0 ? '-' : ''}{formatAmount(amount)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {type === 'income' && 'Total earnings'}
            {type === 'expense' && 'Total spending'}
            {type === 'balance' && (amount >= 0 ? 'Available balance' : 'Deficit')}
          </p>
        </div>
      </div>
    </div>
  );
}