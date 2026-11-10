import { getLanduseApiErrorMessage } from "@/landUse/api/fetchClient";

export type LanduseNotificationType = "info" | "success" | "error" | "alert";

export type LanduseNotification = {
  id: string;
  type: LanduseNotificationType;
  title?: string;
  body?: string;
  autoCloseDuration: number;
};

type Subscriber = () => void;

const ERROR_AUTO_CLOSE_DURATION_MS = 6_000;
const SUCCESS_AUTO_CLOSE_DURATION_MS = 4_000;
const INFO_AUTO_CLOSE_DURATION_MS = 4_000;

let counter = 0;
const subscribers = new Set<Subscriber>();
let queue: Array<LanduseNotification> = [];

const publish = () => {
  subscribers.forEach((subscriber) => subscriber());
};

export const enqueueNotification = (
  notification: Omit<LanduseNotification, "id">,
) => {
  const currentNotification = queue[0];
  const isDuplicate =
    currentNotification !== undefined &&
    currentNotification.type === notification.type &&
    currentNotification.title === notification.title &&
    currentNotification.body === notification.body;
  if (isDuplicate) {
    return;
  }

  counter += 1;
  queue = [...queue, { ...notification, id: `${Date.now()}-${counter}` }];
  publish();
};

export const dismissNotification = (id: string) => {
  const previousLength = queue.length;
  queue = queue.filter((notification) => notification.id !== id);

  if (queue.length !== previousLength) {
    publish();
  }
};

export const showLanduseApiErrorNotification = (error: unknown) => {
  enqueueNotification({
    type: "error",
    body: getLanduseApiErrorMessage(error),
    autoCloseDuration: ERROR_AUTO_CLOSE_DURATION_MS,
  });
};

export const showLanduseSuccessNotification = (body: string) => {
  enqueueNotification({
    type: "success",
    body,
    autoCloseDuration: SUCCESS_AUTO_CLOSE_DURATION_MS,
  });
};

export const showLanduseInfoNotification = (body: string) => {
  enqueueNotification({
    type: "info",
    body,
    autoCloseDuration: INFO_AUTO_CLOSE_DURATION_MS,
  });
};

export const getNotificationQueue = () => queue;

export const subscribeToNotifications = (subscriber: Subscriber) => {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
};
