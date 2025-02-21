import { CartItem, Customer } from "../../../typing/typesUtils";
import { X, Save, CreditCard, Trash2, Minus, Plus } from "lucide-react";

// Panel derecho
const RightPanel = ({
  cartItems,
  setCartItems,
  selectedCustomer,
  saleType,
  setSaleType,
  showPagarScreen,
  setShowPagarScreen,
  showNotifications,
  openCartClearModal,
}: {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  selectedCustomer: Customer | null;
  saleType: "boleta" | "factura";
  setSaleType: (type: "boleta" | "factura") => void;
  showPagarScreen: boolean;
  setShowPagarScreen: (state: boolean) => void;
  showNotifications: (message: string, type: "success" | "error") => void;
  openCartClearModal: () => void;
}) => {
  return (
    <div className="h-full flex flex-col">
      <RightPanelHeader
        selectedCustomer={selectedCustomer}
        saleType={saleType}
      />
      <RightPanelContent
        cartItems={cartItems}
        setCartItems={setCartItems}
        saleType={saleType}
        setSaleType={setSaleType}
        showPagarScreen={showPagarScreen}
      />
      <RightPanelFooter
        cart={cartItems}
        setCartItems={setCartItems}
        saleType={saleType}
        showPagarScreen={showPagarScreen}
        setShowPagarScreen={setShowPagarScreen}
        showNotifications={showNotifications}
        openCartClearModal={openCartClearModal}
      />
    </div>
  );
};

const RightPanelHeader = ({
  selectedCustomer,
  saleType,
}: {
  selectedCustomer: Customer | null;
  saleType: "boleta" | "factura";
}) => (
  <div className="p-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900">Detalle de Compra</h2>
    <p className="text-gray-600">
      {saleType.toUpperCase()} -
      {selectedCustomer ? selectedCustomer.name : "Cliente no especificado"}
    </p>
  </div>
);

const RightPanelContent = ({
  cartItems,
  setCartItems,
  saleType,
  setSaleType,
  showPagarScreen,
}: {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  saleType: "boleta" | "factura";
  setSaleType: (type: "boleta" | "factura") => void;
  showPagarScreen: boolean;
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price! * item.quantity,
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
              {/* <th className="text-right pb-2 font-medium text-gray-600">
                Stock, 
              </th> */}
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
          { !showPagarScreen && <select
            value={saleType}
            onChange={(e) =>
              setSaleType(e.target.value as "boleta" | "factura")
            }
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="boleta">Boleta</option>
            <option value="factura">Factura</option>
          </select>}
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
  //Por decidir si deseamos que la X muestre notificación al eliminar productos hay que pasarle showNotification()
  item,
  cartItems,
  setCartItems,
}: {
  item: CartItem;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}) => {
  const handleQuantityChange = (quantity: number) => {
    // Verificamos el stock disponible y los comparamos con la cantidad deseada para establecer un limite
    const maxQuantity = cartItems.find((cartItem) => cartItem.product.id === item.product.id)?.product.stock || 0;
    setCartItems(cartItems.map((cartItem) =>
      cartItem.product.id === item.product.id
        ? { ...cartItem, quantity: Math.max(1, Math.min(quantity, maxQuantity)) }
        : cartItem
    ));
  };

  const handleRemoveItem = () => {
    setCartItems(
      cartItems.filter((cartItem) => cartItem.product.id !== item.product.id)
    );
    //Si desearamos notificar de el producto removido, podríamos pedir showNotification como prop y llamarla aquí
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 flex items-center">
        {/* Botón de Restar */}
        <button
          onClick={() => item.quantity > 1 && handleQuantityChange(item.quantity - 1)}
          className="w-8 h-10 flex items-center justify-center bg-white text-black border-r-0 border border-gray-300  rounded-l-full focus:outline-none hover:bg-red-500 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        {/* Input de Cantidad */}
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          className="w-10 h-10 text-center bg-white text-black border-t border-b border-gray-300 focus:outline-none focus:ring-0 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {/* Botón de Sumar */}
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-10 flex items-center justify-center bg-white text-black border-l-0 border border-gray-300 rounded-r-full focus:outline-none hover:bg-emerald-500 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </td>
      <td className="text-gray-900">{item.product.name}</td>
      <td className="text-right text-gray-900">
        ${item.product.price!.toFixed(2)}
      </td>
      {/* <td className="text-right text-gray-900">{item.product.stock}</td> DECIDIMOS NO MOSTRAR STOCK ACÁ */}
      <td className="text-right text-gray-900">
        ${(item.product.price! * item.quantity).toFixed(2)}
      </td>
      <td className="text-right">
        <button
          onClick={handleRemoveItem}
          className="p-1 rounded-lg hover:bg-red-500 hover:text-red-950 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

const RightPanelFooter = ({
  saleType,
  cart,
  setCartItems,
  showPagarScreen,
  setShowPagarScreen,
  openCartClearModal,
}: {
  saleType: "boleta" | "factura";
  cart: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  showPagarScreen: boolean;
  setShowPagarScreen: (state: boolean) => void;
  showNotifications: (message: string, type: "success" | "error") => void;
  openCartClearModal: () => void;
}) => {
  const handleCancelSale = () => {
    // Si ya estábamos en la pantalla de pago, abrimos el modal para confirmar la cancelación de la venta
    if (showPagarScreen) {
      openCartClearModal();
    } else {
      // Limpiamos carrito
      setCartItems([]);
      // Limpiar el cliente una vez implementemos la lista de clientes. PARA APLICARLO DEBERÍAMOS AGREGAR DE PROP SELECTEDCUSTOMER
      // if (selectedCustomer) {
      //   setSelectedCustomer(null);
      // }
    }
  };
  const handleSaveSale = () => {
    console.log("Falta implementar los borradores de venta.");
    console.log("Debería guardarse una venta tipo:", saleType);
    console.log("Con el carrito", cart);
    // Tenemos el tipo Sale creado para devolver el borrador de venta
  };
  const handlePagarButton = () => {
    if (!cart.length) {
      console.log("Se intentó comprar con un carrito vacío");
      return;
    }
    setShowPagarScreen(true);
  };
  return (
    <div className="p-4 border-t border-gray-200 flex justify-between">
      <button
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-2"
        onClick={handleCancelSale}
      >
        <Trash2 className="h-5 w-5" />
        {showPagarScreen ? "Cancelar venta" : "Quitar todo"}
      </button>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
          onClick={handleSaveSale}
        >
          <Save className="h-5 w-5" />
          Guardar
        </button>
        {!showPagarScreen && (
          <button
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
            onClick={handlePagarButton}
          >
            <CreditCard className="h-5 w-5" />
            Pagar
          </button>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
