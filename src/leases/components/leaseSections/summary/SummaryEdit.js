// @flow
import React, {PureComponent} from 'react';
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
import {FormNames, LeaseFieldTitles, LeaseFieldPaths} from '$src/leases/enums';
import {validateSummaryForm} from '$src/leases/formValidators';
import {getContentSummary} from '$src/leases/helpers';
import {
  getFieldAttributes,
  getReferenceNumberLink,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
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

class SummaryEdit extends PureComponent<Props, State> {
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

  referenceNumberReadOnlyRenderer = (value: ?string) => {
    if(value) {
      return <FormText><ExternalLink
        className='no-margin'
        href={getReferenceNumberLink(value)}
        text={value} /></FormText>;
    } else {
      return <FormText>-</FormText>;
    }
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
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.STATE)}
                      name='state'
                      overrideValues={{label: LeaseFieldTitles.STATE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.START_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.START_DATE)}
                      name='start_date'
                      overrideValues={{label: LeaseFieldTitles.START_DATE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.END_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.END_DATE)}
                      name='end_date'
                      overrideValues={{label: LeaseFieldTitles.END_DATE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.LESSOR)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.LESSOR)}
                      name='lessor'
                      overrideValues={{
                        fieldType: 'lessor',
                        label: LeaseFieldTitles.LESSOR,
                      }}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.PREPARER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.PREPARER)}
                      name='preparer'
                      overrideValues={{
                        fieldType: 'user',
                        label: LeaseFieldTitles.PREPARER,
                      }}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CLASSIFICATION)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.CLASSIFICATION)}
                      name='classification'
                      overrideValues={{label: 'Julkisuusluokka'}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.INTENDED_USE)}
                      name='intended_use'
                      overrideValues={{label: LeaseFieldTitles.INTENDED_USE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE_NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.INTENDED_USE_NOTE)}
                      name='intended_use_note'
                      overrideValues={{label: LeaseFieldTitles.INTENDED_USE_NOTE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.FINANCING)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.FINANCING)}
                      name='financing'
                      overrideValues={{label: LeaseFieldTitles.FINANCING}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.MANAGEMENT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.MANAGEMENT)}
                      name='management'
                      overrideValues={{label: LeaseFieldTitles.MANAGEMENT}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.TRANSFERABLE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.TRANSFERABLE)}
                      name='transferable'
                      overrideValues={{label: LeaseFieldTitles.TRANSFERABLE}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.HITAS)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.HITAS)}
                      name='hitas'
                      overrideValues={{label: LeaseFieldTitles.HITAS}}
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
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INFILL_DEVELOPMENT_COMPENSATIONS)}>
                    <FormTextTitle>{LeaseFieldTitles.INFILL_DEVELOPMENT_COMPENSATIONS}</FormTextTitle>
                    {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length
                      ? <FormText>-</FormText>
                      : <ListItems>
                        {infillDevelopmentCompensations.map((item) =>
                          <ListItem key={item.id}>
                            <ExternalLink
                              className='no-margin'
                              href={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${item.id}`}
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
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_PERIOD)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.NOTICE_PERIOD)}
                      name='notice_period'
                      overrideValues={{label: LeaseFieldTitles.NOTICE_PERIOD}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.NOTICE_NOTE)}
                      name='notice_note'
                      overrideValues={{label: LeaseFieldTitles.NOTICE_NOTE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REFERENCE_NUMBER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.REFERENCE_NUMBER)}
                      name='reference_number'
                      validate={referenceNumber}
                      readOnlyValueRenderer={this.referenceNumberReadOnlyRenderer}
                      overrideValues={{label: LeaseFieldTitles.REFERENCE_NUMBER}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.NOTE)}
                      name='note'
                      overrideValues={{label: LeaseFieldTitles.NOTE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.IS_SUBJECT_TO_VAT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.IS_SUBJECT_TO_VAT)}
                      name='is_subject_to_vat'
                      overrideValues={{label: LeaseFieldTitles.IS_SUBJECT_TO_VAT}}
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
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING)}
                      name='supportive_housing'
                      overrideValues={{label: LeaseFieldTitles.SUPPORTIVE_HOUSING}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATISTICAL_USE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.STATISTICAL_USE)}
                      name='statistical_use'
                      overrideValues={{label: LeaseFieldTitles.STATISTICAL_USE}}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATED)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.REGULATED)}
                      name='regulated'
                      overrideValues={{label: LeaseFieldTitles.REGULATED}}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATION)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, LeaseFieldPaths.REGULATION)}
                      name='regulation'
                      overrideValues={{label: LeaseFieldTitles.REGULATION}}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Collapse>
          </Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.RELATED_LEASES)}>
            <Column small={12} medium={4} large={3}>
              <RelatedLeasesEdit />
            </Column>
          </Authorization>
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
