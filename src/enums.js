// @flow
import React from 'react';

/**
 * Redux form field type enumerable.
 *
 * @type {{DATE: string, DECIMAL: string, INTEGER: string,}}
 */
export const FieldTypes = {
  DATE: 'date',
  DECIMAL: 'decimal',
  INTEGER: 'integer',
};

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
  CONTACT: 'Ei oikeuksia asiakkaisiin',
  GENERAL: 'Ei oikeuksia sisältöön.',
  INFILL_DEVELOPMENT: 'Ei oikeksia täydennysrakennuskorvauksiin',
  LEASE: 'Ei oikeuksia vuokrauksiin.',
  RENT_BASIS: 'Ei oikeuksia vuokrausperusteisiin.',
};
