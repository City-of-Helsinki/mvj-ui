// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {reduxForm, initialize, change} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import {FormNames, ViewModes} from '$src/enums';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
} from '$src/plotApplications/actions';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
} from '$src/plotApplications/selectors';

import type {Attributes} from '$src/types';
import { getInitialApplication, getInitialApplicationForm} from "../helpers";
import {
  getIsFetching as getIsFetchingPlotSearchList,
  getIsFetchingFormAttributes,
  getPlotSearchList
} from "../../plotSearch/selectors";
import {fetchFormAttributes} from "../../plotSearch/actions";
import {
  getFieldTypeMapping,
  getIsFetchingApplicationRelatedAttachments,
  getIsFetchingAttachmentAttributes
} from "../selectors";
import PlotApplicationSubsection from "./PlotApplicationSubsection";
import {fetchAttachmentAttributes, fetchPendingUploads, receiveFormValidFlags} from "../actions";
import Loader from "../../components/loader/Loader";

type Props = {
  attributes: Attributes,
  collapseStateCommon: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
  errors: ?Object,
  preparer: ?string,
  formName: string,
  isSaveClicked: boolean,
  initialize: Function,
  change: Function,
  plotSearches: Array<Object>,
  fetchPendingUploads: Function,
  fetchFormAttributes: Function,
  fetchAttachmentAttributes: Function,
  isFetchingFormAttributes: boolean,
  isFetchingAttachmentAttributes: boolean,
  isFetchingPlotSearchList: boolean
}

type State = {

}

class PlotApplicationEdit extends PureComponent<Props, State> {
  state = {
    form: null,
    targets: []
  }

  componentDidUpdate(prevProps) {
    const { receiveFormValidFlags } = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.PLOT_APPLICATION]: this.props.valid
      });
    }
  }

  componentDidMount() {
    this.props.fetchFormAttributes(1);
    this.props.fetchAttachmentAttributes();
    this.props.fetchPendingUploads();

    // TODO: adjust for existing application later
    this.props.initialize(getInitialApplication());

    receiveFormValidFlags({
      [FormNames.PLOT_APPLICATION]: this.props.valid
    });
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.PLOT_APPLICATION]: {
          common: val,
        },
      },
    });
  }

  handleCommonFieldsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('common', val);
  }

  initializeFormValues = (formId) => {
    const matchingSearch = this.props.plotSearches.results?.find((search) => search.form?.id === formId);

    this.props.change('formEntries', getInitialApplicationForm(
      this.props.fieldTypeMapping,
      matchingSearch?.form));
    this.props.change('targets', []);

    this.setState(() => ({
      form: matchingSearch?.form,
      targets: matchingSearch?.plot_search_targets || []
    }));
  }

  render (){
    const {
      collapseStateCommon,
      isSaveClicked,
      attributes,
      errors,
      isFetchingFormAttributes,
      isFetchingAttachmentAttributes,
      isFetchingPlotSearchList,
      plotSearches
    } = this.props;

    if (isFetchingPlotSearchList || isFetchingFormAttributes || isFetchingAttachmentAttributes) {
      return <Loader isLoading={true} />;
    }

    return (
      <form className="PlotApplicationEdit">
        <Title>
          {'Hakemus'}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateCommon !== undefined ? collapseStateCommon : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle={'Hakemus'}
              onToggle={this.handleCommonFieldsCollapseToggle}
            >
              <Row>
                <Authorization allow={true}>
                  <Column small={12} medium={6} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={{
                        ...get(attributes, 'form'),
                        label: 'Tonttihaku',
                        choices: plotSearches.results.filter((option) => option.form).map((option) => ({
                          display_name: option.name,
                          value: option.form.id
                        }))
                      }}
                      name='formId'
                      onChange={this.initializeFormValues}
                    />
                  </Column>
                </Authorization>
                {/*
                <Authorization allow={isFieldAllowedToRead(attributes, 'id')}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'arrival_time')}
                      name='arrival_time'
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'id')}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'time')}
                      name='time'
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'id')}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'saver')}
                      name='saver'
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'id')}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'disapproval_reason')}
                      name='disapproval_reason'
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'id')}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'notice')}
                      name='notice'
                    />
                  </Column>
                </Authorization>
                */}
                <Authorization allow={true}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'id')}
                      name='id'
                      disabled
                    />
                  </Column>
                </Authorization>
              </Row>
            </Collapse>

            {this.state.form && <>

            <Row>
                <Column small={12}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={{
                      ...get(attributes, 'targets'),
                      type: 'multiselect',
                      label: 'Haettavat kohteet'
                    }}
                    overrideValues={{
                      options: this.state.targets.map((target) => ({
                        value: target.id,
                        label: `${target.lease_address.address} (${target.lease_identifier})`
                      }))
                    }}
                    name='targets'
                  />
                </Column>
            </Row>
              <Row>
                <Column small={12}>
                  {this.state.form.sections.map((section) => (
                    <PlotApplicationSubsection
                      path={['formEntries.sections']}
                      section={section}
                      headerTag="h2"
                      key={section.id}
                    />
                  ))}
                </Column>
              </Row>
            </>}
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PLOT_APPLICATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateCommon: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.common`),
        isSaveClicked: getIsSaveClicked(state),
        errors: getErrorsByFormName(state, formName),
        plotSearches: getPlotSearchList(state),
        fieldTypeMapping: getFieldTypeMapping(state),
        isFetchingPlotSearchList: getIsFetchingPlotSearchList(state),
        isFetchingFormAttributes: getIsFetchingFormAttributes(state),
        isFetchingAttachmentAttributes: getIsFetchingAttachmentAttributes(state),
        isFetchingAttachments: getIsFetchingApplicationRelatedAttachments(state),
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
      receiveFormValidFlags,
      initialize,
      change,
      fetchFormAttributes,
      fetchPendingUploads,
      fetchAttachmentAttributes
    }
  ),
  reduxForm({
    form: formName,
  }),
)(PlotApplicationEdit);
