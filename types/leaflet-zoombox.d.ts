import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    class ZoomBox extends L.Control {
      includes: any;
      options: {
        position: L.ControlPosition;
        addToZoomControl: boolean;
        content: string;
        className: string;
        modal: boolean;
        title: string;
      };

      constructor(options?: Partial<ZoomBox['options']>);

      onAdd(map: L.Map): HTMLElement;
      activate(): void;
      deactivate(): void;
    }
  }

  function control(options?: Partial<Control.ZoomBox['options']>): Control.ZoomBox;
}