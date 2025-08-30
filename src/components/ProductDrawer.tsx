import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { RootState } from '../store';
import { setDrawerOpen, setSelectedProduct } from '../store/uiSlice';
import { updateProduct } from '../store/productsSlice';
import { warehouses } from '../data/mockData';
import { getStatusBadge } from './common/util';

interface UpdateDemandForm {
  demand: number;
}

interface TransferStockForm {
  stock?: number;
  warehouse: string;
}

const ProductDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { isDrawerOpen, selectedProductId } = useSelector((state: RootState) => state.ui);
  const { productsWithStatus } = useSelector((state: RootState) => state.products);

  const selectedProduct = selectedProductId 
    ? productsWithStatus.find(p => p.id === selectedProductId) 
    : null;


  const {
    register: registerDemand,
    handleSubmit: handleSubmitDemand,
    formState: { errors: demandErrors },
    reset: resetDemand,
    watch: watchDemand
  } = useForm<UpdateDemandForm>();

  const {
    register: registerStock,
    handleSubmit: handleSubmitStock,
    formState: { errors: stockErrors },
    setValue,
    watch: watchStock
  } = useForm<TransferStockForm>({
    defaultValues: {
      warehouse: selectedProduct?.warehouse || 'BLR-A'
    }
  });

  // Watch form values to enable/disable buttons
  const demandValue = watchDemand('demand');
  const stockValue = watchStock('stock');

  // Determine if buttons should be disabled
  const isDemandButtonDisabled = demandValue == null || demandValue === 0 || isNaN(demandValue);
  const isStockButtonDisabled = stockValue == null || stockValue === 0 || isNaN(stockValue);

  const onClose = () => {
    dispatch(setDrawerOpen(false));
    dispatch(setSelectedProduct(null));
  };

  const onUpdateDemand = (data: UpdateDemandForm) => {
    if (selectedProduct) {
      dispatch(updateProduct({
        id: selectedProduct.id,
        updates: { demand: data.demand }
      }));
      resetDemand();
    }
  };

  const onTransferStock = (data: TransferStockForm) => {
    if (selectedProduct && data.stock !== undefined) {
      const newStock = selectedProduct.stock + data.stock;
      dispatch(updateProduct({
        id: selectedProduct.id,
        updates: { stock: newStock, warehouse: data.warehouse }
      }));
      setValue('stock', undefined);
    }
  };

  return (
    <Transition appear show={isDrawerOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-end">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-white shadow-xl transition-all h-full">
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      Product Details
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {selectedProduct && (
                    <div className="flex-1 px-6 py-6 space-y-6">
                      {/* Product Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Information</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="text-sm text-gray-900">{selectedProduct.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">SKU</dt>
                            <dd className="text-sm text-gray-900">{selectedProduct.sku}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">ID</dt>
                            <dd className="text-sm text-gray-900">{selectedProduct.id}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Current Warehouse</dt>
                            <dd className="text-sm text-gray-900">{selectedProduct.warehouse}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                            <dd className="text-sm text-gray-900">{selectedProduct.stock}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Current Demand</dt>
                            <dd className="text-sm text-gray-900">{selectedProduct.demand}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1">
                              <span className={getStatusBadge(selectedProduct.status)}>
                                {selectedProduct.status}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Update Demand Form */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Demand</h3>
                        <form onSubmit={handleSubmitDemand(onUpdateDemand)} className="space-y-4">
                          <div>
                            <label htmlFor="demand-input" className="block text-sm font-medium text-gray-700 mb-1">
                              New Demand
                            </label>
                            <input
                              id="demand-input"
                              type="number"
                              min="0"
                              placeholder="New Demand"
                              {...registerDemand('demand', { 
                                required: 'Demand is required',
                                min: { value: 0, message: 'Demand must be positive' },
                                valueAsNumber: true
                              })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {demandErrors.demand && (
                              <p className="mt-1 text-sm text-red-600">{demandErrors.demand.message}</p>
                            )}
                          </div>
                          <button
                            type="submit"
                            disabled={isDemandButtonDisabled}
                            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              isDemandButtonDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                          >
                            Update Demand
                          </button>
                        </form>
                      </div>

                      {/* Transfer Stock Form */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Stock</h3>
                        <form onSubmit={handleSubmitStock(onTransferStock)} className="space-y-4">
                          <div>
                            <label htmlFor="stock-input" className="block text-sm font-medium text-gray-700 mb-1">
                              Stock Amount
                            </label>
                            <input
                              id="stock-input"
                              type="number"
                              placeholder="Amount"
                              {...registerStock('stock', { 
                                required: 'Stock is required',
                                valueAsNumber: true
                              })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Positive to add, negative to remove
                            </p>
                            {stockErrors.stock && (
                              <p className="mt-1 text-sm text-red-600">{stockErrors.stock.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="warehouse-select" className="block text-sm font-medium text-gray-700 mb-1">
                              Target Warehouse
                            </label>
                            <select
                              id="warehouse-select"
                              {...registerStock('warehouse', { required: 'Warehouse is required' })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              {warehouses.filter(w => w !== 'All Warehouses').map((warehouse) => (
                                <option key={warehouse} value={warehouse}>
                                  {warehouse}
                                </option>
                              ))}
                            </select>
                            {stockErrors.warehouse && (
                              <p className="mt-1 text-sm text-red-600">{stockErrors.warehouse.message}</p>
                            )}
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isStockButtonDisabled}
                            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              isStockButtonDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                            }`}
                          >
                            Transfer Stock
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDrawer;