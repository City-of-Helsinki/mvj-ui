// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';
import {Field, reduxForm} from 'redux-form';

import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import {getAttributeFieldOptions} from '$src/util/helpers';

type Props = {
  attributes: Object,
  handleSubmit: Function,
  lessorOptions: Array<Object>,
}

class SummaryEdit extends Component {
  props: Props

  render () {
    const {attributes, handleSubmit, lessorOptions} = this.props;
    const classificationOptions = getAttributeFieldOptions(attributes, 'classification');
    const intendedUseOptions = getAttributeFieldOptions(attributes, 'intended_use');
    const supportiveHousingOptions = getAttributeFieldOptions(attributes, 'supportive_housing');
    const statisticalUseOptions = getAttributeFieldOptions(attributes, 'statistical_use');
    const financingOptions = getAttributeFieldOptions(attributes, 'financing');
    const managementOptions = getAttributeFieldOptions(attributes, 'management');
    const regulationOptions = getAttributeFieldOptions(attributes, 'regulation');
    const hitasOptions = getAttributeFieldOptions(attributes, 'hitas');
    const noticePeriodOptions = getAttributeFieldOptions(attributes, 'notice_period');

    return (
      <form onSubmit={handleSubmit}>
        <GreenBoxEdit>
          <Row>
            <Column medium={8}>
              <Field
                component={FieldTypeSelect}
                label="Vuokranantaja"
                name="lessor"
                options={lessorOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Julkisuusluokka"
                name="classification"
                options={classificationOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Vuokrauksen käyttötarkoitus"
                name="intended_use"
                options={intendedUseOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Erityisasunnot"
                name="supportive_housing"
                options={supportiveHousingOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Tilastollinen pääkäyttötarkoitus"
                name="statistical_use"
                options={statisticalUseOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Field
                component={FieldTypeText}
                label="Vuokrauksen käyttötarkoitus selite"
                name="intended_use_note"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Rahoitusmuoto"
                name="financing"
                options={financingOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Hallintamuoto"
                name="management"
                options={managementOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                className='checkbox-inline'
                component={FieldTypeCheckbox}
                label='Siirto-oikeus'
                name="transferable"
                options= {[
                  {value: 'true', label: 'Siirto-oikeus'},
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                className='checkbox-inline'
                component={FieldTypeCheckbox}
                label='Sääntely'
                name="regulated"
                options= {[
                  {value: true, label: 'Säännelty'},
                ]}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Sääntelymuoto"
                name="regulation"
                options={regulationOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Hitas"
                name="hitas"
                options={hitasOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                className='no-margin'
                component={FieldTypeSelect}
                label="Irtisanomisaika"
                name="notice_period"
                options={noticePeriodOptions}
              />
            </Column>
            <Column medium={8}>
              <Field
                className='no-margin'
                component={FieldTypeText}
                label="Irtisanomisajan selite"
                name="notice_note"
              />
            </Column>
          </Row>
        </GreenBoxEdit>
      </form>
    );
  }
}

const formName = 'summary-form';

export default flowRight(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(SummaryEdit);
