export type AppNotificationType = "info" | "success" | "error" | "alert";

type NotificationOptions = {
  type?: AppNotificationType;
  timeOut?: number;
  preventDuplicates?: boolean;
};

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title?: string;
  body?: string;
  autoCloseDuration: number;
};

type Subscriber = () => void;

const DEFAULT_TIMEOUT_MS = 3_000;

let counter = 0;
const subscribers = new Set<Subscriber>();
let queue: Array<AppNotification> = [];

const publish = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const isSameNotificationContent = (
  first: Omit<AppNotification, "id">,
  second: Omit<AppNotification, "id">,
): boolean => {
  return (
    first.type === second.type &&
    first.title === second.title &&
    first.body === second.body
  );
};

const isVisibleDuplicateNotification = (
  notification: Omit<AppNotification, "id">,
): boolean => {
  const currentNotification = queue[0];
  if (!currentNotification) {
    return false;
  }

  return isSameNotificationContent(currentNotification, notification);
};

export const enqueueNotification = (
  message: Record<string, any>,
  options: NotificationOptions = {},
) => {
  const { title, body } = message;
  const type = options.type || "success";
  const autoCloseDuration =
    options.timeOut !== undefined ? options.timeOut : DEFAULT_TIMEOUT_MS;
  const notification: Omit<AppNotification, "id"> = {
    type,
    title,
    body,
    autoCloseDuration,
  };

  if (
    options.preventDuplicates !== false &&
    isVisibleDuplicateNotification(notification)
  ) {
    return;
  }

  counter += 1;
  queue = [
    ...queue,
    {
      ...notification,
      id: `${Date.now()}-${counter}`,
    },
  ];
  publish();
};

export const dismissNotification = (id: string) => {
  const previousLength = queue.length;
  queue = queue.filter((notification) => notification.id !== id);

  if (queue.length === previousLength) {
    return;
  }

  publish();
};

export const getNotificationQueue = () => queue;

export const subscribeToNotifications = (subscriber: Subscriber) => {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
};
