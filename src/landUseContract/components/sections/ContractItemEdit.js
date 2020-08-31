//@flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {ButtonColors} from '$components/enums';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames, ViewModes} from '$src/enums';
import {getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {getFieldAttributes} from '$util/helpers';

import type {Attributes} from '$src/types';

type WarrantsProps = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
}

const renderWarrants = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
}: WarrantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const warrantsErrors = get(errors, name);

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(warrantsErrors)}
            headerTitle='Vakuudet'
            onToggle={onCollapseToggle}
          >
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((warrants, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: 'Haluatko poistaa vakuuden',
                    confirmationModalTitle: 'Poista ehto',
                  });
                };
                return(
                  <BoxItem key={index}>
                    <ActionButtonWrapper>
                      <RemoveButton
                        onClick={handleRemove}
                        title="Poista vakuus"
                      />
                    </ActionButtonWrapper>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.warrant_type')}
                          name={`${warrants}.warrant_type`}
                          overrideValues={{
                            label: 'Vakuuden tyyppi',
                          }}
                        />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.type')}
                          name={`${warrants}.type`}
                          overrideValues={{
                            label: 'Vakuuden laji',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.rent_warrant_number')}
                          name={`${warrants}.rent_warrant_number`}
                          overrideValues={{
                            label: 'Vuokravakuusnro',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.start_date')}
                          name={`${warrants}.start_date`}
                          overrideValues={{
                            label: 'Vakuuden alkupvm',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.end_date')}
                          name={`${warrants}.end_date`}
                          overrideValues={{
                            label: 'Vakuuden loppupvm',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.amount')}
                          name={`${warrants}.amount`}
                          unit='€'
                          overrideValues={{
                            label: 'Vakuuden määrä',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.return_date')}
                          name={`${warrants}.return_date`}
                          overrideValues={{
                            label: 'Palautus pvm',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={8} large={10}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.warrants.child.children.note')}
                          name={`${warrants}.note`}
                          overrideValues={{
                            label: 'Huomautus',
                          }}
                        />
                      </Column>
                    </Row>
                  </BoxItem>
                );
              }
              )}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary
                  className={!fields.length ? 'no-top-margin' : '-'}
                  label='Lisää vakuus'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  warrantsCollapseState: boolean,
  contract: Object,
  contractsData: Array<Object>,
  contractId: number,
  errors: ?Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  contractTypeOptions: Array<Object>,
}

const ContractItemEdit = ({
  attributes,
  collapseState,
  warrantsCollapseState,
  contractsData,
  contractId,
  errors,
  field,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  contractTypeOptions,
}: Props) => {
  const handleCollapseChange = (val: boolean) => {
    if(!contractId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [contractId]: val,
        },
      },
    });
  };

  const handleWarrantsCollapseToggle = (val: boolean) => {
    if(!contractId){return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [contractId]: {
            warrants: val,
          },
        },
      },
    });
  };

  const getContractById = (id: number) => {
    if(!id) {return {};}
    return contractsData.find((decision) => decision.id === id);
  };

  const getCollapseTitle = (contract: ?Object) => {
    if(!contract) {return '-';}
    return `${getLabelOfOption(contractTypeOptions, contract.contract_type) || '-'} ${contract.ed_contract_number}`;
  };

  const contractErrors = get(errors, field),
    savedContract = getContractById(contractId);

  return(
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      hasErrors={isSaveClicked && !isEmpty(contractErrors)}
      headerTitle={getCollapseTitle(savedContract)}
      onRemove={onRemove}
      onToggle={handleCollapseChange}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.contract_type')}
              name={`${field}.contract_type`}
              overrideValues={{
                label: 'Sopimuksen tyyppi',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.state')}
              name={`${field}.state`}
              overrideValues={{
                label: 'Sopimuksen vaihe',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.sign_date')}
              name={`${field}.sign_date`}
              overrideValues={{
                label: 'Allekirjoituspvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.ed_contract_number')}
              name={`${field}.ed_contract_number`}
              overrideValues={{
                label: 'ED sopimusnumero',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.area_arrengements')}
              name={`${field}.area_arrengements`}
              overrideValues={{
                label: 'Aluejärjestelyt',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.decision')}
              name={`${field}.decision`}
              overrideValues={{
                label: 'Päätös',
              }}
            />
          </Column>
        </Row>
        <FieldArray
          attributes={attributes}
          collapseState={warrantsCollapseState}
          component={renderWarrants}
          errors={errors}
          isSaveClicked={isSaveClicked}
          name={`${field}.warrants`}
          onCollapseToggle={handleWarrantsCollapseToggle}
        />
      </BoxContentWrapper>
    </Collapse>
  );
};

const formName = FormNames.LAND_USE_CONTRACT_CONTRACTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    return {
      warrantsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.warrants`),
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}`),
      contractId: id,
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItemEdit);
