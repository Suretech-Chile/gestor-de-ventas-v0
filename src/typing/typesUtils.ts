// Tipos de uso general
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number  | null;
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

// Tipos para el LeftPanel (Vista de Productos, customers, y extensible en un futuro)

// Definimos el tipo para los posibles estados
export type LeftPanelViewTypes = 'Products' | 'Customers';
// Si necesitas añadir más estados en el futuro, simplemente los agregas al tipo:
// type LeftPanelView = 'Products' | 'Customers' | 'Orders' | 'Analytics';

export interface LeftPanelProps {
  currentView: LeftPanelViewTypes;
  onViewChange: (view: LeftPanelViewTypes) => void;
  onAddToCart: (product: Product) => void;
  onDecreaseFromCart: (product: Product) => void;
}