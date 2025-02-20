import { useState, useMemo, useRef } from "react";
import { CartItem, Customer, Sale } from "../../typing/typesUtils";
import {
  Truck,
  Store,
  CreditCard,
  Coins,
  Receipt,
  FileText,
} from "lucide-react";

// Constantes del Emisor
const EMISOR = {
  RUT: "76269769-6",
  RAZON_SOCIAL: "Chilesystems",
  GIRO: "Desarrollo de software",
  TELEFONO: ["912345678"],
  CORREO: "mvega@chilesystems.com",
  ACTECO: [620200],
  DIRECCION: "Calle 7 numero 3",
  COMUNA: "Santiago",
  CIUDAD: "Santiago",
};

// Tipos
type DeliveryMethod = "retiro" | "despacho";
type PaymentMethod = 1 | 2 | 3; // 1: Efectivo, 2: Débito, 3: Crédito

interface PagarScreenProps {
  cartItems: CartItem[];
  selectedCustomer: Customer | null;
  saleType: Sale["saleType"];
  setSaleType: (saleType: Sale["saleType"]) => void;
  onSubmit: (paymentData: any) => void;
}

const PagarScreen = ({
  cartItems,
  selectedCustomer,
  saleType,
  setSaleType,
  onSubmit,
}: PagarScreenProps) => {
  // Estados
  const scrollRef = useRef<HTMLDivElement>(null);
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("retiro");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(1);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    region: "",
    zipCode: "",
    deliveryDate: "",
  });

  // Para factura
  const [invoiceData, setInvoiceData] = useState({
    rut: "",
    razonSocial: "",
    giro: "",
    email: "",
    direccion: "",
    comuna: "",
    ciudad: "",
  });

  // Cálculos
  const calculations = useMemo(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + (item.product.price || 0) * item.quantity,
      0
    );
    const totalSinIva = Math.round(total / 1.19);
    const iva = total - totalSinIva;

    return {
      total,
      iva,
      totalSinIva,
    };
  }, [cartItems]);

  // Función para validar si todos los campos requeridos están completos
  const isFormValid = useMemo(() => {
    // Validación básica si no hay cliente seleccionado para la factura
    if (saleType === "factura" && !selectedCustomer) return false;

    // Validación para dirección de despacho
    if (deliveryMethod === "despacho") {
      const addressFields = [
        address.street,
        address.city,
        address.region,
        address.zipCode,
        address.deliveryDate,
      ];
      if (addressFields.some((field) => !field)) return false;
    }

    // Validación para campos de la factura
    if (saleType === "factura") {
      const invoiceFields = [
        invoiceData.rut,
        invoiceData.razonSocial,
        invoiceData.giro,
        invoiceData.email,
        invoiceData.direccion,
        invoiceData.comuna,
        invoiceData.ciudad,
      ];
      if (invoiceFields.some((field) => !field)) return false;
    }

    // Si pasa todas las validaciones
    return true;
  }, [selectedCustomer, deliveryMethod, address, saleType, invoiceData]);

  const handleConfirmSale = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const isScrolledToBottom = 
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight
      ) < 1;

    if (!isScrolledToBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      return;
    }
    const documentData = {
      formaEntrega: deliveryMethod,
      customerName: selectedCustomer ? selectedCustomer.name : null,
      Address:
        deliveryMethod === "despacho"
          ? {
              address: address.street,
              city: address.city,
              region: address.region,
              zipCode: address.zipCode,
              fecha: address.deliveryDate,
            }
          : null,
      Documento: {
        Encabezado: {
          IdDoc: {
            TipoDTE: saleType === "factura" ? 33 : 39,
            FchEmis: new Date().toISOString().split("T")[0],
            FmaPago: paymentMethod,
          },
          Emisor: EMISOR,
          Receptor:
            saleType === "factura"
              ? {
                  RUTRecep: invoiceData.rut,
                  RznSocRecep: invoiceData.razonSocial,
                  GiroRecep: invoiceData.giro,
                  CorreoRecep: invoiceData.email,
                  DirRecep: invoiceData.direccion,
                  CmnaRecep: invoiceData.comuna,
                  CiudadRecep: invoiceData.ciudad,
                }
              : {
                  RUTRecep: "66666666-6",
                  RznSocRecep: selectedCustomer
                    ? selectedCustomer.name
                    : "",
                  GiroRecep: "Particular",
                  CorreoRecep: "",
                  DirRecep: "",
                  CmnaRecep: "",
                  CiudadRecep: "",
                },
          Totales: {
            MntNeto: calculations.total.toString(),
            TasaIVA: "19",
            IVA: calculations.iva.toString(),
            MntTotal: calculations.total.toString(),
          },
        },
        Detalle: cartItems.map((item, index) => ({
          NroLinDet: (index + 1).toString(),
          NmbItem: item.product.name,
          QtyItem: item.quantity.toString(),
          UnmdItem: "un",
          PrcItem: item.product.price?.toString() || "0",
          MontoItem: (
            (item.product.price || 0) * item.quantity
          ).toString(),
        })),
      },
    };
    onSubmit(documentData);
  };

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Encabezado */}
          <div className="border-b pb-4">
            <h1 className="text-2xl font-semibold">Finalizar Compra</h1>
            <p className="text-gray-600">
              {selectedCustomer ? "Cliente: " + selectedCustomer.name : ""}
            </p>
          </div>
          {/* Método de entrega */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Método de entrega</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryMethod("retiro")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    deliveryMethod === "retiro"
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <Store className="w-6 h-6" />
                <span>Retiro en tienda</span>
              </button>
              <button
                onClick={() => setDeliveryMethod("despacho")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    deliveryMethod === "despacho"
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <Truck className="w-6 h-6" />
                <span>Despacho a domicilio</span>
              </button>
            </div>
          </div>
          {/* Formulario de dirección si es despacho */}
          {deliveryMethod === "despacho" && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Información de envío</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Dirección"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Región"
                  value={address.region}
                  onChange={(e) =>
                    setAddress({ ...address, region: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Código postal"
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <div className="col-span-2">
                  <input
                    type="date"
                    value={address.deliveryDate}
                    onChange={(e) =>
                      setAddress({ ...address, deliveryDate: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Tipo de documento */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Tipo de documento</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSaleType("boleta")}
                className={`p-4 border rounded-lg flex items-center gap-3 transition-colors
                  ${
                    saleType === "boleta"
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <Receipt className="w-6 h-6" />
                <span>Boleta electrónica</span>
              </button>
              <button
                onClick={() => setSaleType("factura")}
                className={`p-4 border rounded-lg flex items-center gap-3 transition-colors
                  ${
                    saleType === "factura"
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <FileText className="w-6 h-6" />
                <span>Factura electrónica</span>
              </button>
            </div>
          </div>
          {/* Datos adicionales para factura */}
          {saleType === "factura" && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Datos de facturación</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="RUT"
                  value={invoiceData.rut}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, rut: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Razón Social"
                  value={invoiceData.razonSocial}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      razonSocial: e.target.value,
                    })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Giro"
                  value={invoiceData.giro}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, giro: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={invoiceData.email}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, email: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={invoiceData.direccion}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      direccion: e.target.value,
                    })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Comuna"
                  value={invoiceData.comuna}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, comuna: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={invoiceData.ciudad}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, ciudad: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>
            </div>
          )}
          {/* Método de pago */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Método de pago</h2>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod(1)}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    paymentMethod === 1
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <Coins className="w-6 h-6" />
                <span>Efectivo</span>
              </button>
              <button
                onClick={() => setPaymentMethod(2)}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    paymentMethod === 2
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <CreditCard className="w-6 h-6" />
                <span>Débito</span>
              </button>
              <button
                onClick={() => setPaymentMethod(3)}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    paymentMethod === 3
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <CreditCard className="w-6 h-6" />
                <span>Crédito</span>
              </button>
            </div>
          </div>
          {/* Resumen */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal sin IVA</span>
              <span>${calculations.totalSinIva.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA (19%)</span>
              <span>${calculations.iva.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${calculations.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de confirmación */}
      <div className="p-6 border-t bg-white">
        <button
          onClick={handleConfirmSale}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-lg text-lg font-bold transition-colors
            ${
              isFormValid
                ? "bg-black text-white hover:bg-gray-600 cursor-pointer"
                : "bg-gray-200 border-black text-gray-500 cursor-not-allowed"
            }`}
        >
          Confirmar compra
        </button>
      </div>
    </div>
  );
};

export default PagarScreen;
