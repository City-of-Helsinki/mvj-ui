// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import BasicInfo from './BasicInfo';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import ContractRents from './ContractRents';
import FixedInitialYearRents from './FixedInitialYearRents';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustments from './RentAdjustments';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  FormNames,
  LeaseRentsFieldPaths,
  LeaseRentFixedInitialYearRentsFieldPaths,
  LeaseRentFixedInitialYearRentsFieldTitles,
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  LeaseIndexAdjustedRentsFieldPaths,
  LeaseIndexAdjustedRentsFieldTitles,
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
  LeasePayableRentsFieldPaths,
  LeasePayableRentsFieldTitles,
  RentTypes,
} from '$src/leases/enums';
import {isRentActive, isRentArchived} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatDateRange,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  contractRentsCollapseState: boolean,
  fixedInitialYearRentsCollapseState: boolean,
  indexAdjustedRentsCollapseState: boolean,
  leaseAttributes: Attributes,
  payableRentsCollapseState: boolean,
  receiveCollapseStates: Function,
  rent: Object,
  rents: Array<Object>,
  rentAdjustmentsCollapseState: boolean,
  rentCollapseState: boolean,
}

const RentItem = ({
  contractRentsCollapseState,
  fixedInitialYearRentsCollapseState,
  indexAdjustedRentsCollapseState,
  leaseAttributes,
  payableRentsCollapseState,
  receiveCollapseStates,
  rent,
  rents,
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
    rentType = get(rent, 'type'),
    fixedInitialYearRents = get(rent, 'fixed_initial_year_rents', []),
    indexAdjustedRents = get(rent, 'index_adjusted_rents', []),
    rentAdjustments = get(rent, 'rent_adjustments', []),
    payableRents = get(rent, 'payable_rents', []),
    typeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE);

  return (
    <Collapse
      archived={archived}
      defaultOpen={rentCollapseState !== undefined ? rentCollapseState : active || rents.length === 1}
      headerSubtitles={
        <Column small={6} medium={8} large={10}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.START_DATE) ||
            isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.END_DATE)}
          >
            <CollapseHeaderSubtitle>{formatDateRange(rent.start_date, rent.end_date) || '-'}</CollapseHeaderSubtitle>
          </Authorization>
        </Column>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}>
          {getLabelOfOption(typeOptions, rentType) || '-'}
        </Authorization>
      }
      onToggle={handleRentCollapseToggle}
    >
      <BasicInfo
        rent={rent}
        rentType={rentType}
      />

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}>
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={fixedInitialYearRentsCollapseState !== undefined ? fixedInitialYearRentsCollapseState : true}
            headerTitle={LeaseRentFixedInitialYearRentsFieldTitles.FIXED_INITIAL_YEAR_RENTS}
            onToggle={handleFixedInitialYearRentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}
          >
            <FixedInitialYearRents fixedInitialYearRents={fixedInitialYearRents} />
          </Collapse>
        }
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}>
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.FIXED ||
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={contractRentsCollapseState !== undefined ? contractRentsCollapseState : true}
            headerTitle={LeaseRentContractRentsFieldTitles.CONTRACT_RENTS}
            onToggle={handleContractRentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}
          >
            <ContractRents
              contractRents={get(rent, 'contract_rents', [])}
              rentType={rentType}
            />
          </Collapse>
        }
      </Authorization>

      {!!indexAdjustedRents.length &&
        (rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={indexAdjustedRentsCollapseState !== undefined ? indexAdjustedRentsCollapseState : false}
          headerTitle={LeaseIndexAdjustedRentsFieldTitles.INDEX_ADJUSTED_RENTS}
          onToggle={handleIndexAdjustedRentsCollapseToggle}
          uiDataKey={getUiDataLeaseKey(LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS)}
        >
          <IndexAdjustedRents indexAdjustedRents={indexAdjustedRents} />
        </Collapse>
      }

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS)}>
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.FIXED ||
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={rentAdjustmentsCollapseState !== undefined ? rentAdjustmentsCollapseState : false}
            headerTitle={`${LeaseRentAdjustmentsFieldTitles.RENT_ADJUSTMENTS} (${rentAdjustments.length})`}
            onToggle={handleRentAdjustmentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS)}
          >
            <RentAdjustments rentAdjustments={rentAdjustments} />
          </Collapse>
        }
      </Authorization>

      {!!payableRents.length &&
        (rentType === RentTypes.INDEX || rentType === RentTypes.FIXED || rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={payableRentsCollapseState !== undefined ? payableRentsCollapseState : false}
          headerTitle={LeasePayableRentsFieldTitles.PAYABLE_RENTS}
          onToggle={handlePayableRentsCollapseToggle}
          uiDataKey={getUiDataLeaseKey(LeasePayableRentsFieldPaths.PAYABLE_RENTS)}
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
      contractRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.contract_rents`),
      fixedInitialYearRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.fixed_initial_year_rents`),
      indexAdjustedRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.index_adjusted_rents`),
      leaseAttributes: getLeaseAttributes(state),
      payableRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.payable_rents`),
      rentCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.rent`),
      rentAdjustmentsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.RENTS}.${id}.rent_adjustments`),
    };
  },
  {
    receiveCollapseStates,
  }
)(RentItem);
