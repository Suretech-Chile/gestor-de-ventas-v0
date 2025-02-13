import { Search, Filter, UserCircle, ShoppingCart } from "lucide-react";
import { LeftPanelViewTypes, LeftPanelProps } from "../../../typing/typesUtils";

import LeftPanelContent from "./LeftPanelContent"; //El contenido central del panel se maneja en un componente hijo externo

// Panel izquierdo
const LeftPanel: React.FC<LeftPanelProps> = ({
  currentView,
  onViewChange,
  onAddToCart, //Estas funciones de handle AddToCart o DecreaseFromCart deberían pasarse desde el Padre de LeftPanel, PuntoDeVenta
  onDecreaseFromCart,
}) => {
  return (
    <div className="h-full border-r border-gray-200 flex flex-col">
      <LeftPanelHeader />
      <LeftPanelContent
        view={currentView}
        onAdd={onAddToCart}
        onDecrease={onDecreaseFromCart}
      />
      <LeftPanelFooter view={currentView} setView={onViewChange} />
    </div>
  );
};

// El header se encarga de permitir buscar o filtrar los productos o clientes
const LeftPanelHeader = () => (
  <div className="p-4 border-b border-gray-200">
    <div className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
        <Filter className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  </div>
);

// El footer se encarga de intercambiar el view entre lista de productos o clientes
const LeftPanelFooter = ({
  view,
  setView,
}: {
  view: LeftPanelViewTypes;
  setView: LeftPanelProps["onViewChange"];
}) => (
  <div className="p-4 border-t border-gray-200 flex justify-between">
    <button
      onClick={() => setView("Products")}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        view === "Products"
          ? "bg-black text-white hover:bg-gray-800"
          : "border border-gray-300 hover:bg-gray-100"
      }`}
    >
      <ShoppingCart className="h-5 w-5" />
      Productos
    </button>
    <button
      onClick={() => setView("Customers")}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        view === "Customers"
          ? "bg-black text-white hover:bg-gray-800"
          : "border border-gray-300 hover:bg-gray-100"
      }`}
    >
      <UserCircle className="h-5 w-5" />
      Clientes
    </button>
  </div>
);

export default LeftPanel;
