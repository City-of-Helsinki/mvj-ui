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
import ExternalLink from '$components/links/ExternalLink';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RelatedLeasesEdit from './RelatedLeasesEdit';
import SummaryLeaseInfo from './SummaryLeaseInfo';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getContentSummary} from '$src/leases/helpers';
import {getRouteById} from '$src/root/routes';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Object,
  collapseStateBasic: boolean,
  collapseStateStatistical: boolean,
  currentLease: Lease,
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveCollapseStates: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  summary: Object,
}

class SummaryEdit extends Component<Props, State> {
  state = {
    summary: {},
  }

  componentDidMount() {
    const {currentLease} = this.props;

    if(!isEmpty(currentLease)) {
      this.updateSummary(currentLease);
    }
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.SUMMARY]: this.props.valid,
      });
    }

    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateSummary(this.props.currentLease);
    }
  }

  handleBasicInfoToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.SUMMARY]: {
          basic: val,
        },
      },
    });
  }

  handleStatisticalInfoToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.SUMMARY]: {
          statistical: val,
        },
      },
    });
  }

  updateSummary = (currentLease: Lease) => {
    this.setState({
      summary: getContentSummary(currentLease),
    });
  }

  render () {
    const {
      attributes,
      collapseStateBasic,
      collapseStateStatistical,
      errors,
      handleSubmit,
      isSaveClicked,
    } = this.props;
    const {summary} = this.state;
    const infillDevelopmentCompensations = summary.infill_development_compensations;

    return (
      <form onSubmit={handleSubmit}>
        <h2>Yhteenveto</h2>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12} medium={8} large={9}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
              onToggle={this.handleBasicInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'intended_use')}
                    name='intended_use'
                    overrideValues={{
                      label: 'Vuokrauksen käyttötarkoitus',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'financing')}
                    name='financing'
                    overrideValues={{
                      label: 'Rahoitusmuoto',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'management')}
                    name='management'
                    overrideValues={{
                      label: 'Hallintamuoto',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'transferable')}
                    name='transferable'
                    overrideValues={{
                      label: 'Siirto-oikeus',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'hitas')}
                    name='hitas'
                    overrideValues={{
                      label: 'Hitas',
                    }}
                  />
                </Column>
                {/* TODO: Allow to edit vuokrausperuste and täydennysrakentaminen */}
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Vuokrausperuste</FormFieldLabel>
                  <p>-</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Täydennysrakentamiskorvaus</FormFieldLabel>
                  {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length &&
                    <p>-</p>
                  }
                  {infillDevelopmentCompensations && !!infillDevelopmentCompensations.length && infillDevelopmentCompensations.map((item) =>
                    <p className='no-margin' key={item.id}>
                      <ExternalLink
                        className='no-margin'
                        href={`${getRouteById('infillDevelopment')}/${item.id}`}
                        label={item.name || item.id}
                      />
                    </p>
                  )}
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'notice_period')}
                    name='notice_period'
                    overrideValues={{
                      label: 'Irtisanomisaika',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'note')}
                    name='note'
                    overrideValues={{
                      label: 'Huomautus',
                    }}
                  />
                </Column>
              </Row>
              <SummaryLeaseInfo />
            </Collapse>

            <Collapse
              defaultOpen={collapseStateStatistical !== undefined ? collapseStateStatistical : true}
              headerTitle={<h3 className='collapse__header-title'>Tilastotiedot</h3>}
              onToggle={this.handleStatisticalInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'supportive_housing')}
                    name='supportive_housing'
                    overrideValues={{
                      label: 'Erityisasunnot',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'regulated')}
                    name='regulated'
                    overrideValues={{
                      label: 'Sääntely',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
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
          <Column small={12} medium={4} large={3}>
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
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.SUMMARY}.basic`),
        collapseStateStatistical: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.SUMMARY}.statistical`),
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
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
)(SummaryEdit);
