import { CartItem, Customer } from "../../../typing/typesUtils";
import { X, Save, CreditCard } from "lucide-react";

// Panel derecho
const RightPanel = ({
  cartItems,
  setCartItems,
  selectedCustomer,
  invoiceType,
  setInvoiceType,
}: {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  selectedCustomer: Customer | null;
  invoiceType: "boleta" | "factura";
  setInvoiceType: (type: "boleta" | "factura") => void;
}) => {
  return (
    <div className="w-3/5 flex flex-col">
      <RightPanelHeader
        selectedCustomer={selectedCustomer}
        invoiceType={invoiceType}
      />
      <RightPanelContent
        cartItems={cartItems}
        setCartItems={setCartItems}
        invoiceType={invoiceType}
        setInvoiceType={setInvoiceType}
      />
      <RightPanelFooter />
    </div>
  );
};

const RightPanelHeader = ({
  selectedCustomer,
  invoiceType,
}: {
  selectedCustomer: Customer | null;
  invoiceType: string;
}) => (
  <div className="p-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900">Detalle de Compra</h2>
    <p className="text-gray-600">
      {invoiceType.toUpperCase()} -
      {selectedCustomer ? selectedCustomer.name : "Cliente no especificado"}
    </p>
  </div>
);

const RightPanelContent = ({
  cartItems,
  setCartItems,
  invoiceType,
  setInvoiceType,
}: {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  invoiceType: "boleta" | "factura";
  setInvoiceType: (type: "boleta" | "factura") => void;
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col">
      <div className="flex-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-2 font-medium text-gray-600">
                Cantidad
              </th>
              <th className="text-left pb-2 font-medium text-gray-600">
                Producto
              </th>
              <th className="text-right pb-2 font-medium text-gray-600">
                Precio Unit.
              </th>
              <th className="text-right pb-2 font-medium text-gray-600">
                Stock
              </th>
              <th className="text-right pb-2 font-medium text-gray-600">
                Subtotal
              </th>
              <th className="text-right pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="relative">
          <select
            value={invoiceType}
            onChange={(e) =>
              setInvoiceType(e.target.value as "boleta" | "factura")
            }
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="boleta">Boleta</option>
            <option value="factura">Factura</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <div className="text-xl font-semibold text-gray-900">
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const CartItemRow = ({
  item,
  cartItems,
  setCartItems,
}: {
  item: CartItem;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}) => {
  const handleQuantityChange = (quantity: number) => {
    const newCartItems = cartItems.map((cartItem) =>
      cartItem.product.id === item.product.id
        ? { ...cartItem, quantity }
        : cartItem
    );
    setCartItems(newCartItems);
  };

  const handleRemove = () => {
    setCartItems(
      cartItems.filter((cartItem) => cartItem.product.id !== item.product.id)
    );
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          className="w-20 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </td>
      <td className="text-gray-900">{item.product.name}</td>
      <td className="text-right text-gray-900">
        ${item.product.price.toFixed(2)}
      </td>
      <td className="text-right text-gray-900">{item.product.stock}</td>
      <td className="text-right text-gray-900">
        ${(item.product.price * item.quantity).toFixed(2)}
      </td>
      <td className="text-right">
        <button
          onClick={handleRemove}
          className="p-1 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

const RightPanelFooter = () => (
  <div className="p-4 border-t border-gray-200 flex justify-between">
    <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
      Cancelar
    </button>
    <div className="flex gap-2">
      <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2">
        <Save className="h-5 w-5" />
        Guardar
      </button>
      <button className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Pagar
      </button>
    </div>
  </div>
);

export default RightPanel;
