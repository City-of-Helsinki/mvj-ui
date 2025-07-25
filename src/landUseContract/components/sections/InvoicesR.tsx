import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { AppConsumer } from "@/app/AppContext";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Collapse from "@/components/collapse/Collapse";
import CreateAndCreditInvoiceR from "./CreateAndCreditInvoiceR";
import Divider from "@/components/content/Divider";
import InvoiceTableAndPanelR from "./InvoiceTableAndPanelR";
import Title from "@/components/content/Title";
import {
  receiveCollapseStates,
  receiveInvoiceToCredit,
} from "@/landUseInvoices/actions";
import { PermissionMissingTexts, ViewModes } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import { LeaseInvoicingFieldTitles } from "@/leases/enums";
// TODO
import { getCurrentLandUseContract } from "@/landUseContract/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { LandUseContract } from "@/landUseContract/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { getInvoiceToCredit } from "@/landUseInvoices/selectors";
type Props = {
  currentLandUseContract: LandUseContract;
  invoicesCollapseState: boolean;
  invoiceToCredit: string | null | undefined;
  isInvoicingEnabled: boolean;
  match: {
    params: Record<string, any>;
  };
  receiveCollapseStates: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  receiveInvoiceToCredit: (...args: Array<any>) => any;
};
type State = {
  currentLandUseContract: LandUseContract;
};

class InvoicesR extends PureComponent<Props, State> {
  state = {
    currentLandUseContract: {},
  };
  creditPanel: any;
  componentDidMount = () => {
    const { receiveInvoiceToCredit } = this.props;
    receiveInvoiceToCredit(null);
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.currentLandUseContract !== state.currentLandUseContract) {
      newState.currentLandUseContract = props.currentLandUseContract;
    }

    return !isEmpty(newState) ? newState : null;
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const { receiveCollapseStates } = this.props;
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          [key]: val,
        },
      },
    });
  };
  handleInvoicesCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle("invoices", val);
  };
  handlePreviewInvoicesCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle("preview_invoices", val);
  };
  handleInvoiceToCreditChange = (val: string) => {
    const { receiveInvoiceToCredit } = this.props;
    receiveInvoiceToCredit(val);
  };

  render() {
    const { invoicesCollapseState, invoiceToCredit, usersPermissions } =
      this.props;
    // if(isFetchingLeaseInvoiceTabAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE))
      return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
    return (
      <AppConsumer>
        {() => {
          return (
            <Fragment>
              <Title>{LeaseInvoicingFieldTitles.INVOICING}</Title>
              <Divider />

              <Collapse
                defaultOpen={
                  invoicesCollapseState !== undefined
                    ? invoicesCollapseState
                    : true
                }
                headerTitle={LeaseInvoicingFieldTitles.INVOICES}
                onToggle={this.handleInvoicesCollapseToggle}
              >
                <InvoiceTableAndPanelR
                  invoiceToCredit={invoiceToCredit}
                  onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
                />
                <Authorization
                  allow={hasPermissions(
                    usersPermissions,
                    UsersPermissions.ADD_INVOICE,
                  )}
                >
                  <CreateAndCreditInvoiceR invoiceToCredit={invoiceToCredit} />
                </Authorization>
              </Collapse>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLandUseContract = getCurrentLandUseContract(state);
      return {
        currentLandUseContract: currentLandUseContract,
        isInvoicingEnabled: currentLandUseContract
          ? !!currentLandUseContract.invoicing_enabled_at
          : null,
        usersPermissions: getUsersPermissions(state),
        invoiceToCredit: getInvoiceToCredit(state),
      };
    },
    {
      receiveCollapseStates,
      receiveInvoiceToCredit,
    },
  ),
)(InvoicesR) as React.ComponentType<any>;
