// @flow
import React from 'react';
import {connect} from 'react-redux';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import InvoicesTable from './InvoicesTable';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

type Props = {

  invoicesCollapseState: boolean,
  isInvoicingEnabled: boolean,
  receiveCollapseStates: Function,
  rentCalculatorCollapseState: boolean,
}

const Invoices = ({
  invoicesCollapseState,
  isInvoicingEnabled,
  receiveCollapseStates,
  rentCalculatorCollapseState,
}: Props) => {
  const handleInvoicesCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          invoices: val,
        },
      },
    });
  };

  const handleRentCalculatorCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
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
        defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true}
        headerTitle={<h3 className='collapse__header-title'>Laskut</h3>}
        onToggle={handleInvoicesCollapseToggle}
      >
        <InvoicesTable/>
      </Collapse>
      <Collapse
        defaultOpen={rentCalculatorCollapseState !== undefined ? rentCalculatorCollapseState : true}
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
      invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
      isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
      rentCalculatorCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.rent_calculator`),
    };
  },
  {
    receiveCollapseStates,
  }
)(Invoices);
