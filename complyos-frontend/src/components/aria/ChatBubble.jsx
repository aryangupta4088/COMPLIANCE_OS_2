import React from 'react';
import { MessageCircle, User } from 'lucide-react';

export const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-cs-100' : 'bg-cs-600'}`}>
        {isUser ? (
          <User className="w-4 h-4 text-cs-600" />
        ) : (
          <MessageCircle className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-cs-600 text-white rounded-br-none'
            : 'bg-cs-100 text-cs-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
