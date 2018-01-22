// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, reduxForm, formValueSelector} from 'redux-form';

import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import {
  summaryFinancialMethodOptions,
  summaryHitasOptions,
  summaryLeaseStatisticalUseOptions,
  summaryLeaseUseOptions,
  summaryLessorOptions,
  summaryManagementMethodOptions,
  summaryNoticePeriodOptions,
  summaryPublicityOptions,
  summaryRegulatoryOptions,
  summaryRegulatoryMethodOptions,
  summarySpecialApartmentsOptions,
  summaryTransferRightOptions} from '../constants';

type Props = {
  handleSubmit: Function,
}

class SummaryEdit extends Component {
  props: Props

  render () {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <div className='green-box no-margin'>
          <Row>
            <Column medium={8}>
              <Field name="summary.lessor"
                component={FieldTypeSelect}
                label="Vuokranantaja"
                options={summaryLessorOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.publicity"
                component={FieldTypeSelect}
                label="Julkisuusluokka"
                options={summaryPublicityOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field name="summary.lease_use"
                component={FieldTypeSelect}
                label="Vuokarauksen käyttötarkoitus"
                options={summaryLeaseUseOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.special_apartments"
                component={FieldTypeSelect}
                label="Erityisasunnot"
                options={summarySpecialApartmentsOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.lease_statistical_use"
                component={FieldTypeSelect}
                label="Tilastollinen pääkäyttötarkoitus"
                options={summaryLeaseStatisticalUseOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Field name="summary.lease_use_description"
                component={FieldTypeText}
                label="Vuokrauksen käyttötarkoitus selite"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field name="summary.financing_method"
                component={FieldTypeSelect}
                label="Rahoitusmuoto"
                options={summaryFinancialMethodOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.management_method"
                component={FieldTypeSelect}
                label="Hallintamuoto"
                options={summaryManagementMethodOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.transfer_right"
                component={FieldTypeSelect}
                label="Siirto-oikeus"
                options={summaryTransferRightOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field name="summary.regulatory"
                component={FieldTypeSelect}
                label="Sääntely"
                options={summaryRegulatoryOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.regulatory_method"
                component={FieldTypeSelect}
                label="Sääntelymuoto"
                options={summaryRegulatoryMethodOptions}
              />
            </Column>
            <Column medium={4}>
              <Field name="summary.hitas"
                component={FieldTypeSelect}
                label="Hitas"
                options={summaryHitasOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field name="summary.notice_period"
                component={FieldTypeSelect}
                label="Irtisanomisaika"
                options={summaryNoticePeriodOptions}
              />
            </Column>
            <Column medium={8}>
              <Field name="summary.notice_period_description"
                component={FieldTypeText}
                label="Irtisanomisajan selite"
              />
            </Column>
          </Row>
        </div>
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
