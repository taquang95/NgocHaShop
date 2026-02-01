
import React from 'react';
import { MOCK_STATS } from '../constants';
import { BarChart, MousePointer } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 font-medium text-sm">Total Clicks</h3>
                 <MousePointer className="text-primary w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{MOCK_STATS.totalClicks.toLocaleString()}</p>
              <span className="text-green-500 text-sm font-medium">↑ 12% vs last week</span>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 font-medium text-sm">Avg CTR</h3>
                 <BarChart className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{MOCK_STATS.ctr}%</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Top Performing Products</h2>
              <div className="space-y-4">
                 {MOCK_STATS.topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                       <span className="font-medium text-gray-700">{p.title}</span>
                       <span className="font-bold text-primary">{p.clicks} clicks</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Traffic by Retailer</h2>
              <div className="space-y-4">
                 {Object.entries(MOCK_STATS.clicksByRetailer).map(([r, count]) => {
                    const percentage = (Number(count) / MOCK_STATS.totalClicks) * 100;
                    return (
                      <div key={r}>
                         <div className="flex justify-between text-sm mb-1">
                            <span>{r}</span>
                            <span className="font-medium">{count}</span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${percentage}%` }}
                            />
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
