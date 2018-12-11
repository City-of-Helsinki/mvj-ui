// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';
import get from 'lodash/get';
import classNames from 'classnames';

import BasicInfo from './BasicInfo';
import Collapse from '$components/collapse/Collapse';
import ContractRents from './ContractRents';
import FixedInitialYearRents from './FixedInitialYearRents';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustments from './RentAdjustments';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, RentTypes} from '$src/leases/enums';
import {isRentActive, isRentArchived} from '$src/leases/helpers';
import {formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contractRentsCollapseState: boolean,
  fixedInitialYearRentsCollapseState: boolean,
  indexAdjustedRentsCollapseState: boolean,
  payableRentsCollapseState: boolean,
  receiveCollapseStates: Function,
  rent: Object,
  rentAdjustmentsCollapseState: boolean,
  rentCollapseState: boolean,
}

const RentItem = ({
  attributes,
  contractRentsCollapseState,
  fixedInitialYearRentsCollapseState,
  indexAdjustedRentsCollapseState,
  payableRentsCollapseState,
  receiveCollapseStates,
  rent,
  rentAdjustmentsCollapseState,
  rentCollapseState,
}: Props) => {
  const handleRentCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.RENTS]: {
          [rent.id]: {
            rent: val,
          },
        },
      },
    });
  };

  const handleFixedInitialYearRentsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.RENTS]: {
          [rent.id]: {
            fixed_initial_year_rents: val,
          },
        },
      },
    });
  };


  const handleContractRentsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.RENTS]: {
          [rent.id]: {
            contract_rents: val,
          },
        },
      },
    });
  };

  const handleIndexAdjustedRentsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.RENTS]: {
          [rent.id]: {
            index_adjusted_rents: val,
          },
        },
      },
    });
  };

  const handleRentAdjustmentsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.RENTS]: {
          [rent.id]: {
            rent_adjustments: val,
          },
        },
      },
    });
  };

  const handlePayableRentsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.RENTS]: {
          [rent.id]: {
            payable_rents: val,
          },
        },
      },
    });
  };

  const active = isRentActive(rent),
    archived = isRentArchived(rent),
    typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type'),
    rentType = get(rent, 'type'),
    indexAdjustedRents = get(rent, 'index_adjusted_rents', []),
    rentAdjustments = get(rent, 'rent_adjustments', []),
    payableRents = get(rent, 'payable_rents', []);

  return (
    <Collapse
      className={classNames({'archived': archived})}
      defaultOpen={rentCollapseState !== undefined ? rentCollapseState : active}
      header={
        <div>
          <Column small={10}>
            <span className='collapse__header-subtitle'>
              {formatDateRange(rent.start_date, rent.end_date) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={<h3 className='collapse__header-title'>{getLabelOfOption(typeOptions, rentType) || '-'}</h3>}
      onToggle={handleRentCollapseToggle}
    >
      <BasicInfo
        rent={rent}
        rentType={rentType}
      />

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={fixedInitialYearRentsCollapseState !== undefined ? fixedInitialYearRentsCollapseState : true}
          headerTitle={<h4 className='collapse__header-title'>Kiinteä alkuvuosivuokra</h4>}
          onToggle={handleFixedInitialYearRentsCollapseToggle}
        >
          <FixedInitialYearRents fixedInitialYearRents={get(rent, 'fixed_initial_year_rents', [])} />
        </Collapse>
      }

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.FIXED ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={contractRentsCollapseState !== undefined ? contractRentsCollapseState : true}
          headerTitle={<h4 className='collapse__header-title'>Sopimusvuokra</h4>}
          onToggle={handleContractRentsCollapseToggle}
        >
          <ContractRents
            contractRents={get(rent, 'contract_rents', [])}
            rentType={rentType}
          />
        </Collapse>
      }

      {!!indexAdjustedRents.length &&
        (rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={indexAdjustedRentsCollapseState !== undefined ? indexAdjustedRentsCollapseState : false}
          headerTitle={<h4 className='collapse__header-title'>Indeksitarkistettu vuokra</h4>}
          onToggle={handleIndexAdjustedRentsCollapseToggle}
        >
          <IndexAdjustedRents indexAdjustedRents={indexAdjustedRents} />
        </Collapse>
      }

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.FIXED ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={rentAdjustmentsCollapseState !== undefined ? rentAdjustmentsCollapseState : false}
          headerTitle={<h4 className='collapse__header-title'>Alennukset ja korotukset ({rentAdjustments.length})</h4>}
          onToggle={handleRentAdjustmentsCollapseToggle}
        >
          <RentAdjustments rentAdjustments={rentAdjustments} />
        </Collapse>
      }

      {!!payableRents.length &&
        (rentType === RentTypes.INDEX || rentType === RentTypes.FIXED || rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={payableRentsCollapseState !== undefined ? payableRentsCollapseState : false}
          headerTitle={<h4 className='collapse__header-title'>Perittävä vuokra</h4>}
          onToggle={handlePayableRentsCollapseToggle}
        >
          <PayableRents payableRents={payableRents} />
        </Collapse>
      }
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.rent.id;

    return {
      attributes: getAttributes(state),
      contractRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.contract_rents`),
      fixedInitialYearRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.fixed_initial_year_rents`),
      indexAdjustedRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.index_adjusted_rents`),
      payableRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.payable_rents`),
      rentCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.rent`),
      rentAdjustmentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.rent_adjustments`),
    };
  },
  {
    receiveCollapseStates,
  }
)(RentItem);
