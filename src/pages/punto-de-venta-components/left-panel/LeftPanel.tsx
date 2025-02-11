import { useState, useEffect } from "react";
import { Search, Filter, UserCircle, ShoppingCart } from "lucide-react";
import axios from "axios";

// Tipos
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

// Panel izquierdo
const LeftPanel = ({
  showProducts,
  setShowProducts,
}: {
  showProducts: boolean;
  setShowProducts: (show: boolean) => void;
}) => {
  return (
    <div className="w-2/5 border-r border-gray-200 flex flex-col">
      <LeftPanelHeader />
      <LeftPanelContent showProducts={showProducts} />
      <LeftPanelFooter
        showProducts={showProducts}
        setShowProducts={setShowProducts}
      />
    </div>
  );
};

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

const LeftPanelContent = ({ showProducts }: { showProducts: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (showProducts) {
      fetchProducts();
    }
  }, [showProducts]);

  if (!showProducts) {
    return (
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center text-gray-500">
        Lista de clientes (próximamente)
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-2 font-medium text-gray-600">Nombre</th>
            <th className="text-right pb-2 font-medium text-gray-600">
              Precio
            </th>
            <th className="text-right pb-2 font-medium text-gray-600">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 text-gray-900">{product.name}</td>
              <td className="py-3 text-right text-gray-900">
                ${product.price.toFixed(2)}
              </td>
              <td className="py-3 text-right text-gray-900">
                <span
                  className={`${product.stock === 0 ? "text-red-600" : ""}`}
                >
                  {product.stock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LeftPanelFooter = ({
  showProducts,
  setShowProducts,
}: {
  showProducts: boolean;
  setShowProducts: (show: boolean) => void;
}) => (
  <div className="p-4 border-t border-gray-200 flex justify-between">
    <button
      onClick={() => setShowProducts(true)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        showProducts
          ? "bg-black text-white hover:bg-gray-800"
          : "border border-gray-300 hover:bg-gray-100"
      }`}
    >
      <ShoppingCart className="h-5 w-5" />
      Productos
    </button>
    <button
      onClick={() => setShowProducts(false)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        !showProducts
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
