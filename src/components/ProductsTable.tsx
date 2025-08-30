import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { RootState } from '../store';
import { setSelectedProduct, setDrawerOpen, setCurrentPage } from '../store/uiSlice';
import { ProductWithStatus } from '../types';
import clsx from 'clsx';

const ProductsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { productsWithStatus } = useSelector((state: RootState) => state.products);
  const { filters, currentPage } = useSelector((state: RootState) => state.ui);

  const rowsPerPage = 10;

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

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold w-20';
    
    switch (status) {
      case 'Healthy':
        return `${baseClasses} bg-green-500 text-white`;
      case 'Low':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'Critical':
        return `${baseClasses} bg-red-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
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
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.demand}</td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(product.status)}>
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
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Rows per page: <span className="font-medium">10</span>
          </span>
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