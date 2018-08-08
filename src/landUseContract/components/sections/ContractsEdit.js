// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import ContractItemEdit from './ContractItemEdit';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getContentContracts} from '$src/landUseContract/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLandUseContract, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type ContractsProps = {
  attributes: Attributes,
  contractsData: Array<Object>,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
}

const renderContracts = ({attributes, contractsData, errors, fields, isSaveClicked}: ContractsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const handleRemove = (index: number) => {
    fields.remove(index);
  };

  const stateOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.state');

  return (
    <div>
      {fields && !!fields.length && fields.map((contract, index) => {
        return (
          <ContractItemEdit
            key={index}
            attributes={attributes}
            contractsData={contractsData}
            errors={errors}
            field={contract}
            index={index}
            isSaveClicked={isSaveClicked}
            onRemove={handleRemove}
            stateOptions={stateOptions}
          />

        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää sopimus'
            onClick={handleAdd}
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
    const {attributes, errors, isSaveClicked} = this.props,
      {contractsData} = this.state;

    return (

      <form>
        <FieldArray
          attributes={attributes}
          contractsData={contractsData}
          component={renderContracts}
          errors={errors}
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