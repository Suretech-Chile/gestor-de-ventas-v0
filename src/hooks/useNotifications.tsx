import { useState, useRef } from "react";
import { TOAST_LIMIT } from "../components/general-use/NotificationToast";
import { NotificationType } from "../typing/typesUtils";

// Propósito del hook:
// Manejo de notifiaciones, usadas agregar un producto de la lista al carrito, o remover su cantidad
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  // Añadimos un contador que persiste entre renders para arreglar el bug de notificaciones con mismo id
  const notificationCounter = useRef(0);

  const showNotification = (message: string, type: "success" | "error") => {
    const id = parseInt(`${Date.now()}${notificationCounter.current++}`);
    setNotifications((prev) => {
      // Mantener solo las últimas TOAST_LIMIT notificaciones
      const newNotifications = [...prev, { message, type, id }];
      return newNotifications.slice(-TOAST_LIMIT);
    });

    // Luego de 3.5 segundos las eliminamos
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 3500);
  };

  return { notifications, setNotifications, showNotification };
};
