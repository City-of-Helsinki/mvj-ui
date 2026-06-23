import React, { useSyncExternalStore } from "react";
import { Notification } from "hds-react";
import {
  dismissNotification,
  getNotificationQueue,
  subscribeToNotifications,
} from "@/components/notification/notificationService";

const fallbackLabelByType = {
  alert: "Varoitus",
  error: "Virhe",
  info: "Ilmoitus",
  success: "Onnistui",
};

const NotificationCenter = () => {
  const notifications = useSyncExternalStore(
    subscribeToNotifications,
    getNotificationQueue,
  );

  const currentNotification = notifications[0];
  if (!currentNotification) {
    return null;
  }

  const { autoCloseDuration, body, id, title, type } = currentNotification;

  return (
    <Notification
      key={id}
      autoClose={autoCloseDuration > 0}
      autoCloseDuration={autoCloseDuration}
      closeButtonLabelText="Sulje ilmoitus"
      dismissible
      label={title || fallbackLabelByType[type]}
      onClose={() => dismissNotification(id)}
      position="bottom-right"
      type={type}
    >
      {body || title}
    </Notification>
  );
};

export default NotificationCenter;
