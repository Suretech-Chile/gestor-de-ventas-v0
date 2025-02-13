import { useState, useRef } from "react";
import { CartItem, Customer, Product } from "../typing/typesUtils"; // Tipos
import LeftPanel from "./punto-de-venta-components/left-panel/LeftPanel";
import { LeftPanelViewTypes } from "../typing/typesUtils";
import RightPanel from "./punto-de-venta-components/right-panel/RightPanel";
import PagarScreen from "./punto-de-venta-components/PagarScreen";
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
  const [showPagarScreen, setShowPagarScreen] = useState<boolean>(false);

  // Handlers AddToCart y DecreaseFromCart que se usan en LeftPanel
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

  // Funciones usadas por right panel al confirmar la compra
  const buildBoleta = (cart: CartItem[]) => {
    console.log("Construiremos la boleta con:", cart);
  };

  const buildFactura = (cart: CartItem[]) => {
    console.log("Construiremos la factura con:", cart);
  };

  return (
    <div className="flex w-full h-screen relative overflow-hidden bg-gray-50">
      {/* Container absolute que envuelve LeftPanel y RightPanel permite la animación */}
      <div
        className="flex w-full h-full absolute transition-all duration-400 ease-in-out"
        style={{
          transform: showPagarScreen ? "translateX(-40%)" : "translateX(0)",
        }}
      >
        <div
          className={`w-2/5 transition-opacity duration-400 ${
            showPagarScreen ? "opacity-0" : "opacity-100"
          }`}
        >
          <LeftPanel
            currentView={leftPanelState}
            onViewChange={setLeftPanelState}
            onAddToCart={handleAddToCart}
            onDecreaseFromCart={handleDecreaseFromCart}
          />
        </div>
        <div className="w-3/5">
          <RightPanel
            cartItems={cartItems}
            setCartItems={setCartItems}
            selectedCustomer={selectedCustomer}
            saleType={saleType}
            setSaleType={setSaleType}
            setShowPagarScreen={setShowPagarScreen}
            showNotifications={showNotification}
          />
        </div>
      </div>

      {/* Pagar Screen - aparece desde la derecha */}
      <div
        className={`transition-all duration-400 ease-in-out absolute right-0 ${
          showPagarScreen
            ? "w-2/5 opacity-100 translate-x-0"
            : "w-2/5 opacity-0 translate-x-full"
        }`}
      >
        <PagarScreen saleType={saleType} />
      </div>
      {/* Sistema de notificaciones */}
      <NotificationQueue notifications={notifications} />
    </div>
  );
};

export default PuntoDeVenta;
