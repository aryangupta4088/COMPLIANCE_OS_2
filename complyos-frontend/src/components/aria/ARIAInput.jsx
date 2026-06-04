import React from 'react';
import { MessageCircle } from 'lucide-react';

export const ARIAInput = ({ value, onChange, onSend, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      onChange('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2 items-center bg-white rounded-lg border border-cs-200 p-3">
        <MessageCircle className="text-cs-600 w-5 h-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask ARIA..."
          disabled={isLoading}
          className="flex-1 bg-transparent outline-none text-sm placeholder-cs-400"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="px-4 py-2 bg-cs-600 text-white rounded-md text-sm font-medium hover:bg-cs-700 disabled:opacity-50 transition"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};

export default ARIAInput;
