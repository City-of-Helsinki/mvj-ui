// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {FormNames, ViewModes} from '$src/enums';
import {getAttributes, getCollapseStateByKey, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';
import type {LandUseContract} from '$src/landUseContract/types';
import {getContentConditions} from '$src/landUseContract/helpers';
import {
  getFieldOptions,
  getLabelOfOption,
  formatDate,
} from '$util/helpers';

type Props = {
  attributes: Attributes,
  ConditionsCollapseState: boolean,
  currentLandUseContract: LandUseContract,
  receiveCollapseStates: Function,
}

const Conditions = ({
  ConditionsCollapseState,
  receiveCollapseStates,
  currentLandUseContract,
  attributes,
}: Props) => {
  const handleBasicInformationCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_CONDITIONS]: {
          conditions: val,
        },
      },
    });
  };

  const conditions = getContentConditions(currentLandUseContract);
  const formOfManagementOptions = getFieldOptions(attributes, 'conditions.child.children.form_of_management');
  return (
    <Fragment>
      <h2>VALVOTTAVAT EHDOT</h2>
      <Divider />
      <Collapse
        defaultOpen={ConditionsCollapseState !== undefined ? ConditionsCollapseState : true}
        headerTitle='Valvottavat ehdot'
        onToggle={handleBasicInformationCollapseToggle}
      >
        {conditions && conditions.map((condition, index) => 
          <Row key={index}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Hallintamuoto'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(formOfManagementOptions, condition.form_of_management) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Velvoite k-m2'}
              </FormTextTitle>
              <FormText>{condition.obligated_area || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Toteutunut k-m2'}
              </FormTextTitle>
              <FormText>{condition.actualized_area || '-'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Subventio'}
              </FormTextTitle>
              <FormText>{condition.subvention_amount || '-'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Korvaus %'}
              </FormTextTitle>
              <FormText>{condition.compensation_pc || '-'}</FormText>
            </Column>
            <Column small={3} medium={2} large={2}>
              <FormTextTitle>
                {'Valvottupäivämäärä'}
              </FormTextTitle>
              <FormText>{formatDate(condition.supervised_date) || '-'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Valvontapäivämäärä'}
              </FormTextTitle>
              <FormText>{formatDate(condition.supervision_date) || '-'}</FormText>
            </Column>
          </Row>
        )}
      </Collapse>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      ConditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_CONDITIONS}.conditions`),
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Conditions);
