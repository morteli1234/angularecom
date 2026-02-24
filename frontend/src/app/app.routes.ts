import { Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart/cart-page/cart-page';
import { HomeComponent } from './pages/home/home';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail';
import { ProductListComponent } from './pages/products/product-list/product-list';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'products/category/:category',
    component: ProductListComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent
  },
  {
    path: 'cart',
    component: CartPageComponent
  }
];
