import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import L from "leaflet";
import React from "react";
import MapContainer from "./MapContainer";

const WMS_URL = "https://kartta.hel.fi/ws/geoserver/avoindata/wms?";

describe("MapContainer base layers", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("creates the three Helsinki WMS base layers", () => {
    const wms = vi.spyOn(L.tileLayer, "wms");

    render(<MapContainer center={[60.17, 24.94]} zoom={5} />);

    expect(wms.mock.calls).toEqual([
      [
        WMS_URL,
        {
          layers: "avoindata:Karttasarja",
          format: "image/png",
          transparent: true,
        },
      ],
      [
        WMS_URL,
        {
          layers: "avoindata:Ortoilmakuva",
          format: "image/png",
          transparent: true,
        },
      ],
      [
        WMS_URL,
        {
          layers: "avoindata:Ajantasa_asemakaava",
          format: "image/png",
          transparent: true,
        },
      ],
    ]);
  });

  it("lists them in the layer control with Karttasarja selected", () => {
    const { container } = render(
      <MapContainer center={[60.17, 24.94]} zoom={5} />,
    );

    const labels = Array.from(
      container.querySelectorAll(".leaflet-control-layers-base label"),
    ).map((label) => label.textContent?.trim());
    const selected = container
      .querySelector(".leaflet-control-layers-base input:checked")
      ?.closest("label")
      ?.textContent?.trim();

    expect(labels).toEqual(["Karttasarja", "Ortoilmakuva", "Asemakaava"]);
    expect(selected).toBe("Karttasarja");
  });
});
