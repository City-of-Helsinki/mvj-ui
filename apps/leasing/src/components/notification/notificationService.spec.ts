import { beforeEach, describe, expect, it, vi } from "vitest";

type NotificationServiceModule = typeof import("./notificationService");

const loadService = async (): Promise<NotificationServiceModule> => {
  return import("./notificationService");
};

describe("notificationService", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("enqueues notification with default values", async () => {
    const { enqueueNotification, getNotificationQueue } = await loadService();

    enqueueNotification({ title: "Saved", body: "Lease updated" });

    const queue = getNotificationQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe("success");
    expect(queue[0].autoCloseDuration).toBe(3000);
    expect(queue[0].title).toBe("Saved");
    expect(queue[0].body).toBe("Lease updated");
    expect(queue[0].id).toBeTruthy();
  });

  it("dismisses notification by id", async () => {
    const { enqueueNotification, dismissNotification, getNotificationQueue } =
      await loadService();

    enqueueNotification({ title: "Saved", body: "Lease updated" });
    const firstId = getNotificationQueue()[0].id;

    dismissNotification(firstId);

    expect(getNotificationQueue()).toHaveLength(0);
  });

  it("notifies subscribers on enqueue and dismiss", async () => {
    const {
      enqueueNotification,
      dismissNotification,
      getNotificationQueue,
      subscribeToNotifications,
    } = await loadService();

    const subscriber = vi.fn();
    const unsubscribe = subscribeToNotifications(subscriber);

    enqueueNotification({ title: "Saved", body: "Lease updated" });
    const firstId = getNotificationQueue()[0].id;
    dismissNotification(firstId);

    expect(subscriber).toHaveBeenCalledTimes(2);

    unsubscribe();
    enqueueNotification({ title: "Another", body: "Message" });

    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it("blocks duplicates only while same notification is visible", async () => {
    const { enqueueNotification, dismissNotification, getNotificationQueue } =
      await loadService();

    enqueueNotification({ title: "Saved", body: "Lease updated" });
    enqueueNotification({ title: "Saved", body: "Lease updated" });

    expect(getNotificationQueue()).toHaveLength(1);

    const visibleId = getNotificationQueue()[0].id;
    dismissNotification(visibleId);

    enqueueNotification({ title: "Saved", body: "Lease updated" });

    expect(getNotificationQueue()).toHaveLength(1);
  });

  it("allows duplicates when preventDuplicates is false", async () => {
    const { enqueueNotification, getNotificationQueue } = await loadService();

    enqueueNotification(
      { title: "Saved", body: "Lease updated" },
      { preventDuplicates: false },
    );
    enqueueNotification(
      { title: "Saved", body: "Lease updated" },
      { preventDuplicates: false },
    );

    expect(getNotificationQueue()).toHaveLength(2);
  });

  it("respects explicit timeout zero", async () => {
    const { enqueueNotification, getNotificationQueue } = await loadService();

    enqueueNotification(
      { title: "Pinned", body: "Needs manual close" },
      { timeOut: 0 },
    );

    expect(getNotificationQueue()[0].autoCloseDuration).toBe(0);
  });
});
