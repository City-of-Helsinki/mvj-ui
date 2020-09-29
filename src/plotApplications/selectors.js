// @flow
import type {Attributes, Selector, Methods} from '../types';
import type {RootState} from '$src/root/types';

import type {
  PlotApplicationsList,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.attributes;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingAttributes;

export const getPlotApplicationsList: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.list;

export const getPlotApplicationsMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotApplications.methods;
