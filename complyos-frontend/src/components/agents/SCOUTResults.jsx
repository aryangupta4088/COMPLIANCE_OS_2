import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import SchemeCard from '../ui/SchemeCard';

export const SCOUTResults = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cs-600"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-cs-600">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-center">No schemes found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-cs-900">
        <TrendingUp className="w-6 h-6 text-cs-600" />
        <span>Recommended Schemes ({results.length})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((scheme, index) => (
          <SchemeCard key={index} scheme={scheme} />
        ))}
      </div>
    </div>
  );
};

export default SCOUTResults;
