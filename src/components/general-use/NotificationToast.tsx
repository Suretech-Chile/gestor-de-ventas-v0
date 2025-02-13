import { AlertCircle, CheckCircle2 } from "lucide-react";
import { NotificationType, ToastProps } from "../../typing/typesUtils";

export const TOAST_LIMIT = 13; // Número máximo de notificaciones visibles
// En este caso, 13 toasts llegan hasta justo arriba del precio

const NotificationToast = ({ message, type, orderForStack }: ToastProps) => (
  <div
    style={{
      top: `${orderForStack * 40 + 20}px`,
      transform: "translateX(0)",
      opacity: 1,
      transition: "all 0.3s ease-in-out",
    }}
    className={`fixed right-5 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-lg
    ${
      type === "success"
        ? "bg-green-50 text-green-800"
        : "bg-red-50 text-red-800"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    )}
    {message}
  </div>
);

// Componente contenedor para la cola de notificaciones
const NotificationQueue = ({
  notifications,
}: {
  notifications: NotificationType[];
}) => {
  // Solo mostramos hasta TOAST_LIMIT notificaciones
  const visibleNotifications = notifications.slice(-TOAST_LIMIT);

  return (
    <>
      {visibleNotifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          orderForStack={index}
        />
      ))}
    </>
  );
};

export default NotificationQueue;
