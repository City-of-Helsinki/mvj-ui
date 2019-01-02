// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import RelatedLeasesEdit from './RelatedLeasesEdit';
import SummaryLeaseInfo from './SummaryLeaseInfo';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, LeaseSummaryFieldTitles, LeaseSummaryFieldPaths} from '$src/leases/enums';
import {validateSummaryForm} from '$src/leases/formValidators';
import {getContentSummary} from '$src/leases/helpers';
import {
  getFieldAttributes,
  getReferenceNumberLink,
  isFieldAllowedToRead,
} from '$util/helpers';
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
  startDate: ?string,
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
              headerTitle='Perustiedot'
              onToggle={this.handleBasicInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.STATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseSummaryFieldPaths.STATE)}
                      name='state'
                      overrideValues={{label: LeaseSummaryFieldTitles.STATE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.START_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseSummaryFieldPaths.START_DATE)}
                      name='start_date'
                      overrideValues={{label: LeaseSummaryFieldTitles.START_DATE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.END_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseSummaryFieldPaths.END_DATE)}
                      name='end_date'
                      overrideValues={{label: LeaseSummaryFieldTitles.END_DATE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.LESSOR)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseSummaryFieldPaths.LESSOR)}
                      name='lessor'
                      overrideValues={{
                        fieldType: 'lessor',
                        label: LeaseSummaryFieldTitles.LESSOR,
                      }}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.PREPARER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseSummaryFieldPaths.PREPARER)}
                      name='preparer'
                      overrideValues={{
                        fieldType: 'user',
                        label: LeaseSummaryFieldTitles.PREPARER,
                      }}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.CLASSIFICATION)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseSummaryFieldPaths.CLASSIFICATION)}
                      name='classification'
                      overrideValues={{label: 'Julkisuusluokka'}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.INTENDED_USE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.INTENDED_USE)}
                      name='intended_use'
                      overrideValues={{label: LeaseSummaryFieldTitles.INTENDED_USE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.INTENDED_USE_NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.INTENDED_USE_NOTE)}
                      name='intended_use_note'
                      overrideValues={{label: LeaseSummaryFieldTitles.INTENDED_USE_NOTE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.FINANCING)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.FINANCING)}
                      name='financing'
                      overrideValues={{label: LeaseSummaryFieldTitles.FINANCING}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.MANAGEMENT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.MANAGEMENT)}
                      name='management'
                      overrideValues={{label: LeaseSummaryFieldTitles.MANAGEMENT}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.TRANSFERABLE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.TRANSFERABLE)}
                      name='transferable'
                      overrideValues={{label: LeaseSummaryFieldTitles.TRANSFERABLE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.HITAS)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.HITAS)}
                      name='hitas'
                      overrideValues={{label: LeaseSummaryFieldTitles.HITAS}}
                    />
                  </Authorization>
                </Column>
                {/* TODO: Allow to edit vuokrausperuste */}
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Vuokrausperuste'
                    text='-'
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.INFILL_DEVELOPMENT_COMPENSATIONS)}>
                    <FormTextTitle>{LeaseSummaryFieldTitles.INFILL_DEVELOPMENT_COMPENSATIONS}</FormTextTitle>
                    {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length
                      ? <FormText>-</FormText>
                      : <ListItems>
                        {infillDevelopmentCompensations.map((item) =>
                          <ListItem key={item.id}>
                            <ExternalLink
                              className='no-margin'
                              href={`${getRouteById('infillDevelopment')}/${item.id}`}
                              text={item.name || item.id}
                            />
                          </ListItem>
                        )}
                      </ListItems>
                    }
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.NOTICE_PERIOD)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.NOTICE_PERIOD)}
                      name='notice_period'
                      overrideValues={{label: LeaseSummaryFieldTitles.NOTICE_PERIOD}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.NOTICE_NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.NOTICE_NOTE)}
                      name='notice_note'
                      overrideValues={{label: LeaseSummaryFieldTitles.NOTICE_NOTE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.REFERENCE_NUMBER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.REFERENCE_NUMBER)}
                      name='reference_number'
                      validate={referenceNumber}
                      readOnlyValueRenderer={(value) => {
                        if(value) {
                          return <FormText><ExternalLink
                            className='no-margin'
                            href={getReferenceNumberLink(value)}
                            text={value} /></FormText>;
                        } else {
                          return <FormText>-</FormText>;
                        }
                      }}
                      overrideValues={{label: LeaseSummaryFieldTitles.REFERENCE_NUMBER}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.NOTE)}
                      name='note'
                      overrideValues={{label: LeaseSummaryFieldTitles.NOTE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.IS_SUBJECT_TO_VAT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.IS_SUBJECT_TO_VAT)}
                      name='is_subject_to_vat'
                      overrideValues={{label: LeaseSummaryFieldTitles.IS_SUBJECT_TO_VAT}}
                    />
                  </Authorization>
                </Column>
              </Row>

              <SummaryLeaseInfo />
            </Collapse>

            <Collapse
              defaultOpen={collapseStateStatistical !== undefined ? collapseStateStatistical : true}
              headerTitle='Tilastotiedot'
              onToggle={this.handleStatisticalInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.SUPPORTIVE_HOUSING)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.SUPPORTIVE_HOUSING)}
                      name='supportive_housing'
                      overrideValues={{label: LeaseSummaryFieldTitles.SUPPORTIVE_HOUSING}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.STATISTICAL_USE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.STATISTICAL_USE)}
                      name='statistical_use'
                      overrideValues={{label: LeaseSummaryFieldTitles.STATISTICAL_USE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.REGULATED)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.REGULATED)}
                      name='regulated'
                      overrideValues={{label: LeaseSummaryFieldTitles.REGULATED}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseSummaryFieldPaths.REGULATION)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseSummaryFieldPaths.REGULATION)}
                      name='regulation'
                      overrideValues={{label: LeaseSummaryFieldTitles.REGULATION}}
                    />
                  </Authorization>
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
const selector = formValueSelector(formName);

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
        startDate: selector(state, 'start_date'),
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
    validate: validateSummaryForm,
  }),
)(SummaryEdit);
