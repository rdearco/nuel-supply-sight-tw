import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setDateRange } from '../store/uiSlice';
import { DateRange } from '../types';
import clsx from 'clsx';

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector((state: RootState) => state.ui.dateRange);

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7d', label: '7 DAYS' },
    { value: '14d', label: '14 DAYS' },
    { value: '30d', label: '30 DAYS' }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">SupplySight</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Date Range:</span>
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => dispatch(setDateRange(option.value))}
                className={clsx(
                  'px-3 py-1 text-xs font-medium rounded transition-colors',
                  dateRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;