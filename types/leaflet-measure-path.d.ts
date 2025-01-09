import * as L from "leaflet";

declare module "leaflet" {
  interface Polyline<P = any> extends L.Polyline<P> {
    showMeasurements(): void;
  }

  interface Circle<P = any> extends L.Circle<P> {
    showMeasurements(): void;
  }

  interface Polygon<P = any> extends L.Polygon<P> {
    showMeasurements(): void;
  }
}
