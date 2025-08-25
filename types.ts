export type ProductCategory = 'Electronics' | 'Books' | 'Clothing' | 'Home Goods';

export interface Sale {
  id: string;
  date: Date;
  product: string;
  category: ProductCategory;
  units: number;
  pricePerUnit: number;
}

export type TimePeriod = '7D' | '30D' | '90D' | 'ALL';

export interface SalesByDate {
    date: string;
    revenue: number;
}

export interface SalesByCategory {
    name: string;
    value: number;
}
