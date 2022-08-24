import get from 'lodash/get';

import {
  getApiResponseResults,
} from '$util/helpers';

import type {LeafletFeature, LeafletGeoJson} from '$src/types';

/**
 * Get plotApplication list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentPlotApplicationsListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((plotApplication) => getContentApplicationListItem(plotApplication));

/**
 * Get plotApplication list item
 * @param {Object} plotApplication
 * @return {Object}
 */
export const getContentApplicationListItem = (plotApplication: Object): Object => {
  return {
    id: plotApplication.id,
    plot_search: plotApplication.plot_search,
    applicants: plotApplication.applicants,
    plot_search_type: plotApplication.plot_search_type,
    plot_search_subtype: plotApplication.plot_search_subtype,
    target_identifier: plotApplication.targets.map(target => target.identifier),
    target_address: plotApplication.targets.map(target => target.address.address),
    target_reserved: plotApplication.targets.map(target => target.reserved),
  };
};

/**
 * Get application target features for geojson data
 * @param {Object[]} applications
 * @returns {Object[]}
 */
export const getApplicationTargetFeatures = (applications: Array<Object>): Array<LeafletFeature> => {
  const features = [];

  applications.forEach((application) => {
    const targets = get(application, 'targets', []);

    targets.forEach((target) => {
      const coords = get(target, 'geometry.coordinates', []);

      if (!coords.length) {
        return;
      }

      features.push({
        type: 'Feature',
        geometry: {
          ...target.geometry
        },
        properties: {
          id: application.id,
          feature_type: 'plotApplication',
          target: target,
          state: get(application, 'state.id') || application.state,
        },
      });
    });
  });

  return features;
};

/**
 * Get application target geojson data
 * @param {Object[]} applications
 * @returns {Object}
 */
export const getApplicationTargetGeoJson = (applications: Array<Object>): LeafletGeoJson => {
  const features = getApplicationTargetFeatures(applications);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};
