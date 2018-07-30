// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {getAttributes, getCollapseStateByKey, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/landUseContract/types';

type AreasProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderAreas = ({attributes, fields, isSaveClicked}: AreasProps): Element<*> => {
  return (
    <div>
      <FormFieldLabel>Kohteet</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={9}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'areas.child.children.area')}
              name={`${field}.area`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista kohde"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää kohde'
            onClick={() => fields.push('')}
            title='Lisää kohde'
          />
        </Column>
      </Row>
    </div>
  );
};

type LitigantsProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderLitigants = ({attributes, fields, isSaveClicked}: LitigantsProps): Element<*> => {
  return (
    <div>
      <FormFieldLabel>Osapuolet</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={9}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'litigants.child.children.litigant')}
              name={`${field}.litigant`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista osapuoli"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää osapuoli'
            onClick={() => fields.push('')}
            title='Lisää osapuoli'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  basicInformationCollapseState: boolean,
  isSaveClicked: boolean,
  planInformationCollapseState: boolean,
  receiveCollapseStates: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class BasicInformationEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.BASIC_INFORMATION]: this.props.valid,
      });
    }
  }

  handleBasicInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  }

  handlePlanInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.BASIC_INFORMATION]: {
          plan_information: val,
        },
      },
    });
  }

  render() {
    const {
      attributes,
      basicInformationCollapseState,
      isSaveClicked,
      planInformationCollapseState,
    } = this.props;

    return (
      <form>
        <h2>Perustiedot</h2>
        <Divider />
        <Collapse
          defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
          onToggle={this.handleBasicInformationCollapseToggle}
        >
          <Row>
            <Column small={6} medium={4} large={2}>
              <FieldArray
                attributes={attributes}
                component={renderAreas}
                isSaveClicked={isSaveClicked}
                name='areas'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FieldArray
                attributes={attributes}
                component={renderLitigants}
                isSaveClicked={isSaveClicked}
                name='litigants'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'preparer')}
                name='preparer'
                overrideValues={{
                  fieldType: 'user',
                  label: 'Valmistelija',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'land_use_contract_number')}
                name='land_use_contract_number'
                overrideValues={{
                  label: 'Maankäyttösopimus',
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'estimated_completion_year')}
                name='estimated_completion_year'
                overrideValues={{
                  label: 'Arvioitu toteutumisvuosi',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'estimated_introduction_year')}
                name='estimated_introduction_year'
                overrideValues={{
                  label: 'Arvioitu toteutumisvuosi',
                }}
              />
            </Column>
          </Row>
          <SubTitle>Liitetiedostot</SubTitle>
          <p>Ei liitetiedostoja</p>
        </Collapse>

        <Collapse
          defaultOpen={planInformationCollapseState !== undefined ? planInformationCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Asemakaavatiedot</h3>}
          onToggle={this.handlePlanInformationCollapseToggle}
        >
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'project_area')}
                name='project_area'
                overrideValues={{
                  label: 'Hankealue',
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_reference_number')}
                name='plan_reference_number'
                validate={referenceNumber}
                overrideValues={{
                  label: 'Asemakaavan diaarinumero',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_number')}
                name='plan_number'
                overrideValues={{
                  label: 'Asemakaavan numero',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'state')}
                name='state'
                overrideValues={{
                  label: 'Asemakaavan käsittelyvaihe',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_acceptor')}
                name='plan_acceptor'
                overrideValues={{
                  label: 'Asemakaavan hyväksyjä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_lawfulness_date')}
                name='plan_lawfulness_date'
                overrideValues={{
                  label: 'Asemakaavan lainvoimaisuuspvm',
                }}
              />
            </Column>
          </Row>
        </Collapse>
      </form>
    );
  }
}

const formName = FormNames.BASIC_INFORMATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic_information`),
        isSaveClicked: getIsSaveClicked(state),
        planInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.plan_information`),
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
  }),
)(BasicInformationEdit);
