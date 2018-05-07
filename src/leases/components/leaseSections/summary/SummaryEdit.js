// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import LeaseHistory from './LeaseHistory';
import {fetchLessors} from '$src/contacts/actions';
import {receiveSummaryFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getLessorOptions} from '$src/contacts/helpers';
import {getNoticePeriodOptions} from '$src/noticePeriod/helpers';
import {getAttributeFieldOptions, sortAlphaAsc} from '$src/util/helpers';
import {getLessors} from '$src/contacts/selectors';
import {getAttributes, getIsSummaryFormValid} from '$src/leases/selectors';
import {getNoticePeriods} from '$src/noticePeriod/selectors';

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

class SummaryEdit extends Component<Props> {
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
    const preparerOptions = getAttributeFieldOptions(attributes, 'preparer').sort(sortAlphaAsc);
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
                  <FormField
                    fieldAttributes={get(attributes, 'lessor')}
                    name='lessor'
                    overrideValues={{
                      label: 'Vuokranantaja',
                      options: lessorOptions,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'preparer')}
                    name='preparer'
                    overrideValues={{
                      label: 'Valmistelija',
                      options: preparerOptions,
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
                      label: 'Vuokrauksen käyttötarkoituksen selite',
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
                      label: 'hitas',
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
                      label: 'Irtisanomisajan selite',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'reference_number')}
                    name='reference_number'
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
                      label: 'Kommentti',
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
