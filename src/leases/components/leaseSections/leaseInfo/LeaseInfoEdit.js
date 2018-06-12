// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentLeaseInfo} from '$src/leases/helpers';
import {getAttributes, getCurrentLease, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  leaseInfo: Object,
}

class LeaseInfoEdit extends Component<Props, State> {
  state = {
    leaseInfo: {},
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LEASE_INFO]: this.props.valid,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      return {
        leaseInfo: getContentLeaseInfo(props.currentLease),
        currentLease: props.currentLease,
      };
    }
    return null;
  }

  render () {
    const {attributes, isSaveClicked} = this.props;
    const {leaseInfo} = this.state;

    return (
      <form className='lease-info-edit'>
        <Row>
          <Column>
            <FormFieldLabel>Vuokratunnus</FormFieldLabel>
            <h1 className='lease-info-edit__number'>{leaseInfo.identifier || '-'}</h1>
          </Column>
          <Column>
            <FormField
              className='no-margin'
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'state')}
              name='state'
              overrideValues={{
                label: 'Tyyppi',
              }}
            />
          </Column>
          <Column>
            <FormField
              className='no-margin'
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'start_date')}
              name='start_date'
              overrideValues={{
                label: 'Alkupvm',
              }}
            />
          </Column>
          <Column>
            <FormField
              className='no-margin'
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'end_date')}
              name='end_date'
              overrideValues={{
                label: 'Loppupvm',
              }}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.LEASE_INFO;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        isSaveClicked: getIsSaveClicked(state),
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
)(LeaseInfoEdit);
