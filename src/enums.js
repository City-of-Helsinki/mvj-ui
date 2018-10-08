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
 * Key code enumerable.
 *
 * @type {{BUTTON: string, LABEL: string, TITLE: string}}
 */
export const CancelChangesModalTexts = {
  BUTTON: 'Hylkää muutokset',
  LABEL: <span>Lomakkeella on tallentamattomia muutoksia.<br /> Haluatko varmasti hylätä muutokset?</span>,
  TITLE: 'Hylkää muutokset',
};
