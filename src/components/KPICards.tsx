import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const KPICards: React.FC = () => {
  const kpis = useSelector((state: RootState) => state.products.kpis);

  const cards = [
    {
      title: 'Total Stock',
      value: kpis.totalStock.toLocaleString(),
      bgColor: 'bg-white'
    },
    {
      title: 'Total Demand', 
      value: kpis.totalDemand.toLocaleString(),
      bgColor: 'bg-white'
    },
    {
      title: 'Fill Rate',
      value: `${kpis.fillRate}%`,
      bgColor: 'bg-white'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg border border-gray-200 p-6 shadow-sm`}
        >
          <div className="text-sm font-medium text-gray-600 mb-2">
            {card.title}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;