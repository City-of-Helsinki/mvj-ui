// @flow

import isArray from 'lodash/isArray';
import get from 'lodash/get';

import {TableSortOrder} from '$src/enums';
import type {LeafletFeature, LeafletGeoJson} from '$src/types';

export const areaSearchSearchFilters = (query: Object): Object => {
  const searchQuery = {...query};

  searchQuery.state = isArray(searchQuery.state)
    ? searchQuery.state
    : searchQuery.state ? [searchQuery.state] : [];

  if (searchQuery.sort_key) {
    searchQuery.ordering = [searchQuery.sort_key];

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

/**
 * Get application target features for geojson data
 * @param {Object[]} searches
 * @returns {Object[]}
 */
export const getAreaSearchFeatures = (searches: Array<Object>): Array<LeafletFeature> => {
  const features = [];

  searches.forEach((search) => {
    const coords = get(search, 'geometry.coordinates', []);

    if (!coords.length) {
      return;
    }

    features.push({
      type: 'Feature',
      geometry: {
        ...search.geometry,
      },
      properties: {
        id: search.id,
        search,
        feature_type: 'areaSearch',
      },
    });
  });

  return features;
};

/**
 * Get application target geojson data
 * @param {Object[]} searches
 * @returns {Object}
 */
export const getAreaSearchGeoJson = (searches: Array<Object>): LeafletGeoJson => {
  const features = getAreaSearchFeatures(searches);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};
