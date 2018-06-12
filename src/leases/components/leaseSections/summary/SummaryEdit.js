// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import RelatedLeasesEdit from './RelatedLeasesEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getNoticePeriodOptions} from '$src/noticePeriod/helpers';
import {getAttributes, getErrorsByFormName} from '$src/leases/selectors';
import {getNoticePeriods} from '$src/noticePeriod/selectors';
import {referenceNumber} from '$components/form/validations';

import type {NoticePeriodList} from '$src/noticePeriod/types';

type Props = {
  attributes: Object,
  errors: ?Object,
  handleSubmit: Function,
  noticePeriods: NoticePeriodList,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class SummaryEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.SUMMARY]: this.props.valid,
      });
    }
  }

  render () {
    const {attributes, errors, handleSubmit, noticePeriods} = this.props;
    const noticePeriodOptions = getNoticePeriodOptions(noticePeriods);
    return (
      <form onSubmit={handleSubmit}>
        <h2>Yhteenveto</h2>
        <Divider />
        <Row>
          <Column medium={9}>
            <Collapse
              defaultOpen={true}
              hasErrors={!isEmpty(errors)}
              headerTitle={
                <h3 className='collapse__header-title'>Perustiedot</h3>
              }
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'lessor')}
                    name='lessor'
                    overrideValues={{
                      fieldType: 'lessor',
                      label: 'Vuokranantaja',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'preparer')}
                    name='preparer'
                    overrideValues={{
                      fieldType: 'user',
                      label: 'Valmistelija',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'classification')}
                    name='classification'
                    overrideValues={{
                      label: 'Julkisuusluokka',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'intended_use')}
                    name='intended_use'
                    overrideValues={{
                      label: 'Vuokrauksen käyttötarkoitus',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormField
                    fieldAttributes={get(attributes, 'intended_use_note')}
                    name='intended_use_note'
                    overrideValues={{
                      label: 'Käyttötarkoituksen huomautus',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'financing')}
                    name='financing'
                    overrideValues={{
                      label: 'Rahoitusmuoto',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'management')}
                    name='management'
                    overrideValues={{
                      label: 'Hallintamuoto',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'transferable')}
                    name='transferable'
                    overrideValues={{
                      label: 'Siirto-oikeus',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'hitas')}
                    name='hitas'
                    overrideValues={{
                      label: 'Hitas',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'notice_period')}
                    name='notice_period'
                    overrideValues={{
                      label: 'Irtisanomisaika',
                      options: noticePeriodOptions,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormField
                    fieldAttributes={get(attributes, 'notice_note')}
                    name='notice_note'
                    overrideValues={{
                      label: 'Irtisanomisajan huomautus',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'reference_number')}
                    name='reference_number'
                    validate={referenceNumber}
                    overrideValues={{
                      label: 'Diaarinumero',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormField
                    fieldAttributes={get(attributes, 'note')}
                    name='note'
                    overrideValues={{
                      label: 'Huomautus',
                    }}
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
                  <FormField
                    fieldAttributes={get(attributes, 'supportive_housing')}
                    name='supportive_housing'
                    overrideValues={{
                      label: 'Erityisasunnot',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'statistical_use')}
                    name='statistical_use'
                    overrideValues={{
                      label: 'Tilastollinen pääkäyttötarkoitus',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'regulated')}
                    name='regulated'
                    overrideValues={{
                      label: 'Sääntely',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'regulation')}
                    name='regulation'
                    overrideValues={{
                      label: 'Sääntelymuoto',
                    }}
                  />
                </Column>
              </Row>
            </Collapse>
          </Column>
          <Column medium={3}>
            <RelatedLeasesEdit />
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
        errors: getErrorsByFormName(state, formName),
        noticePeriods: getNoticePeriods(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(SummaryEdit);
