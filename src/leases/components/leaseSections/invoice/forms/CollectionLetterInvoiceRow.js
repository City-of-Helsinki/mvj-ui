// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {fetchCollectionCostsByInvoice} from '$src/debtCollection/actions';
import {FormNames} from '$src/leases/enums';
import {formatNumber} from '$util/helpers';
import {getCollectionCostsByInvoice, getIsFetchingCollectionCostsByInvoice} from '$src/debtCollection/selectors';

type Props = {
  field: any,
  collectionCosts: ?Object,
  disableDirty?: boolean,
  fetchCollectionCostsByInvoice: Function,
  invoice: ?number,
  invoiceOptions: Array<Object>,
  isFetching: boolean,
  onRemove: Function,
  selectedInvoices: Array<Object>,
  showDeleteButton: boolean,
}

class CollectionLetterInvoiceRow extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if(prevProps.invoice !== this.props.invoice && isEmpty(this.props.collectionCosts)) {
      const {fetchCollectionCostsByInvoice, invoice} = this.props;
      fetchCollectionCostsByInvoice(invoice);
    }
  }

  getTotalAmount = () => {
    const {collectionCosts} = this.props;
    if(isEmpty(collectionCosts)) {
      return 0;
    }
    return Number(get(collectionCosts, 'fee_payment')) + Number(get(collectionCosts, 'interest')) + Number(get(collectionCosts, 'collection_fee'));
  }

  render() {
    const {
      collectionCosts,
      disableDirty,
      field,
      invoiceOptions,
      isFetching,
      onRemove,
      selectedInvoices,
      showDeleteButton,
    } = this.props;

    if(isFetching) {
      return <p>Ladataan</p>;
    }
    const filteredInvoiceOptions = invoiceOptions.filter((invoice) => selectedInvoices.indexOf(invoice.value) === -1);
    return(
      <Row>
        <Column small={4}>
          <FormField
            disableDirty={disableDirty}
            fieldAttributes={{
              type: 'choice',
              required: true,
              label: '',
            }}
            name={field}
            overrideValues={{
              options: filteredInvoiceOptions,
            }}
          />
        </Column>
        <Column small={2}>
          <p>{!isEmpty(collectionCosts) ? `${formatNumber(get(collectionCosts, 'fee_payment'))} €` : '-'}</p>
        </Column>
        <Column small={2}>
          <p>{!isEmpty(collectionCosts) ? `${formatNumber(get(collectionCosts, 'interest'))} €` : '-'}</p>
        </Column>
        <Column small={2}>
          <p>{!isEmpty(collectionCosts) ? `${formatNumber(get(collectionCosts, 'collection_fee'))} €` : '-'}</p>
        </Column>
        <Column small={2}>
          <FieldAndRemoveButtonWrapper
            field={
              <p style={{width: '100%'}}>{!isEmpty(collectionCosts) ? `${formatNumber(this.getTotalAmount())} €` : '-'}</p>
            }
            removeButton={showDeleteButton &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                title="Poista rivi"
              />
            }
          />
        </Column>
      </Row>
    );
  }
}

const formName = FormNames.CREATE_COLLECTION_LETTER;
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
      invoice: invoice,
      collectionCosts: getCollectionCostsByInvoice(state, invoice),
      isFetching: getIsFetchingCollectionCostsByInvoice(state, invoice),
      selectedInvoices: selectedInvoices,
    };
  },
  {
    fetchCollectionCostsByInvoice,
  }
)(CollectionLetterInvoiceRow);
