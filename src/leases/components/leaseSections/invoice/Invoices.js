// @flow
import React from 'react';
import {connect} from 'react-redux';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import InvoicesTable from './InvoicesTable';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveCollapseStatuses} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {getCollapseStatusByKey, getCurrentLease} from '$src/leases/selectors';

type Props = {

  invoicesCollapseStatus: boolean,
  isInvoicingEnabled: boolean,
  receiveCollapseStatuses: Function,
  rentCalculatorCollapseStatus: boolean,
}

const Invoices = ({
  invoicesCollapseStatus,
  isInvoicingEnabled,
  receiveCollapseStatuses,
  rentCalculatorCollapseStatus,
}: Props) => {
  const handleInvoicesCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        invoices: {
          invoices: val,
        },
      },
    });
  };

  const handleRentCalculatorCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        invoices: {
          rent_calculator: val,
        },
      },
    });
  };

  return (
    <div>
      <h2>Laskutus</h2>
      <RightSubtitle
        className='invoicing-status'
        text={isInvoicingEnabled
          ? <p className="success">Laskutus käynnissä<i /></p>
          : <p className="alert">Laskutus ei käynnissä<i /></p>
        }
      />
      <Divider />
      <Collapse
        defaultOpen={invoicesCollapseStatus !== undefined ? invoicesCollapseStatus : true}
        headerTitle={<h3 className='collapse__header-title'>Laskut</h3>}
        onToggle={handleInvoicesCollapseToggle}
      >
        <InvoicesTable/>
      </Collapse>
      <Collapse
        defaultOpen={rentCalculatorCollapseStatus !== undefined ? rentCalculatorCollapseStatus : true}
        headerTitle={<h3 className='collapse__header-title'>Vuokralaskuri</h3>}
        onToggle={handleRentCalculatorCollapseToggle}
      >
        <RentCalculator />
      </Collapse>
    </div>
  );
};

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      invoicesCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
      isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
      rentCalculatorCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.invoices.rent_calculator`),
    };
  },
  {
    receiveCollapseStatuses,
  }
)(Invoices);
