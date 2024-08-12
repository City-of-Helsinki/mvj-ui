import { TableSortOrder } from "@/enums";
import { PlotSearchStageTypes } from "@/plotSearch/enums";
import type { ProtectedFormPathsSections } from "@/plotSearch/types";

/**
 * Default plotSearch states value for plotSearch list search
 * @const {string[]}
 */
export const DEFAULT_PLOT_SEARCH_STATES: Array<string> = [];

/**
 * Default sort key for lease list table
 * @const {string}
 */
export const DEFAULT_SORT_KEY = 'identifier';

/**
 * Default sort order for lease list table
 * @const {string}
 */
export const DEFAULT_SORT_ORDER = TableSortOrder.ASCENDING;

/**
 * PlotSearch state options for plotSearch list table filter
 * @const {[*]}
 */
export const plotSearchStateFilterOptions = [{
  value: 'filter_one',
  label: 'Suodatusehto 1'
}];
export const AUTOMATIC_PLOT_SEARCH_STAGES = [PlotSearchStageTypes.IN_PREPARATION, PlotSearchStageTypes.IN_ACTION];
export const FIELDS_LOCKED_FOR_EDITING = ['plot_search_targets', 'type', 'subtype', 'search_class', 'begin_at', 'end_at', 'created_at', 'modified_at', 'form'];
export const FieldTypeFeatures = {
  FREEFORM_DEFAULT_VALUE: 'free-form-default-value',
  LIST_SELECTION_DEFAULT_VALUE: 'list-selection-default-value',
  MULTIPLE_SELECTION_OPTIONS: 'multiple-selection-options',
  SINGLE_SELECTION_OPTIONS: 'single-selection-options',
  TEXT_AREA_INPUT: 'text-area-input',
  UNCHANGEABLE_VALUE: 'unchangeable-value'
};
export const FieldTypeLabels = {
  textbox: 'Tekstikenttä',
  textarea: 'Tekstialue',
  dropdown: 'Pudotusvalikko',
  checkbox: 'Valintaruutu',
  radiobutton: 'Radiopainike',
  radiobuttoninline: 'Radiopainike linjassa',
  uploadfiles: 'Tiedoston lataus',
  fractional: 'Murtoluku',
  hidden: 'Piilotettu'
};
export const FIELD_TYPE_FEATURES_BY_FIELD_TYPE_NAME: Record<string, Array<string>> = {
  textbox: [FieldTypeFeatures.FREEFORM_DEFAULT_VALUE],
  textarea: [FieldTypeFeatures.FREEFORM_DEFAULT_VALUE, FieldTypeFeatures.TEXT_AREA_INPUT],
  dropdown: [FieldTypeFeatures.LIST_SELECTION_DEFAULT_VALUE, FieldTypeFeatures.SINGLE_SELECTION_OPTIONS],
  checkbox: [FieldTypeFeatures.LIST_SELECTION_DEFAULT_VALUE, FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS],
  radiobutton: [FieldTypeFeatures.LIST_SELECTION_DEFAULT_VALUE, FieldTypeFeatures.SINGLE_SELECTION_OPTIONS],
  radiobuttoninline: [FieldTypeFeatures.LIST_SELECTION_DEFAULT_VALUE, FieldTypeFeatures.SINGLE_SELECTION_OPTIONS],
  uploadfiles: [],
  fractional: [FieldTypeFeatures.FREEFORM_DEFAULT_VALUE],
  hidden: [FieldTypeFeatures.FREEFORM_DEFAULT_VALUE, FieldTypeFeatures.UNCHANGEABLE_VALUE]
};
export const PROTECTED_FORM_PATHS: ProtectedFormPathsSections = {
  'hakijan-tiedot': {
    subsections: {
      'henkilon-tiedot': {
        subsections: {},
        fields: ['etunimi', 'Sukunimi', 'henkilotunnus', 'sahkoposti']
      },
      'yrityksen-tiedot': {
        subsections: {},
        fields: ['yrityksen-nimi', 'y-tunnus', 'sahkoposti']
      }
    },
    fields: ['hakija'],
    fieldChoices: {
      hakija: ['1', '2']
    }
  },
  'kohteen-tiedot': {
    subsections: {},
    fields: []
  }
};