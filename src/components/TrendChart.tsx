import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RootState } from '../store';
import { TrendData } from '../types';

const TrendChart: React.FC = () => {
  const dateRange = useSelector((state: RootState) => state.ui.dateRange);
  const { kpis } = useSelector((state: RootState) => state.products);
  
  const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;
  
  // Generate trend data with today's date and current totals
  const data = useMemo(() => {
    const trendData: TrendData[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const isToday = i === days - 1;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      trendData.push({
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        // For historical days, use simulated data around current totals
        // For today, use actual current totals
        stock: isToday ? kpis.totalStock : kpis.totalStock + Math.random() * 40 - 20,
        demand: isToday ? kpis.totalDemand : kpis.totalDemand + Math.random() * 30 - 15
      });
    }

    return trendData;
  }, [days, kpis.totalStock, kpis.totalDemand]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock vs Demand Trend</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: '500' }}
              formatter={(value: number, name: string) => [Math.round(value).toLocaleString(), name]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              name="Stock"
            />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;