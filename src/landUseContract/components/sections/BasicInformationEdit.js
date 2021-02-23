// @flow
import React, {Fragment, Component, type Element} from 'react';
import {connect} from 'react-redux';

import {change, FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import EstateIdSelectInput from '$components/inputs/EstateIdSelectInput';
import Authorization from '$components/authorization/Authorization';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/landUseContract/actions';
import {ConfirmationModalTexts, FieldTypes, FormNames, ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {getAttributes, getCollapseStateByKey, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';
import AddressItemEdit from './AddressItemEdit';
import type {Attributes} from '$src/types';
import {getUiDataLandUseContractKey} from '$src/uiData/helpers';
import {
  isFieldAllowedToRead,
} from '$util/helpers';

// **** TODO

type AddressesProps = {
  fields: any,
  formName: string,
  attributes: Object,
  isSaveClicked: boolean,
}

const renderAddresses = ({
  fields,
  formName,
  attributes,
  isSaveClicked,
}: AddressesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {fields && !!fields.length &&
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLandUseContractKey('addresses.child.children.address')}
                  >
                    {'Osoite'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLandUseContractKey('addresses.child.children.postal_code')}
                  >
                    {'Postinumero'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLandUseContractKey('addresses.child.children.city')}
                  >
                    {'Kaupunki'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLandUseContractKey('addresses.child.children.is_primary')}
                  >
                    {'Ensisijainen osoite'}
                  </FormTextTitle>
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((address, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Lisää osoite', 
                  confirmationModalLabel: 'Poista osoite',
                  confirmationModalTitle: 'Oletko varma että haluat poistaa osoitteen',
                });
              };

              return (
                <AddressItemEdit
                  key={index}
                  field={address}
                  index={index}
                  attributes={attributes}
                  isSaveClicked={isSaveClicked}
                  onRemove={handleRemove}
                  formName={formName}
                />
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  className='no-margin'
                  label='Lisää osoite'
                  onClick={handleAdd}
                />
              </Column>
            </Row> 
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type AreasProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  change: Function,
}

const renderAreas = ({attributes, fields, isSaveClicked, change}: AreasProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <FormTextTitle title='Kiinteistötunnus' />
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_LEASE_AREA.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_LEASE_AREA.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_LEASE_AREA.TITLE,
                });
              };

              return(
                <Row key={index}>
                  <Column>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <Authorization allow={isFieldAllowedToRead(attributes, 'estate_ids.child.children.estate_id')}>
                          <EstateIdSelectInput
                            onChange={estate_id => {
                              if(estate_id && estate_id.value){
                                change(`${field}.estate_id`, estate_id.value);
                                change(`${field}.plot`, estate_id.id);
                              }
                            }}
                            disabled={false}
                            name={`estate_id`}
                          />
                          <div style={{display: 'none'}}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'estate_ids.child.children.estate_id')}
                              invisibleLabel
                              name={`${field}.estate_id`}
                            />
                          </div>
                          <div style={{display: 'none'}}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'plots.child.children.id')}
                              invisibleLabel
                              name={`${field}.plot`}
                            />
                          </div>
                        </Authorization>
                      }
                      removeButton={
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title='Poista kohde'
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää kohde'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  basicInformationCollapseState: boolean,
  change: Function,
  isSaveClicked: boolean,
  receiveCollapseStates: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class BasicInformationEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  handleBasicInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          basic_information: val,
        },
      },
    });
  }

  render() {
    const {
      attributes,
      basicInformationCollapseState,
      isSaveClicked,
      change,
    } = this.props;

    return (
      <form>
        <h2>Perustiedot</h2>
        <Divider />
        <Collapse
          defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
          headerTitle='Perustiedot'
          onToggle={this.handleBasicInformationCollapseToggle}
        >
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, 'estate_ids')}>
              <Column small={6} medium={4} large={2}>
                <FieldArray
                  attributes={attributes}
                  component={renderAreas}
                  isSaveClicked={isSaveClicked}
                  name='estate_ids'
                  enableUiDataEdit
                  change={change}
                  uiDataKey={getUiDataLandUseContractKey('estate_ids')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'definition')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'definition')}
                  name='definition'
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('definition')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'preparer')}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Valmistelijat' />
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'preparer')}
                  invisibleLabel
                  name='preparer'
                  overrideValues={{
                    fieldType: FieldTypes.USER,
                    label: 'Valmistelija 1',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('preparer')}
                />
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'preparer')}
                  invisibleLabel
                  name='preparer2'
                  overrideValues={{
                    fieldType: FieldTypes.USER,
                    label: 'Valmistelija 2',
                  }}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'type')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'type')}
                  name='type'
                  overrideValues={{
                    label: 'Maankäyttösopimuksen tyyppi',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('type')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'status')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'status')}
                  name='status'
                  overrideValues={{
                    label: 'Maankäyttösopimuksen tila',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('status')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'estimated_completion_year')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'estimated_completion_year')}
                  name='estimated_completion_year'
                  overrideValues={{
                    label: 'Arvioitu toteutumisvuosi',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('estimated_completion_year')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'estimated_introduction_year')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'estimated_introduction_year')}
                  name='estimated_introduction_year'
                  overrideValues={{
                    label: 'Arvioitu esittelyvuosi',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('estimated_introduction_year')}
                />
              </Column>
            </Authorization>
          </Row>

          <SubTitle>Osoitteet</SubTitle>
          <FieldArray
            component={renderAddresses}
            attributes={attributes}
            isSaveClicked={isSaveClicked}
            disabled={isSaveClicked}
            formName={FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION}
            name={'addresses'}
          />
          <SubTitle>Liitetiedostot</SubTitle>
          <FormText>Ei liitetiedostoja</FormText>

          <SubTitle>Asemakaavatiedot</SubTitle>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_reference_number')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_reference_number')}
                  name='plan_reference_number'
                  validate={referenceNumber}
                  overrideValues={{
                    label: 'Asemakaavan diaarinumero',
                    fieldType: FieldTypes.REFERENCE_NUMBER,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('plan_reference_number')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_number')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_number')}
                  name='plan_number'
                  overrideValues={{
                    label: 'Asemakaavan numero',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('plan_number')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'state')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'state')}
                  name='state'
                  overrideValues={{
                    label: 'Asemakaavan käsittelyvaihe',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('state')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_acceptor')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_acceptor')}
                  name='plan_acceptor'
                  overrideValues={{
                    label: 'Asemakaavan hyväksyjä',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('plan_acceptor')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_lawfulness_date')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_lawfulness_date')}
                  name='plan_lawfulness_date'
                  overrideValues={{
                    label: 'Asemakaavan lainvoimaisuuspvm',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('plan_lawfulness_date')}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'project_area')}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'project_area')}
                  name='project_area'
                  overrideValues={{
                    label: 'Hankealue',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLandUseContractKey('project_area')}
                />
              </Column>
            </Authorization>
          </Row>
        </Collapse>
      </form>
    );
  }
}

const formName = FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic_information`),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveCollapseStates,
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change,
  }),
)(BasicInformationEdit);
