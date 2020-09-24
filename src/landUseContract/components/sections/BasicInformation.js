// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {FormNames, ViewModes} from '$src/enums';
import {getContentBasicInformation} from '$src/landUseContract/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';
import type {LandUseContract} from '$src/landUseContract/types';

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
        [FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  };

  const basicInformation = getContentBasicInformation(currentLandUseContract),
    stateOptions = getFieldOptions(attributes, 'state'),
    planAcceptorOptions = getFieldOptions(attributes, 'plan_acceptor'),
    landUseContractTypeOptions = getFieldOptions(attributes, 'type'),
    landUseContractDefinitionOptions = getFieldOptions(attributes, 'definition'),
    landUseContractStatusOptions = getFieldOptions(attributes, 'status');

  return (
    <Fragment>
      <h2>Perustiedot</h2>
      <Divider />
      <Collapse
        defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
        headerTitle='Perustiedot'
        onToggle={handleBasicInformationCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle title='Kiinteistötunnus' />
            {!!basicInformation.estate_ids && !!basicInformation.estate_ids.length
              ? <ListItems>
                {basicInformation.estate_ids.map((estate_id, index) =>
                  <ListItem key={index}>{estate_id.estate_id || '-'}</ListItem>
                )}
              </ListItems>
              : <FormText>-</FormText>
            }
          </Column>
          {basicInformation && console.log(basicInformation.definition)}
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Maankäyttösopimus päätös'
              text={getLabelOfOption(landUseContractDefinitionOptions, basicInformation.definition) || '-'}
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
              title='Maankäyttösopimuksen tyyppi'
              text={getLabelOfOption(landUseContractTypeOptions, basicInformation.type) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Maankäyttösopimuksen tila'
              text={getLabelOfOption(landUseContractStatusOptions, basicInformation.status) || '-'}
            />
          </Column>
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

        <SubTitle>Osoitteet</SubTitle>
        {basicInformation.addresses && basicInformation.addresses.map((address, index) => 
          <Row key={index}>
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Osoite'
                text={address.address || '-'}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Postinumero'
                text={address.postal_code || '-'}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Kaupunki'
                text={address.city || '-'}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle >
                {'Ensisijainen osoite'}
              </FormTextTitle>
              <FormText>{address.isPrimary?'Kyllä':'ei'}</FormText>
            </Column>
          </Row>
        )}

        <SubTitle>Liitetiedostot</SubTitle>
        <FormText>Ei liitetiedostoja</FormText>

        <SubTitle>Asemakaavatiedot</SubTitle>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan diaarinumero'
              text={basicInformation.plan_reference_number
                ? <ExternalLink
                  className='no-margin'
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
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Hankealue'
              text={basicInformation.project_area || '-'}
            />
          </Column>
        </Row>
      </Collapse>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION}.basic_information`),
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(BasicInformation);
