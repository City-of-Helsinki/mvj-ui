// @flow
import React from 'react';

/**
 * View modes enumerable.
 *
 * @type {{EDIT: string, READONLY: string,}}
 */
export const ViewModes = {
  EDIT: 'edit',
  READONLY: 'readonly',
};

/**
 * Key code enumerable.
 *
 * @type {{TAB: string, ENTER: string, ESC: string, ARROW_LEFT: string, ARROW_UP: string, ARROW_RIGHT: string, ARROW_DOWN: string}}
 */
export const KeyCodes = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

/**
 * Methods enumerable.
 *
 * @type {{DELETE: string, GET: string, PATCH: string, POST: string,}}
 */
export const Methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  PATCH: 'PATCH',
  POST: 'POST',
};

/**
 * Key code enumerable.
 *
 * @type {{BUTTON: string, LABEL: string, TITLE: string}}
 */
export const CancelChangesModalTexts = {
  BUTTON: 'Poistu tallentamatta',
  LABEL: <span>Lomakkeella on tallentamattomia muutoksia.<br /> Haluatko varmasti poistua tallentamatta?</span>,
  TITLE: 'Poistu tallentamatta',
};

/**
 * Permission missing texts enumerable.
 *
 * @type {{}}
 */
export const PermissionMissingTexts = {
  AREA_NOTE: 'Ei oikeuksia muistettaviin ehtoihiin',
  CONTACT: 'Ei oikeuksia asiakkaisiin',
  GENERAL: 'Ei oikeuksia sisältöön.',
  INDEX: 'Ei oikeksia elinkustannusindekseihin',
  INFILL_DEVELOPMENT: 'Ei oikeksia täydennysrakennuskorvauksiin',
  LEASE: 'Ei oikeuksia vuokrauksiin.',
  LEASE_TENANTS_EDIT: 'Ei oikeuksia muokata vuokralaisia',
  RENT_BASIS: 'Ei oikeuksia vuokrausperusteisiin.',
};
