// Tipos
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Customer = {
  id: string;
  name: string;
};

