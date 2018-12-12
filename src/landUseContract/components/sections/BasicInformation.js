// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
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
  receiveCollapseStates: Function,
}

const BasicInformation = ({
  attributes,
  basicInformationCollapseState,
  currentLandUseContract,
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

  const basicInformation = getContentBasicInformation(currentLandUseContract),
    stateOptions = getAttributeFieldOptions(attributes, 'state'),
    planAcceptorOptions = getAttributeFieldOptions(attributes, 'plan_acceptor'),
    landUseContractTypeOptions = getAttributeFieldOptions(attributes, 'land_use_contract_type');

  return (
    <div>
      <h2>Perustiedot</h2>
      <Divider />
      <Collapse
        defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
        headerTitle={<CollapseHeaderTitle>Perustiedot</CollapseHeaderTitle>}
        onToggle={handleBasicInformationCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle title='Kohteen tunnus' />
            {!!basicInformation.areas && !!basicInformation.areas.length
              ? <ListItems>
                {basicInformation.areas.map((area, index) =>
                  <ListItem key={index}>{area.area || '-'}</ListItem>
                )}
              </ListItems>
              : <FormText>-</FormText>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Hankealue'
              text={basicInformation.project_area || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle title='Valmistelijat' />
            <ListItems>
              <ListItem>{getUserFullName(basicInformation.preparer) || '-'}</ListItem>
              <ListItem>{getUserFullName(basicInformation.preparer2) || '-'}</ListItem>
            </ListItems>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Maankäyttösopimus'
              text={getLabelOfOption(landUseContractTypeOptions, basicInformation.land_use_contract_type) || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Arvioitu toteutumisvuosi'
              text={basicInformation.estimated_completion_year || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Arvioitu esittelyvuosi'
              text={basicInformation.estimated_introduction_year || '-'}
            />
          </Column>
        </Row>

        <SubTitle>Liitetiedostot</SubTitle>
        <FormText>Ei liitetiedostoja</FormText>

        <SubTitle>Asemakaavatiedot</SubTitle>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan diaarinumero'
              text={basicInformation.plan_reference_number
                ? <ExternalLink
                  href={getReferenceNumberLink(basicInformation.plan_reference_number)}
                  text={basicInformation.plan_reference_number}
                />
                : '-'
              }
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan numero'
              text={basicInformation.plan_number || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan käsittelyvaihe'
              text={getLabelOfOption(stateOptions, basicInformation.state) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan hyväksyjä'
              text={getLabelOfOption(planAcceptorOptions, basicInformation.plan_acceptor) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan lainvoimaisuuspvm'
              text={formatDate(basicInformation.plan_lawfulness_date) || '-'}
            />
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
    };
  },
  {
    receiveCollapseStates,
  }
)(BasicInformation);
