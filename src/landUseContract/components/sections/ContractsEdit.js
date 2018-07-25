// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getContentContracts} from '$src/landUseContract/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLandUseContract, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type ContractsProps = {
  attributes: Attributes,
  contractsData: Array<Object>,
  errors: ?Object,
  fields: any,
  formValues: Object,
  isSaveClicked: boolean,
}

const renderContracts = ({attributes, contractsData, errors, fields, formValues, isSaveClicked}: ContractsProps): Element<*> => {
  const getContractById = (id: number) => {
    if(!id) {
      return {};
    }
    return contractsData.find((decision) => decision.id === id);
  };

  const stateOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.state');

  const getContractTitle = (contract: ?Object) => {
    if(!contract) {
      return null;
    }
    return `${getLabelOfOption(stateOptions, contract.state) || '-'}`;
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((contract, index) => {
        const contractErrors = get(errors, contract),
          savedContract = getContractById(get(formValues, `${contract}.id`));

        return (
          <Collapse
            key={contract.id ? contract.id : `index_${index}`}
            defaultOpen={true}
            hasErrors={isSaveClicked && !isEmpty(contractErrors)}
            headerTitle={
              <h3 className='collapse__header-title'>{getContractTitle(savedContract)}</h3>
            }
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                onClick={() => fields.remove(index)}
                title="Poista sopimus"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'contracts.child.children.state')}
                    name={`${contract}.state`}
                    overrideValues={{
                      label: 'Sopimuksen vaihe',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'contracts.child.children.decision_date')}
                    name={`${contract}.decision_date`}
                    overrideValues={{
                      label: 'Päätöspvm',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'contracts.child.children.sign_date')}
                    name={`${contract}.sign_date`}
                    overrideValues={{
                      label: 'Allekirjoituspvm',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'contracts.child.children.ed_contract_number')}
                    name={`${contract}.ed_contract_number`}
                    overrideValues={{
                      label: 'ED sopimusnumero',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'contracts.child.children.reference_number')}
                    name={`${contract}.reference_number`}
                    validate={referenceNumber}
                    overrideValues={{
                      label: 'Diaarinumero',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'contracts.child.children.area_arrengements')}
                    name={`${contract}.area_arrengements`}
                    overrideValues={{
                      label: 'Aluejärjestelyt',
                    }}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </Collapse>
        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää sopimus'
            onClick={() => fields.push({})}
            title='Lisää sopimus'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
  errors: ?Object,
  formValues: Object,
  receiveFormValidFlags: Function,
  isSaveClicked: boolean,
  valid: boolean,
}

type State = {
  contractsData: Array<Object>,
  currentLandUseContract: ?LandUseContract,
}

class ContractsEdit extends Component<Props, State> {
  state = {
    contractsData: [],
    currentLandUseContract: null,
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLandUseContract !== state.currentLandUseContract) {
      return {
        contractsData: getContentContracts(props.currentLandUseContract),
        currentLandUseContract: props.currentLandUseContract,
      };
    }
    return null;
  }

  render() {
    const {attributes, errors, formValues, isSaveClicked} = this.props,
      {contractsData} = this.state;

    return (

      <form>
        <FieldArray
          attributes={attributes}
          contractsData={contractsData}
          component={renderContracts}
          errors={errors}
          formValues={formValues}
          isSaveClicked={isSaveClicked}
          name="contracts"
        />
      </form>
    );
  }
}

const formName = FormNames.CONTRACTS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLandUseContract: getCurrentLandUseContract(state),
        errors: getErrorsByFormName(state, formName),
        formValues: getFormValues(formName)(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  })
)(ContractsEdit);
