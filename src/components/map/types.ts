export type ControlPosition = "topleft" | "topright" | "bottomleft" | "bottomright";

interface ServiceMapAddress {
  object_type: "address";
  name: {
    fi: string;
    sv: string;
    en: string;
  };
  number: string;
  number_end: string;
  letter: string;
  modified_at: string;
  municipality: {
    id: string;
    name: {
      fi: string;
      sv: string;
    };
  };
  street: {
    name: {
      fi: string;
      sv?: string;
      en?: string;
    };
  };
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

export interface ServiceMapResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<ServiceMapAddress>;
  };

export interface AddressResult {
  x: number;
  y: number;
  label: string;
};

export interface ParseArgument<TData> {
  data: TData;
};

export interface SearchArgument {
  query: string;
};

export declare type PointTuple = [number, number];
export declare type BoundsTuple = [PointTuple, PointTuple];
export interface SearchResult<TRawResult = any> {
  x: number;
  y: number;
  label: string;
  bounds: BoundsTuple | null;
  raw: TRawResult;
}