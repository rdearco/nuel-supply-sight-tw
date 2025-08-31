import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { RootState } from '../store';
import { setSelectedProduct, setDrawerOpen, setCurrentPage, setRowsPerPage } from '../store/uiSlice';
import { ProductWithStatus } from '../types';
import { getStatusBadge } from './common/util';
import clsx from 'clsx';

const ProductsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { productsWithStatus } = useSelector((state: RootState) => state.products);
  const { filters, currentPage, rowsPerPage } = useSelector((state: RootState) => state.ui);

  const filteredProducts = useMemo(() => {
    return productsWithStatus.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.id.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesWarehouse = 
        filters.warehouse === 'All Warehouses' || product.warehouse === filters.warehouse;
      
      const matchesStatus = 
        filters.status === 'All Status' || product.status === filters.status;

      return matchesSearch && matchesWarehouse && matchesStatus;
    });
  }, [productsWithStatus, filters]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  const handleProductClick = (product: ProductWithStatus) => {
    dispatch(setSelectedProduct(product.id));
    dispatch(setDrawerOpen(true));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleRowsPerPageChange = (rows: number) => {
    dispatch(setRowsPerPage(rows));
  };

  const getRowClasses = (status: string) => {
    return clsx(
      'cursor-pointer hover:bg-gray-50 transition-colors',
      status === 'Critical' && 'bg-red-50'
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Products ({filteredProducts.length})
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className={getRowClasses(product.status)}
                onClick={() => handleProductClick(product)}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.warehouse}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.demand.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(product.status, true)}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filteredProducts.length)} of {filteredProducts.length}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;