import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import RelatedLeaseAreasLayer from "./RelatedLeaseAreasLayer";
import { fetchRelatedAreas } from "@/leases/requestsAsync";
import type { Lease } from "@/leases/types";
import { OverlayLayerActiveContext } from "@/areaNote/components/MapContainer";

vi.mock("@/leases/requestsAsync", () => ({ fetchRelatedAreas: vi.fn() }));
vi.mock("react-redux", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-redux")>()),
  useSelector: () => ({}),
}));
vi.mock("@/components/notification/notificationService", () => ({
  enqueueNotification: vi.fn(),
  dismissNotification: vi.fn(),
}));
vi.mock("@/components/map/LeafletGeoJSONLayer", () => ({
  default: ({ data, style }) => (
    <div data-testid={`areas-${style.color}-${style.weight}`}>
      {data.features.length}
    </div>
  ),
}));
vi.mock("@/components/map/useGeoJsonFeatureInteractions", () => ({
  default: () => vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("renders the history reference and missing geometry, greys inactive areas and controls visibility", async () => {
  const leases = [
    { id: 1, start_date: "2024-01-01", end_date: null },
    {
      id: 2,
      start_date: "2020-01-01",
      end_date: "2021-01-01",
      tenants: [
        {
          tenantcontact_set: [
            {
              type: "tenant",
              contact: { type: "company", name: "Example Oy" },
            },
          ],
        },
      ],
    },
    { id: 3, start_date: "2010-01-01", end_date: "2019-01-01" },
  ].map((lease) => ({
    ...lease,
    identifier: {
      type: { identifier: "A" },
      municipality: { identifier: "11" },
      district: { identifier: 0 },
      sequence: lease.id,
    },
  }));
  vi.mocked(fetchRelatedAreas).mockResolvedValue({
    type: "FeatureCollection",
    features: leases.slice(0, 2).map((lease) => ({
      type: "Feature",
      geometry: lease.id === 2 ? { type: "Point", coordinates: [0, 0] } : null,
      properties: { lease },
    })),
  });
  render(
    <RelatedLeaseAreasLayer
      lease={
        {
          ...leases[0],
          related_leases: {
            leases: Object.fromEntries(
              leases.map((lease) => [lease.id, lease]),
            ),
            edges: [
              { predecessor: 3, successor: 2, related_lease_id: 1 },
              { predecessor: 2, successor: 1, related_lease_id: 2 },
            ],
          },
        } as unknown as Lease
      }
    />,
  );
  await screen.findByText("Ei kartalla näytettäviä alueita");
  expect(screen.getByText("A1100-1 (nykyinen)")).toBeTruthy();
  expect(screen.getByText("Example Oy")).toBeTruthy();
  expect(screen.getByTestId("areas-#777777-2").textContent).toBe("1");
  expect(screen.getByText("Liittyvät vuokraukset (2 kpl)")).toBeTruthy();
  expect(screen.getByTestId("areas-#0078C0-2").textContent).toBe("0");
  expect(
    screen.queryByRole("checkbox", {
      name: "Näytä vuokrauksen A1100-1 alueet",
    }),
  ).toBeNull();
  expect(
    (
      screen.getByRole("checkbox", {
        name: "Näytä vuokrauksen A1100-3 alueet",
      }) as HTMLInputElement
    ).disabled,
  ).toBe(true);
  fireEvent.click(
    screen.getByRole("button", {
      name: "Korosta vuokrauksen A1100-2 alueet kartalla",
    }),
  );
  expect(screen.getByTestId("areas-#777777-5").textContent).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Piilota kaikki" }));
  expect(screen.getByTestId("areas-#777777-2").textContent).toBe("0");
  fireEvent.click(screen.getByRole("button", { name: "Näytä kaikki" }));
  expect(screen.getByTestId("areas-#777777-2").textContent).toBe("1");
});

it("waits for activation, retains loaded geometry across toggles and aborts on unmount", async () => {
  vi.mocked(fetchRelatedAreas).mockResolvedValue({
    type: "FeatureCollection",
    features: [],
  });
  const lease = { id: 42 } as Lease;
  const layer = (active: boolean) => (
    <OverlayLayerActiveContext.Provider value={active}>
      <RelatedLeaseAreasLayer lease={lease} />
    </OverlayLayerActiveContext.Provider>
  );
  const { rerender, unmount } = render(layer(false));
  expect(fetchRelatedAreas).not.toHaveBeenCalled();
  rerender(layer(true));
  await screen.findByTestId("areas-#777777-2");
  const signal = vi.mocked(fetchRelatedAreas).mock.calls[0][1];
  rerender(layer(false));
  rerender(layer(true));
  expect(fetchRelatedAreas).toHaveBeenCalledTimes(1);
  unmount();
  expect(signal.aborted).toBe(true);
});
