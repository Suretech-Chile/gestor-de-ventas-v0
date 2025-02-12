import { useState, useEffect } from "react";
import axios from "axios";
import {
  Product,
  LeftPanelViewTypes,
  LeftPanelProps,
} from "../../../typing/typesUtils";
import { CirclePlus, OctagonMinus } from "lucide-react";

const LeftPanelContent = ({
  view,
  onAdd, //Estas funciones de handle AddToCart o DecreaseFromCart deberían pasarse desde el Padre de LeftPanel, PuntoDeVenta
  onDecrease,
}: {
  view: LeftPanelViewTypes;
  onAdd: LeftPanelProps["onAddToCart"];
  onDecrease: LeftPanelProps["onDecreaseFromCart"];
}) => {
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

    if (view === "Products") {
      fetchProducts();
    }
  }, [view]);

  if (view === "Customers") {
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
            <th className="text-right pb-2 font-medium text-gray-600">
              Agregar o<br /> Remover
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <td className="py-3 text-gray-900">{product.name}</td>
              <td className="py-3 text-right text-gray-900">
                <span className={`${!product.price ? "text-red-600" : ""}`}>
                  {product.price || product.price === 0
                    ? "$" + product.price.toFixed(2)
                    : "Sin info"}
                </span>
              </td>
              <td className="py-3 text-right text-gray-900">
                <span className={`${!product.stock ? "text-red-600" : ""}`}>
                  {product.stock || product.stock === 0
                    ? product.stock
                    : "Sin info"}
                </span>
              </td>
              <td className="py-3 flex justify-end gap-0.5">
                <button
                  className="hover:bg-gray-100 hover:cursor-pointer p-1 rounded-full"
                  onClick={() => onAdd(product)}
                >
                  <CirclePlus className="text-gray-600 hover:text-gray-900" />
                </button>
                <button
                  className="hover:bg-gray-100 hover:cursor-pointer p-1 rounded-full"
                  onClick={() => onDecrease(product)}
                >
                  <OctagonMinus className="text-red-500 hover:text-red-900" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeftPanelContent;
