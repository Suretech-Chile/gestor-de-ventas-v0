import { useState, useRef } from "react";
import { CartItem, Customer, Product } from "../typing/typesUtils"; // Tipos
import LeftPanel from "./punto-de-venta-components/left-panel/LeftPanel";
import { LeftPanelViewTypes } from "../typing/typesUtils";
import RightPanel from "./punto-de-venta-components/right-panel/RightPanel";
import { useNotifications } from "../hooks/useNotifications";
import NotificationQueue from "../components/general-use/NotificationToast"; // El componente de notifiaciones y su tipo

// Componente principal
const PuntoDeVenta = () => {
  const [leftPanelState, setLeftPanelState] =
    useState<LeftPanelViewTypes>("Products");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [saleType, setSaleType] = useState<"boleta" | "factura">("boleta");
  const { notifications, showNotification } = useNotifications();

  const handleAddToCart = (product: Product) => {
    // Manejo de producto sin info de precio
    if (product.price === null) {
      showNotification(
        `No se puede añadir ${product.name}, pues no hay información de su precio`,
        "error"
      );
      return;
    }
    // Manejo de producto sin info de stock
    if (product.stock === null) {
      showNotification(
        `No se puede añadir ${product.name}, pues no hay información de su stock`,
        "error"
      );
      return;
    }
    // Si tenemos info del stock, podemos añadirlo al carrito siempre y cuando haya stock suficiente
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      // Verificar el stock disponible
      const currentQuantity =
        existingItemIndex >= 0 ? prevItems[existingItemIndex].quantity : 0;

      if (currentQuantity >= product.stock!) {
        showNotification(
          `No hay más stock disponible de ${product.name}`,
          "error"
        );
        return prevItems;
      }

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        showNotification(`Se agregó ${product.name} al carrito`, "success");
        return updatedItems;
      } else {
        showNotification(`Se agregó ${product.name} al carrito`, "success");
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const handleDecreaseFromCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity - 1;

        if (newQuantity <= 0) {
          // Eliminar el producto del carrito si la cantidad llega a 0
          showNotification(`Se eliminó ${product.name} del carrito`, "success");
          return updatedItems.filter((_, index) => index !== existingItemIndex);
        }

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
        };
        showNotification(`Se redujo la cantidad de ${product.name}`, "success");
        return updatedItems;
      }
      return prevItems;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftPanel
        currentView={leftPanelState}
        onViewChange={setLeftPanelState}
        onAddToCart={handleAddToCart}
        onDecreaseFromCart={handleDecreaseFromCart}
      />
      <RightPanel
        cartItems={cartItems}
        setCartItems={setCartItems}
        selectedCustomer={selectedCustomer}
        invoiceType={saleType}
        setInvoiceType={setSaleType}
      />
      {/* Mostrar notificaciones */}
      <NotificationQueue notifications={notifications} />
    </div>
  );
};

export default PuntoDeVenta;
