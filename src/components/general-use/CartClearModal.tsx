import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CartClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearCart: () => void;
  onKeepCart: () => void;
}

const CartClearModal: React.FC<CartClearModalProps> = ({
  isOpen,
  onClose,
  onClearCart,
  onKeepCart,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const MODAL_TITLE = "¿Deseas mantener el carrito actual?";
  const MODAL_MESSAGE =
    "Al cancelar esta venta, puedes mantener los productos ya seleccionados o empezar desde cero.";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // No funciona el shaking cuando se clica fuera del overlay
  const handleOverlayClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      <div
        className={`relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all ${
          isShaking
            ? "animate-[shake_0.6s_cubic-bezier(.36,.07,.19,.97)_both]"
            : ""
        }`}
        style={{
          ["--tw-animate-shake" as string]: isShaking
            ? "translate3d(-1px, 0, 0) rotate(-0.5deg)"
            : "none",
          animationIterationCount: "2",
        }}
      >
        {/* Icono de carrito y título */}
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                {MODAL_TITLE}
              </h3>
              <p className="text-sm text-gray-500">{MODAL_MESSAGE}</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              onClearCart();
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar carrito
          </button>
          <button
            onClick={() => {
              onKeepCart();
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Mantener carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartClearModal;
