import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { RootState } from '../store';
import { setDrawerOpen, setSelectedProduct } from '../store/uiSlice';
import { updateProduct } from '../store/productsSlice';
import { warehouses } from '../data/mockData';

interface UpdateDemandForm {
  demand: number;
}

interface TransferStockForm {
  stock: number;
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
    formState: { errors: demandErrors }
  } = useForm<UpdateDemandForm>({
    defaultValues: {
      demand: selectedProduct?.demand || 0
    }
  });

  const {
    register: registerStock,
    handleSubmit: handleSubmitStock,
    formState: { errors: stockErrors }
  } = useForm<TransferStockForm>({
    defaultValues: {
      stock: selectedProduct?.stock || 0,
      warehouse: selectedProduct?.warehouse || 'BLR-A'
    }
  });

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
      onClose();
    }
  };

  const onTransferStock = (data: TransferStockForm) => {
    if (selectedProduct) {
      dispatch(updateProduct({
        id: selectedProduct.id,
        updates: { stock: data.stock, warehouse: data.warehouse }
      }));
      onClose();
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
                        </dl>
                      </div>

                      {/* Update Demand Form */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Demand</h3>
                        <form onSubmit={handleSubmitDemand(onUpdateDemand)} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              New Demand
                            </label>
                            <input
                              type="number"
                              min="0"
                              {...registerDemand('demand', { 
                                required: 'Demand is required',
                                min: { value: 0, message: 'Demand must be positive' }
                              })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {demandErrors.demand && (
                              <p className="mt-1 text-sm text-red-600">{demandErrors.demand.message}</p>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Stock Amount
                            </label>
                            <input
                              type="number"
                              min="0"
                              {...registerStock('stock', { 
                                required: 'Stock is required',
                                min: { value: 0, message: 'Stock must be positive' }
                              })}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {stockErrors.stock && (
                              <p className="mt-1 text-sm text-red-600">{stockErrors.stock.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Target Warehouse
                            </label>
                            <select
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
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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