// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {getContentBasicInformation} from '$src/landUseContract/helpers';
import {getUserFullName} from '$src/users/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  basicInformationCollapseState: boolean,
  currentLandUseContract: LandUseContract,
  planInformationCollapseState: boolean,
  receiveCollapseStates: Function,
}

const BasicInformation = ({
  attributes,
  basicInformationCollapseState,
  currentLandUseContract,
  planInformationCollapseState,
  receiveCollapseStates,
}: Props) => {
  const handleBasicInformationCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  };

  const handlePlanInformationCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.BASIC_INFORMATION]: {
          plan_information: val,
        },
      },
    });
  };

  const basicInformation = getContentBasicInformation(currentLandUseContract);
  const stateOptions = getAttributeFieldOptions(attributes, 'state');
  const planAcceptorOptions = getAttributeFieldOptions(attributes, 'plan_acceptor');

  return (
    <div>
      <h2>Perustiedot</h2>
      <Divider />
      <Collapse
        defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
        headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
        onToggle={handleBasicInformationCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Kohteet</FormFieldLabel>
            {!!basicInformation.areas && !!basicInformation.areas.length
              ? <ListItems>
                {basicInformation.areas.map((area, index) => <p key={index} className='no-margin'>{area.area || '-'}</p>)}
              </ListItems>
              : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Osapuolet</FormFieldLabel>
            {!!basicInformation.litigants && !!basicInformation.litigants.length
              ? <ListItems>
                {basicInformation.litigants.map((litigant, index) => <p key={index} className='no-margin'>{litigant.litigant || '-'}</p>)}
              </ListItems>
              : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Valmistelija</FormFieldLabel>
            <p>{getUserFullName(basicInformation.preparer) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maankäyttösopimus</FormFieldLabel>
            <p>{basicInformation.land_use_contract_number || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvioitu toteutumisvuosi</FormFieldLabel>
            <p>{basicInformation.estimated_completion_year || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvioitu esittelyvuosi</FormFieldLabel>
            <p>{basicInformation.estimated_introduction_year || '-'}</p>
          </Column>
        </Row>
        <SubTitle>Liitetiedostot</SubTitle>
        <p>Ei liitetiedostoja</p>
      </Collapse>

      <Collapse
        defaultOpen={planInformationCollapseState !== undefined ? planInformationCollapseState : true}
        headerTitle={<h3 className='collapse__header-title'>Asemakaavatiedot</h3>}
        onToggle={handlePlanInformationCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Hankealue</FormFieldLabel>
            <p>{basicInformation.project_area || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Asemakaavan diaarinumero</FormFieldLabel>
            {basicInformation.plan_reference_number
              ? <a target='_blank' href={getReferenceNumberLink(basicInformation.plan_reference_number)}>{basicInformation.plan_reference_number}</a>
              : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Asemakaavan numero</FormFieldLabel>
            <p>{basicInformation.plan_number || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Asemakaavan käsittelyvaihe</FormFieldLabel>
            <p>{getLabelOfOption(stateOptions, basicInformation.state) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Asemakaavan hyväksyjä</FormFieldLabel>
            <p>{getLabelOfOption(planAcceptorOptions, basicInformation.plan_acceptor) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Asemakaavan lainvoimaisuuspvm</FormFieldLabel>
            <p>{formatDate(basicInformation.plan_lawfulness_date) || '-'}</p>
          </Column>
        </Row>
      </Collapse>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.BASIC_INFORMATION}.basic_information`),
      currentLandUseContract: getCurrentLandUseContract(state),
      planInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.BASIC_INFORMATION}.plan_information`),
    };
  },
  {
    receiveCollapseStates,
  }
)(BasicInformation);
