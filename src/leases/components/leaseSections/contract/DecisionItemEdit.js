// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import DecisionConditionsEdit from './DecisionConditionsEdit';
import FormField from '$components/form/FormField';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, LeaseDecisionConditionsFieldPaths, LeaseDecisionsFieldPaths, LeaseDecisionsFieldTitles} from '$src/leases/enums';
import {getDecisionById} from '$src/decision/helpers';
import {
  formatDate,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionId: number,
  errors: ?Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  savedDecisions: Array<Object>,
}

const DecisionItemEdit = ({
  attributes,
  conditionsCollapseState,
  decisionCollapseState,
  decisionId,
  errors,
  field,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  savedDecisions,
}: Props) => {
  const handleDecisionCollapseToggle = (val: boolean) => {
    if(!decisionId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.DECISIONS]: {
          [decisionId]: {
            decision: val,
          },
        },
      },
    });
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    if(!decisionId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.DECISIONS]: {
          [decisionId]: {
            conditions: val,
          },
        },
      },
    });
  };

  const decisionMakerOptions = getFieldOptions(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER);
  const typeOptions = getFieldOptions(attributes, LeaseDecisionsFieldPaths.TYPE);
  const decisionErrors = get(errors, field),
    savedDecision = getDecisionById(savedDecisions, decisionId);

  return (
    <Collapse
      defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(decisionErrors)}
      headerTitle={savedDecision
        ? <Fragment>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}>
            {getLabelOfOption(decisionMakerOptions, get(savedDecision, 'decision_maker')) || '-'}
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}>
            {savedDecision.decision_date ? <span>&nbsp;&nbsp;{formatDate(savedDecision.decision_date)}</span> : ''}
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.SECTION)}>
            {savedDecision.section ? <span>&nbsp;&nbsp;{savedDecision.section}§</span> : ''}
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.TYPE)}>
            {savedDecision.type ? <span>&nbsp;&nbsp;{getLabelOfOption(typeOptions, savedDecision.type)}</span> : ''}
          </Authorization>
        </Fragment>
        : '-'
      }
      onRemove={onRemove}
      onToggle={handleDecisionCollapseToggle}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}
                name={`${field}.decision_maker`}
                overrideValues={{label: LeaseDecisionsFieldTitles.DECISION_MAKER}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}
                name={`${field}.decision_date`}
                overrideValues={{label: LeaseDecisionsFieldTitles.DECISION_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={1}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.SECTION)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.SECTION)}
                name={`${field}.section`}
                unit='§'
                overrideValues={{label: LeaseDecisionsFieldTitles.SECTION}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={8} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.TYPE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.TYPE)}
                name={`${field}.type`}
                overrideValues={{label: LeaseDecisionsFieldTitles.TYPE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.REFERENCE_NUMBER)}
                name={`${field}.reference_number`}
                validate={referenceNumber}
                overrideValues={{label: LeaseDecisionsFieldTitles.REFERENCE_NUMBER}}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DESCRIPTION)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.DESCRIPTION)}
                name={`${field}.description`}
                overrideValues={{label: LeaseDecisionsFieldTitles.DESCRIPTION}}
              />
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.CONDITIONS)}>
        <FieldArray
          collapseState={conditionsCollapseState}
          component={DecisionConditionsEdit}
          errors={errors}
          isSaveClicked={isSaveClicked}
          name={`${field}.conditions`}
          onCollapseToggle={handleConditionsCollapseToggle}
        />
      </Authorization>
    </Collapse>
  );
};

const formName = FormNames.DECISIONS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    const newProps: any = {
      attributes: getAttributes(state),
      decisionId: id,
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
    };

    if(id) {
      newProps.conditionsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.conditions`);
      newProps.decisionCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.decision`);
    }

    return newProps;
  },
  {
    receiveCollapseStates,
  }
)(DecisionItemEdit);
