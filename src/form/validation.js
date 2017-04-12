/**
 * Checks for empty fields & custom rules
 * @param fields
 * @param customConditions
 * @param requiredTexts
 * @returns {{}}
 */
export const BaseValidator = (fields, customConditions, requiredTexts = {}) => {
  let errors = {};

  for (const fieldName in fields) {
    const field = fields[fieldName];
    const isEmptyArray = field instanceof Array && field.length === 0;
    if ((isEmptyArray || field === '' || field === undefined)) {
      errors[fieldName] = requiredTexts[fieldName] || 'required';
    }
    else if (customConditions) {
      if (Array.isArray(customConditions[fieldName])) {
        for (const customCondition in customConditions[fieldName]) {
          if (customConditions[fieldName][customCondition] && customConditions[fieldName][customCondition].condition) {
            errors[fieldName] = customConditions[fieldName][customCondition].errorText;
          }
        }
      }
      else if (customConditions[fieldName] && customConditions[fieldName].condition) {
        errors[fieldName] = customConditions[fieldName].errorText;
      }
    }
  }

  return errors;
};
