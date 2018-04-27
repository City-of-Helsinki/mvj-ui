// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import LeaseHistory from './LeaseHistory';
import {fetchLessors} from '$src/contacts/actions';
import {receiveSummaryFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getNoticePeriodOptions} from '$src/noticePeriod/helpers';
import {getAttributeFieldOptions, getLessorOptions} from '$src/util/helpers';
import {getLessors} from '$src/contacts/selectors';
import {getAttributes, getIsSummaryFormValid} from '$src/leases/selectors';
import {getNoticePeriods} from '$src/noticePeriod/selectors';
import {genericValidator} from '$components/form/validations';

import type {NoticePeriodList} from '$src/noticePeriod/types';

type Props = {
  attributes: Object,
  fetchLessors: Function,
  handleSubmit: Function,
  history: Array<Object>,
  isSummaryFormValid: boolean,
  lessors: Array<Object>,
  noticePeriods: NoticePeriodList,
  receiveSummaryFormValid: Function,
  valid: boolean,
}

class SummaryEdit extends Component {
  props: Props

  componentWillMount() {
    const {fetchLessors} = this.props;

    fetchLessors();
  }

  componentDidUpdate() {
    const {isSummaryFormValid, receiveSummaryFormValid, valid} = this.props;
    if(isSummaryFormValid !== valid) {
      receiveSummaryFormValid(valid);
    }
  }

  render () {
    const {attributes, handleSubmit, history, lessors, noticePeriods} = this.props;
    const classificationOptions = getAttributeFieldOptions(attributes, 'classification');
    const intendedUseOptions = getAttributeFieldOptions(attributes, 'intended_use');
    const supportiveHousingOptions = getAttributeFieldOptions(attributes, 'supportive_housing');
    const statisticalUseOptions = getAttributeFieldOptions(attributes, 'statistical_use');
    const financingOptions = getAttributeFieldOptions(attributes, 'financing');
    const managementOptions = getAttributeFieldOptions(attributes, 'management');
    const regulationOptions = getAttributeFieldOptions(attributes, 'regulation');
    const hitasOptions = getAttributeFieldOptions(attributes, 'hitas');
    const noticePeriodOptions = getNoticePeriodOptions(noticePeriods);

    const lessorOptions = getLessorOptions(lessors);

    return (
      <form onSubmit={handleSubmit}>
        <h2>Yhteenveto</h2>
        <Divider />
        <Row>
          <Column medium={9}>
            <Collapse
              defaultOpen={true}
              headerTitle={
                <h3 className='collapse__header-title'>Perustiedot</h3>
              }
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Vuokranantaja"
                    name="lessor"
                    options={lessorOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lessor')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Julkisuusluokka"
                    name="classification"
                    options={classificationOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'classification')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Vuokrauksen käyttötarkoitus"
                    name="intended_use"
                    options={intendedUseOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'intended_use')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Field
                    component={FieldTypeText}
                    label="Vuokrauksen käyttötarkoitus selite"
                    name="intended_use_note"
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'intended_use_note')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Rahoitusmuoto"
                    name="financing"
                    options={financingOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'financing')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Hallintamuoto"
                    name="management"
                    options={managementOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'management')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    className='checkbox-inline'
                    component={FieldTypeCheckbox}
                    label='Siirto-oikeus'
                    name="transferable"
                    options= {[
                      {value: 'true', label: 'Siirto-oikeus'},
                    ]}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'transferable')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Hitas"
                    name="hitas"
                    options={hitasOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'hitas')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Irtisanomisaika"
                    name="notice_period"
                    options={noticePeriodOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'notice_period')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Field
                    component={FieldTypeText}
                    label="Irtisanomisajan selite"
                    name="notice_note"
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'notice_note')),
                    ]}
                  />
                </Column>
              </Row>
            </Collapse>

            <Collapse
              defaultOpen={true}
              headerTitle={
                <h3 className='collapse__header-title'>Tilastotiedot</h3>
              }
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Erityisasunnot"
                    name="supportive_housing"
                    options={supportiveHousingOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'supportive_housing')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Tilastollinen pääkäyttötarkoitus"
                    name="statistical_use"
                    options={statisticalUseOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'statistical_use')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    className='checkbox-inline'
                    component={FieldTypeCheckbox}
                    label='Sääntely'
                    name="regulated"
                    options= {[
                      {value: true, label: 'Säännelty'},
                    ]}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'regulated')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label="Sääntelymuoto"
                    name="regulation"
                    options={regulationOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'regulation')),
                    ]}
                  />
                </Column>
              </Row>
            </Collapse>
          </Column>
          <Column medium={3}>
            <LeaseHistory
              history={history}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.SUMMARY;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isSummaryFormValid: getIsSummaryFormValid(state),
        lessors: getLessors(state),
        noticePeriods: getNoticePeriods(state),
      };
    },
    {
      fetchLessors,
      receiveSummaryFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(SummaryEdit);
