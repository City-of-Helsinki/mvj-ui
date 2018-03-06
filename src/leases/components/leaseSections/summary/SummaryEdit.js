// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, reduxForm, formValueSelector} from 'redux-form';

import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import {
  summaryHitasOptions,
  summaryLeaseStatisticalUseOptions,
  summaryLessorOptions,
  summaryNoticePeriodOptions,
  summaryPublicityOptions,
  summaryRegulatoryOptions,
  summaryRegulatoryMethodOptions,
  summarySpecialApartmentsOptions,
  summaryTransferRightOptions,
} from '../constants';

import {financialMethodOptions, managementMethodOptions, purposeOptions} from '../../../../constants';

type Props = {
  handleSubmit: Function,
}

class SummaryEdit extends Component {
  props: Props

  render () {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <GreenBoxEdit>
          <Row>
            <Column medium={8}>
              <Field
                component={FieldTypeSelect}
                label="Vuokranantaja"
                name="summary.lessor"
                options={summaryLessorOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Julkisuusluokka"
                name="summary.publicity"
                options={summaryPublicityOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Vuokarauksen käyttötarkoitus"
                name="summary.lease_use"
                options={purposeOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Erityisasunnot"
                name="summary.special_apartments"
                options={summarySpecialApartmentsOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Tilastollinen pääkäyttötarkoitus"
                name="summary.lease_statistical_use"
                options={summaryLeaseStatisticalUseOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Field
                component={FieldTypeText}
                label="Vuokrauksen käyttötarkoitus selite"
                name="summary.lease_use_description"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Rahoitusmuoto"
                name="summary.financing_method"
                options={financialMethodOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Hallintamuoto"
                name="summary.management_method"
                options={managementMethodOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Siirto-oikeus"
                name="summary.transfer_right"
                options={summaryTransferRightOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Sääntely"
                name="summary.regulatory"
                options={summaryRegulatoryOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Sääntelymuoto"
                name="summary.regulatory_method"
                options={summaryRegulatoryMethodOptions}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Hitas"
                name="summary.hitas"
                options={summaryHitasOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                className='no-margin'
                component={FieldTypeSelect}
                label="Irtisanomisaika"
                name="summary.notice_period"
                options={summaryNoticePeriodOptions}
              />
            </Column>
            <Column medium={8}>
              <Field
                className='no-margin'
                component={FieldTypeText}
                label="Irtisanomisajan selite"
                name="summary.notice_period_description"
              />
            </Column>
          </Row>
        </GreenBoxEdit>
      </form>
    );
  }
}

const formName = 'summary-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        summary: selector(state, 'summary'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(SummaryEdit);
