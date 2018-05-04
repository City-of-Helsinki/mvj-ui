// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveLeaseInfoFormValid} from '$src/leases/actions';
import {getContentLeaseInfo} from '$src/leases/helpers';
import {getAttributes, getCurrentLease, getIsLeaseInfoFormValid} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  isLeaseInfoFormValid: boolean,
  receiveLeaseInfoFormValid: Function,
  valid: boolean,
}

class LeaseInfoEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isLeaseInfoFormValid, receiveLeaseInfoFormValid, valid} = this.props;
    if(isLeaseInfoFormValid !== valid) {
      receiveLeaseInfoFormValid(valid);
    }
  }

  render () {
    const {
      attributes,
      currentLease,
    } = this.props;
    const leaseInfo = getContentLeaseInfo(currentLease);

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
              fieldAttributes={get(attributes, 'start_date')}
              name='start_date'
              overrideValues={{
                label: 'Alkupäivämäärä',
              }}
            />
          </Column>
          <Column>
            <FormField
              className='no-margin'
              fieldAttributes={get(attributes, 'end_date')}
              name='end_date'
              overrideValues={{
                label: 'Loppupäivämäärä',
              }}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'lease-info-form';

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        isLeaseInfoFormValid: getIsLeaseInfoFormValid(state),
      };
    },
    {
      receiveLeaseInfoFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseInfoEdit);
