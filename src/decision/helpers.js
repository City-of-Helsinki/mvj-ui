// @flow
import {addEmptyOption, formatDate} from '$util/helpers';
/**
 * Get options for decisions field
 * @param decisions
 */
export const getDecisionOptions = (decisions: Array<Object>) => {
  if(!decisions || !decisions.length) {return [];}

  return addEmptyOption(decisions.map((item) => {
    return {
      value: item.id,
      label: (!item.reference_number && !item.decision_date && !item.section)
        ? item.id
        : `${item.reference_number ? item.reference_number + ', ' : ''}${item.section ? item.section + ' §, ' : ''}${formatDate(item.decision_date) || ''}`,
    };
  }));
};

/**
 * Get decision by id
 * @param decisions
 * @param decisionId
 */
export const getDecisionById = (decisions: Array<Object>, decisionId: number) =>
  (decisions && decisions.length && decisionId)
    ? decisions.find((decision) => decision.id === decisionId)
    : {};
