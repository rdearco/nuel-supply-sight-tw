import { ProductsState } from './products.state';
import { UIState } from './ui.state';

export interface AppState {
  products: ProductsState;
  ui: UIState;
}

export const selectProductsState = (state: AppState) => state.products;
export const selectUIState = (state: AppState) => state.ui;