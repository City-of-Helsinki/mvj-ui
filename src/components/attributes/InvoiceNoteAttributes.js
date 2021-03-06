// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchInvoiceNoteAttributes} from '$src/invoiceNote/actions';
import {
  getAttributes as getInvoiceNoteAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceNoteAttributes,
  getMethods as getInvoiceNoteMethods,
} from '$src/invoiceNote/selectors';

import type {Attributes, Methods} from '$src/types';

function InvoiceNoteAttributes(WrappedComponent: any) {
  type Props = {
    fetchInvoiceNoteAttributes: Function,
    invoiceNoteAttributes: Attributes,
    invoiceNoteMethods: Methods,
    isFetchingInvoiceNoteAttributes: boolean,
  }

  return class InvoiceNoteAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchInvoiceNoteAttributes,
        invoiceNoteAttributes,
        invoiceNoteMethods,
        isFetchingInvoiceNoteAttributes,
      } = this.props;

      if(!isFetchingInvoiceNoteAttributes && !invoiceNoteMethods && !invoiceNoteAttributes) {
        fetchInvoiceNoteAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withInvoiceNoteAttributes = flowRight(
  connect(
    (state) => {
      return{
        invoiceNoteAttributes: getInvoiceNoteAttributes(state),
        invoiceNoteMethods: getInvoiceNoteMethods(state),
        isFetchingInvoiceNoteAttributes: getIsFetchingInvoiceNoteAttributes(state),
      };
    },
    {
      fetchInvoiceNoteAttributes,
    }
  ),
  InvoiceNoteAttributes,
);

export {withInvoiceNoteAttributes};
