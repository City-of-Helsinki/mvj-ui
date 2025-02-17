import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchInvoiceAttributes } from "@/invoices/actions";
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from "@/invoices/selectors";
import type { Attributes, Methods } from "types";

function SapInvoicesAttributes(WrappedComponent: any) {
  type Props = {
    fetchInvoiceAttributes: (...args: Array<any>) => any;
    invoiceAttributes: Attributes;
    invoiceMethods: Methods;
    isFetchingInvoiceAttributes: boolean;
  };
  return class SapInvoicesAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchInvoiceAttributes,
        invoiceAttributes,
        invoiceMethods,
        isFetchingInvoiceAttributes,
      } = this.props;

      if (
        !isFetchingInvoiceAttributes &&
        !invoiceMethods &&
        !invoiceAttributes
      ) {
        fetchInvoiceAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withSapInvoicesAttributes = flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
      };
    },
    {
      fetchInvoiceAttributes,
    },
  ),
  SapInvoicesAttributes,
);
export { withSapInvoicesAttributes };
