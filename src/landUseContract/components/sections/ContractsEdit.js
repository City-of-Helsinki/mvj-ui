// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
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
import {getAttributes, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type ContractsProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
}

const renderContracts = ({attributes, errors, fields, isSaveClicked}: ContractsProps): Element<*> =>
  <div>
    {fields && !!fields.length && fields.map((decision, index) => {
      const contractErrors = get(errors, decision);

      return (
        <Collapse
          key={decision.id ? decision.id : `index_${index}`}
          defaultOpen={true}
          hasErrors={isSaveClicked && !isEmpty(contractErrors)}
          headerTitle={
            <h3 className='collapse__header-title'>Päätös {index + 1}</h3>
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
                  name={`${decision}.state`}
                  overrideValues={{
                    label: 'Sopimuksen vaihe',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'contracts.child.children.decision_date')}
                  name={`${decision}.decision_date`}
                  overrideValues={{
                    label: 'Päätöspvm',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'contracts.child.children.sign_date')}
                  name={`${decision}.sign_date`}
                  overrideValues={{
                    label: 'Allekirjoituspvm',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'contracts.child.children.ed_contract_number')}
                  name={`${decision}.ed_contract_number`}
                  overrideValues={{
                    label: 'ED sopimusnumero',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'contracts.child.children.reference_number')}
                  name={`${decision}.reference_number`}
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
                  name={`${decision}.area_arrengements`}
                  overrideValues={{
                    label: 'Aluejärjestelyt',
                  }}
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </Collapse>
      );
    }

    )}
    <Row>
      <Column>
        <AddButton
          label='Lisää sopimus'
          onClick={() => fields.push({})}
          title='Lisää sopimus'
        />
      </Column>
    </Row>
  </div>;

type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
  errors: ?Object,
  receiveFormValidFlags: Function,
  isSaveClicked: boolean,
  valid: boolean,
}

class ContractsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes, errors, isSaveClicked} = this.props;

    return (

      <form>
        <FieldArray
          attributes={attributes}
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
