// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import Loader from '$src/components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import RemoveButton from '$components/form/RemoveButton';
import {fetchPenaltyInterestByInvoice} from '$src/penaltyInterest/actions';
import {FormNames} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {convertStrToDecimalNumber, formatNumber, hasPermissions} from '$util/helpers';
import {
  getIsFetchingByInvoice,
  getPenaltyInterestByInvoice,
} from '$src/penaltyInterest/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  field: any,
  collectionCharge: string,
  disableDirty?: boolean,
  fetchPenaltyInterestByInvoice: Function,
  invoice: ?number,
  invoiceOptions: Array<Object>,
  isFetching: boolean,
  onRemove: Function,
  penaltyInterest: ?Object,
  selectedInvoices: Array<Object>,
  showDeleteButton: boolean,
  usersPermissions: UsersPermissionsType,
}

class CollectionLetterInvoiceRow extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if(prevProps.invoice !== this.props.invoice && isEmpty(this.props.penaltyInterest)) {
      const {fetchPenaltyInterestByInvoice, invoice, usersPermissions} = this.props;

      if(hasPermissions(usersPermissions, UsersPermissions.ADD_COLLECTIONLETTER)) {
        fetchPenaltyInterestByInvoice(invoice.invoice);
      }
    }
  }

  getTotalAmount = () => {
    const {collectionCharge, penaltyInterest} = this.props;
    if(!penaltyInterest || isEmpty(penaltyInterest)) {
      return 0;
    }
    const formatedCollectionCharge = convertStrToDecimalNumber(collectionCharge);
    return penaltyInterest.outstanding_amount + penaltyInterest.total_interest_amount + (!isNaN(formatedCollectionCharge) ? formatedCollectionCharge : 0);
  }

  render() {
    const {
      disableDirty,
      field,
      invoiceOptions,
      isFetching,
      onRemove,
      penaltyInterest,
      selectedInvoices,
      showDeleteButton,
    } = this.props;
    const filteredInvoiceOptions = invoiceOptions.filter((invoice) => selectedInvoices.indexOf(invoice.value) === -1);
    return(
      <Row>
        <Column small={4}>
          <FormField
            disableDirty={disableDirty}
            fieldAttributes={{
              type: 'choice',
              required: true,
              label: 'Perittävä lasku',
              read_only: false,
            }}
            invisibleLabel
            name={`${field}.invoice`}
            overrideValues={{options: filteredInvoiceOptions}}
          />
        </Column>
        <Column small={2}>
          <LoaderWrapper className='invoice-row-wrapper'><Loader isLoading={isFetching} className='small' /></LoaderWrapper>
          {!isFetching &&
            <FormText>{!isEmpty(penaltyInterest) ? `${formatNumber(get(penaltyInterest, 'outstanding_amount'))} €` : '-'}</FormText>
          }
        </Column>
        <Column small={2}>
          <FormText>{!isEmpty(penaltyInterest) ? `${formatNumber(get(penaltyInterest, 'total_interest_amount'))} €` : '-'}</FormText>
        </Column>
        <Column small={2}>
          <FormField
            disableDirty={disableDirty}
            fieldAttributes={{
              type: 'decimal',
              required: true,
              read_only: false,
              label: 'Perimispalkkio',
              decimal_places: 2,
              max_digits: 12,
            }}
            invisibleLabel
            name={`${field}.collection_charge`}
            overrideValues={{options: filteredInvoiceOptions}}
          />
        </Column>
        <Column small={2}>
          <FieldAndRemoveButtonWrapper
            field={
              <FormText className='full-width'>{!isEmpty(penaltyInterest) ? `${formatNumber(this.getTotalAmount())} €` : '-'}</FormText>
            }
            removeButton={showDeleteButton &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title="Poista rivi"
              />
            }
          />
        </Column>
      </Row>
    );
  }
}

const formName = FormNames.LEASE_CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const invoice = selector(state, props.field);
    const selectedInvoices = [];

    props.fields.forEach((field) => {
      const item = selector(state, field);
      if(item && (item !== invoice)) {
        selectedInvoices.push(item);
      }
    });

    return {
      collectionCharge: selector(state, `${props.field}.collection_charge`),
      isFetching: getIsFetchingByInvoice(state, invoice),
      invoice: invoice,
      penaltyInterest: getPenaltyInterestByInvoice(state, invoice),
      selectedInvoices: selectedInvoices,
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    fetchPenaltyInterestByInvoice,
  }
)(CollectionLetterInvoiceRow);
