// @flow

import type {RootState} from './root/types';

export type Action<Type: string, Payload> = {
  type: Type,
  payload: Payload,
};

export type Reducer<State> = (state: State, action: any) => State

export type Selector<Value, Props> = (state: RootState, props: Props) => Value;

export type Attributes = ?Object;

export type Methods = ?Object;

type Coordinate = Array<number>;

export type LeafletFeature = {
  geometry: {
    coordinates: Array<Coordinate>,
    type: string,
  },
  properties: Object,
  type: 'Feature',
};

export type LeafletGeoJson = {
  features: Array<LeafletFeature>,
  type: 'FeatureCollection',
}
