import type { RootState } from "root/types";
export type Action<Type extends string, Payload> = {
  type: Type;
  payload: Payload;
};
export type Reducer<State> = (state: State, action: any) => State;
export type Selector<Value, Props> = (state: RootState, props: Props) => Value;
export type Attributes = Record<string, any> | null | undefined;
export type Reports = Record<string, any> | null | undefined;
export type Methods = Record<string, any> | null | undefined;
export type ApiResponse = ({
  count: number;
  next: string | null | undefined;
  previous: string | null | undefined;
  results: Array<Record<string, any>>;
} | null | undefined) | null;
type Coordinate = Array<number>;
export type LeafletFeatureGeometry = {
  coordinates: Array<Coordinate>;
  type: string;
};
export type LeafletFeature = {
  geometry: LeafletFeatureGeometry;
  properties: Record<string, any>;
  type: string;
};
export type LeafletGeoJson = {
  features: Array<LeafletFeature>;
  type: string;
};
export type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  username: string;
};