import React from 'react';

export const QuickReply = ({ options, onSelectOption }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectOption(option)}
          className="px-3 py-2 bg-cs-200 hover:bg-cs-300 text-cs-900 text-sm rounded-full transition border border-cs-300"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default QuickReply;
