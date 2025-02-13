// Este componente debe contener todos los campos para llamar a construir el JSON de boleta o factura y enviarlo al backend
import { useState } from "react";
import { Sale } from "../../typing/typesUtils";

// La idea es que acá creemos dos subcomponentes/funciones, una será la pantalla a renderizar cuando es tipo boleta, y otra cuando es tipo factura
const PagarScreen = ({ saleType }: { saleType: Sale["saleType"] }) => {
  const [saleTypeState, setSaleTypeState] = useState(saleType);
  return (
    <>
      {saleType === "boleta" && <div>PagarScreen para boletas</div>}
      {saleType === "factura" && <div>PagarScreen para facturas</div>}
    </>
  );
};
export default PagarScreen;
