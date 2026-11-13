import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { OverlayLayerActiveContext } from "@/areaNote/components/MapContainer";
import NotificationCenter from "@/components/notification/NotificationCenter";
import {
  dismissNotification,
  getNotificationQueue,
} from "@/components/notification/notificationService";
import ArchivedLeaseAreasLayer from "./ArchivedLeaseAreasLayer";
import { fetchIntersectingArchivedAreas } from "@/leases/requestsAsync";
import { formatDate } from "@/util/helpers";

vi.mock("@/leases/requestsAsync", () => ({
  fetchIntersectingArchivedAreas: vi.fn(),
}));
vi.mock("@/components/map/LeafletGeoJSONLayer", () => ({
  default: ({ data, style }) => (
    <div
      data-testid={style.weight === 4 ? "highlighted-areas" : "visible-areas"}
    >
      {data.features.length}
    </div>
  ),
}));
vi.mock("@/components/map/useGeoJsonFeatureInteractions", () => ({
  default: () => vi.fn(),
}));

describe("ArchivedLeaseAreasLayer", () => {
  afterEach(() => {
    cleanup();
    getNotificationQueue().forEach(({ id }) => dismissNotification(id));
    vi.clearAllMocks();
  });

  const renderLayer = (leaseId: number) =>
    render(
      <>
        <NotificationCenter />
        <ArchivedLeaseAreasLayer leaseId={leaseId} />
      </>,
    );

  it("sorts leases by latest end date and filters and highlights their areas", async () => {
    vi.mocked(fetchIntersectingArchivedAreas).mockResolvedValue({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: null,
          properties: {
            id: 1,
            identifier: "Older area",
            lease: { id: 10, identifier: "A1100-1", end_date: "2020-01-01" },
          },
        },
        {
          type: "Feature",
          geometry: null,
          properties: {
            id: 2,
            identifier: "Newer area",
            lease: {
              id: 20,
              identifier: "A1100-2",
              end_date: "2024-01-01",
              service_unit: {
                id: 1,
                name: "Maaomaisuuden kehittäminen ja tontit",
              },
            },
          },
        },
      ],
    });
    renderLayer(42);
    await screen.findByText("Päättyneet vuokraukset (2)");
    const endDate = screen.getByText(`Päättynyt ${formatDate("2024-01-01")}`);
    expect(endDate.tagName).toBe("TIME");
    expect(endDate.getAttribute("datetime")).toBe("2024-01-01");
    expect(endDate.closest("button")).toBeNull();
    const leaseLink = screen.getByRole("link", { name: "A1100-2" });
    expect(leaseLink.getAttribute("href")).toBe("/vuokraukset/20");
    expect(leaseLink.getAttribute("target")).toBe("_blank");
    const panel = leaseLink.closest(
      ".archived-lease-panel",
    ) as HTMLDetailsElement;
    const header = panel.querySelector(":scope > summary") as HTMLElement;
    const dragHandle = screen.getByTitle("Siirrä paneelia");
    const mapContainer = document.createElement("div");
    Object.defineProperties(mapContainer, {
      clientWidth: { value: 800 },
      clientHeight: { value: 600 },
    });
    Object.defineProperties(panel, {
      offsetParent: { value: mapContainer },
      offsetLeft: { value: 12 },
      offsetTop: { value: 200 },
      offsetWidth: { value: 290 },
      offsetHeight: { value: 350 },
    });
    header.setPointerCapture = vi.fn();
    header.hasPointerCapture = vi.fn(() => true);
    header.releasePointerCapture = vi.fn();
    const pointerEvent = (name: string, clientX: number, clientY: number) => {
      const event = new Event(name, { bubbles: true });
      Object.defineProperties(event, {
        pointerId: { value: 1 },
        button: { value: 0 },
        clientX: { value: clientX },
        clientY: { value: clientY },
      });
      fireEvent(dragHandle, event);
    };
    pointerEvent("pointerdown", 100, 200);
    pointerEvent("pointermove", 260, 120);
    expect(panel.style.left).toBe("172px");
    expect(panel.style.top).toBe("120px");
    pointerEvent("pointermove", 2000, -1000);
    expect(panel.style.left).toBe("510px");
    expect(panel.style.top).toBe("0px");
    pointerEvent("pointerup", 2000, -1000);
    const dragClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(header, dragClick);
    expect(dragClick.defaultPrevented).toBe(true);
    const normalClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(header, normalClick);
    expect(normalClick.defaultPrevented).toBe(false);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0].getAttribute("aria-label")).toContain("A1100-2");
    expect(screen.getByTestId("visible-areas").textContent).toBe("2");
    fireEvent.mouseEnter(screen.getByText("A1100-2").closest("li")!);
    expect(screen.getByTestId("highlighted-areas").textContent).toBe("1");
    fireEvent.click(checkboxes[0]);
    expect(screen.getByTestId("visible-areas").textContent).toBe("1");
    expect(screen.getByTestId("highlighted-areas").textContent).toBe("0");
    fireEvent.click(screen.getByRole("button", { name: "Piilota kaikki" }));
    expect(screen.getByTestId("visible-areas").textContent).toBe("0");
    fireEvent.click(screen.getByRole("button", { name: "Näytä kaikki" }));
    expect(screen.getByTestId("visible-areas").textContent).toBe("2");
    const highlightButton = screen.getByRole("button", {
      name: "Korosta vuokrauksen A1100-2 alueet kartalla",
    });
    expect(highlightButton.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(highlightButton);
    fireEvent.mouseLeave(leaseLink.closest("li")!);
    fireEvent.blur(highlightButton);
    expect(highlightButton.getAttribute("aria-pressed")).toBe("true");
    expect(highlightButton.getAttribute("title")).toBe(
      "Poista korostus kartalta",
    );
    expect(screen.getByTestId("highlighted-areas").textContent).toBe("1");
    fireEvent.click(highlightButton);
    expect(highlightButton.getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByTestId("highlighted-areas")).toBeNull();
    expect(fetchIntersectingArchivedAreas).toHaveBeenCalledTimes(1);
  });

  it("fetches for the current lease and displays empty results", async () => {
    vi.mocked(fetchIntersectingArchivedAreas).mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
    renderLayer(42);
    await waitFor(() =>
      expect(
        getNotificationQueue().some(
          (notification) => notification.body === "Ei leikkaavia alueita.",
        ),
      ).toBe(true),
    );
    expect(fetchIntersectingArchivedAreas).toHaveBeenCalledWith(
      42,
      expect.any(AbortSignal),
    );
  });

  it("shows request errors without a retry action", async () => {
    vi.mocked(fetchIntersectingArchivedAreas).mockRejectedValue(
      new Error("offline"),
    );
    renderLayer(42);
    await waitFor(() =>
      expect(
        getNotificationQueue().some(
          (notification) => notification.body === "Alueiden haku epäonnistui.",
        ),
      ).toBe(true),
    );
    expect(
      screen.queryByRole("button", { name: "Yritä uudelleen" }),
    ).toBeNull();
    expect(fetchIntersectingArchivedAreas).toHaveBeenCalledTimes(1);
  });

  it("waits for selection after a lease change and caches results across toggles", async () => {
    vi.mocked(fetchIntersectingArchivedAreas).mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
    const layer = (active: boolean, leaseId: number) => (
      <>
        <NotificationCenter />
        <OverlayLayerActiveContext.Provider value={active}>
          <ArchivedLeaseAreasLayer key={leaseId} leaseId={leaseId} />
        </OverlayLayerActiveContext.Provider>
      </>
    );
    const { rerender } = render(layer(true, 42));
    await waitFor(() =>
      expect(fetchIntersectingArchivedAreas).toHaveBeenCalledTimes(1),
    );
    rerender(layer(false, 42));
    rerender(layer(true, 42));
    expect(fetchIntersectingArchivedAreas).toHaveBeenCalledTimes(1);
    rerender(layer(false, 43));
    expect(fetchIntersectingArchivedAreas).toHaveBeenCalledTimes(1);
    rerender(layer(true, 43));
    await waitFor(() =>
      expect(fetchIntersectingArchivedAreas).toHaveBeenCalledTimes(2),
    );
    expect(fetchIntersectingArchivedAreas).toHaveBeenLastCalledWith(
      43,
      expect.any(AbortSignal),
    );
  });

  it("aborts the request when unmounted", () => {
    vi.mocked(fetchIntersectingArchivedAreas).mockReturnValue(
      new Promise(() => {}),
    );
    const { unmount } = renderLayer(42);
    const signal = vi.mocked(fetchIntersectingArchivedAreas).mock.calls[0][1];
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
