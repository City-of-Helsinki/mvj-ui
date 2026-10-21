import type { RootState } from "@/root/types";

/**
 * A generic type for options used in Select lists.
 */
export type SelectListOption = {
  label: string;
  value: string | number;
};

/**
 * HDS Select option accepted type, does not accept `number`values like SelectListOption does.
 */
export type SelectOptionHds = {
  label: string;
  value: string;
};

export type Action<Type extends string, Payload> = {
  type: Type;
  payload: Payload;
};
export type Reducer<State> = (state: State, action: any) => State;
export type Selector<Value, Props> = (state: RootState, props: Props) => Value;
export type Attributes = Record<string, any> | null | undefined;
export type Reports = Record<string, any> | null | undefined;
export type Methods = Record<string, any> | null | undefined;
export type ApiResponse<T = any> =
  | (
      | {
          count: number;
          next: string | null | undefined;
          previous: string | null | undefined;
          results: Array<T>;
        }
      | null
      | undefined
    )
  | null;
export type QueryParams = {
  [key: string]: string | number | undefined;
  id?: number;
  limit?: number;
};
export type LeafletFeatureGeometry = GeoJSON.Geometry;
export type LeafletFeature = GeoJSON.Feature<
  LeafletFeatureGeometry,
  Record<string, any>
>;
export type LeafletGeoJson = GeoJSON.FeatureCollection<
  LeafletFeatureGeometry,
  Record<string, any>
>;
export type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  username: string;
};
