import { useState } from "react";
import { CartItem, Customer } from "../typing/typesUtils";
import LeftPanel from "./punto-de-venta-components/left-panel/LeftPanel";
import RightPanel from "./punto-de-venta-components/right-panel/RightPanel";

// Componente principal
const PuntoDeVenta = () => {
  const [showProducts, setShowProducts] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [invoiceType, setInvoiceType] = useState<"boleta" | "factura">(
    "boleta"
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftPanel
        showProducts={showProducts}
        setShowProducts={setShowProducts}
      />
      <RightPanel
        cartItems={cartItems}
        setCartItems={setCartItems}
        selectedCustomer={selectedCustomer}
        invoiceType={invoiceType}
        setInvoiceType={setInvoiceType}
      />
    </div>
  );
};

export default PuntoDeVenta;
