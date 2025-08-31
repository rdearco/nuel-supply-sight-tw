import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { mockProducts } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  getProducts(): Observable<Product[]> {
    return of(mockProducts);
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      Object.assign(product, updates);
      return of(product);
    }
    throw new Error('Product not found');
  }
}