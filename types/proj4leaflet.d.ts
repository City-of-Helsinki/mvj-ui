import * as L from 'leaflet';

declare module 'leaflet' {
    namespace Proj {
        class CRS extends L.CRS {
            constructor(code: string, proj4def: string, options?: any);
          }
    }
}