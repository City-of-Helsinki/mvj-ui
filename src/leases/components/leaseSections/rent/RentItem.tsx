import React from "react";
import { connect } from "react-redux";
import { Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "@/components/authorization/Authorization";
import BasicInfo from "./BasicInfo";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import ContractRents from "./ContractRents";
import EqualizedRents from "./EqualizedRents";
import FixedInitialYearRents from "./FixedInitialYearRents";
import IndexAdjustedRents from "./IndexAdjustedRents";
import PayableRents from "./PayableRents";
import RentAdjustments from "./RentAdjustments";
import { receiveCollapseStates } from "@/leases/actions";
import { FormNames, ViewModes } from "@/enums";
import {
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
  LeaseEqualizedRentsFieldPaths,
  LeaseEqualizedRentsFieldTitles,
  RentTypes,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDateRange,
  getFieldOptions,
  getLabelOfOption,
  isActive,
  isArchived,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCollapseStateByKey,
  getCurrentLeaseTypeIdentifier,
} from "@/leases/selectors";
import type { Attributes } from "types";
import type { ServiceUnit } from "@/serviceUnits/types";
import OldDwellingsInHousingCompaniesPriceIndexView from "./OldDwellingsInHousingCompaniesPriceIndex";
import { isATypedLease } from "@/leases/helpers";

const formName = FormNames.LEASE_RENTS;
type Props = {
  contractRentsCollapseState: boolean;
  equalizedRentsCollapseState: boolean;
  oldDwellingsInHousingCompaniesPriceIndexCollapseState: boolean;
  fixedInitialYearRentsCollapseState: boolean;
  indexAdjustedRentsCollapseState: boolean;
  leaseAttributes: Attributes;
  leaseTypeIdentifier: string;
  payableRentsCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  rent: Record<string, any>;
  rents: Array<Record<string, any>>;
  rentAdjustmentsCollapseState: boolean;
  rentCollapseState: boolean;
  serviceUnit: ServiceUnit;
};

const RentItem = ({
  contractRentsCollapseState,
  equalizedRentsCollapseState,
  oldDwellingsInHousingCompaniesPriceIndexCollapseState,
  fixedInitialYearRentsCollapseState,
  indexAdjustedRentsCollapseState,
  leaseAttributes,
  leaseTypeIdentifier,
  payableRentsCollapseState,
  receiveCollapseStates,
  rent,
  rents,
  rentAdjustmentsCollapseState,
  rentCollapseState,
  serviceUnit,
}: Props) => {
  const handleCollapseToggle = (key: string, val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [formName]: {
          [rent.id]: {
            [key]: val,
          },
        },
      },
    });
  };

  const handleRentCollapseToggle = (val: boolean) => {
    handleCollapseToggle("rent", val);
  };

  const handleFixedInitialYearRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("fixed_initial_year_rents", val);
  };

  const handleContractRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("contract_rents", val);
  };

  const handleIndexAdjustedRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("index_adjusted_rents", val);
  };

  const handleRentAdjustmentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("rent_adjustments", val);
  };

  const handlePayableRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("payable_rents", val);
  };

  const handleEqualizedRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("equalized_rents", val);
  };

  const active = isActive(rent),
    archived = isArchived(rent),
    rentType = get(rent, "type"),
    oldDwellingsInHousingCompaniesPriceIndex = get(
      rent,
      "old_dwellings_in_housing_companies_price_index",
      {},
    ),
    periodicRentAdjustmentType = get(rent, "periodic_rent_adjustment_type"),
    fixedInitialYearRents = get(rent, "fixed_initial_year_rents", []),
    contractRents = get(rent, "contract_rents", []),
    indexAdjustedRents = get(rent, "index_adjusted_rents", []),
    rentAdjustments = get(rent, "rent_adjustments", []),
    payableRents = get(rent, "payable_rents", []),
    equalizedRents = get(rent, "equalized_rents", []),
    typeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE),
    rentTypeIsIndex = rentType === RentTypes.INDEX,
    rentTypeIsIndex2022 = rentType === RentTypes.INDEX2022,
    rentTypeIsManual = rentType === RentTypes.MANUAL,
    rentTypeIsFixed = rentType === RentTypes.FIXED;

  return (
    <Collapse
      archived={archived}
      defaultOpen={
        rentCollapseState !== undefined
          ? rentCollapseState
          : active || rents.length === 1
      }
      headerSubtitles={
        <Column small={6} medium={8} large={10}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.START_DATE,
              ) ||
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.END_DATE,
              )
            }
          >
            <CollapseHeaderSubtitle>
              {formatDateRange(rent.start_date, rent.end_date) || "-"}
            </CollapseHeaderSubtitle>
          </Authorization>
        </Column>
      }
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            LeaseRentsFieldPaths.TYPE,
          )}
        >
          {getLabelOfOption(typeOptions, rentType) || "-"}
        </Authorization>
      }
      onToggle={handleRentCollapseToggle}
    >
      <BasicInfo rent={rent} rentType={rentType} serviceUnit={serviceUnit} />

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentsFieldPaths.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX,
        )}
      >
        {oldDwellingsInHousingCompaniesPriceIndex &&
          isATypedLease(leaseTypeIdentifier) && (
            <Collapse
              className="collapse__secondary"
              defaultOpen={
                oldDwellingsInHousingCompaniesPriceIndexCollapseState !==
                undefined
                  ? oldDwellingsInHousingCompaniesPriceIndexCollapseState
                  : true
              }
              headerTitle="Tasotarkistus"
            >
              <OldDwellingsInHousingCompaniesPriceIndexView
                oldDwellingsInHousingCompaniesPriceIndex={
                  oldDwellingsInHousingCompaniesPriceIndex
                }
                periodicRentAdjustmentType={periodicRentAdjustmentType}
              />
            </Collapse>
          )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS,
        )}
      >
        {(rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsManual) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              fixedInitialYearRentsCollapseState !== undefined
                ? fixedInitialYearRentsCollapseState
                : true
            }
            headerTitle={`${LeaseRentFixedInitialYearRentsFieldTitles.FIXED_INITIAL_YEAR_RENTS} (${fixedInitialYearRents.length})`}
            onToggle={handleFixedInitialYearRentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(
              LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS,
            )}
          >
            <FixedInitialYearRents
              fixedInitialYearRents={fixedInitialYearRents}
            />
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.CONTRACT_RENTS,
        )}
      >
        {(rentTypeIsIndex ||
          rentTypeIsIndex2022 ||
          rentTypeIsFixed ||
          rentTypeIsManual) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              contractRentsCollapseState !== undefined
                ? contractRentsCollapseState
                : true
            }
            headerTitle={`${LeaseRentContractRentsFieldTitles.CONTRACT_RENTS} (${contractRents.length})`}
            onToggle={handleContractRentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(
              LeaseRentContractRentsFieldPaths.CONTRACT_RENTS,
            )}
          >
            <ContractRents contractRents={contractRents} rentType={rentType} />
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS,
        )}
      >
        {!!indexAdjustedRents.length &&
          (rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsManual) && (
            <Collapse
              className="collapse__secondary"
              defaultOpen={
                indexAdjustedRentsCollapseState !== undefined
                  ? indexAdjustedRentsCollapseState
                  : false
              }
              headerTitle={`${LeaseIndexAdjustedRentsFieldTitles.INDEX_ADJUSTED_RENTS} (${indexAdjustedRents.length})`}
              onToggle={handleIndexAdjustedRentsCollapseToggle}
              uiDataKey={getUiDataLeaseKey(
                LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS,
              )}
            >
              <IndexAdjustedRents indexAdjustedRents={indexAdjustedRents} />
            </Collapse>
          )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS,
        )}
      >
        {(rentTypeIsIndex ||
          rentTypeIsIndex2022 ||
          rentTypeIsFixed ||
          rentTypeIsManual) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              rentAdjustmentsCollapseState !== undefined
                ? rentAdjustmentsCollapseState
                : false
            }
            headerTitle={`${LeaseRentAdjustmentsFieldTitles.RENT_ADJUSTMENTS} (${rentAdjustments.length})`}
            onToggle={handleRentAdjustmentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(
              LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS,
            )}
          >
            <RentAdjustments rentAdjustments={rentAdjustments} />
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeasePayableRentsFieldPaths.PAYABLE_RENTS,
        )}
      >
        {!!payableRents.length &&
          (rentTypeIsIndex ||
            rentTypeIsIndex2022 ||
            rentTypeIsFixed ||
            rentTypeIsManual) && (
            <Collapse
              className="collapse__secondary"
              defaultOpen={
                payableRentsCollapseState !== undefined
                  ? payableRentsCollapseState
                  : false
              }
              headerTitle={`${LeasePayableRentsFieldTitles.PAYABLE_RENTS} (${payableRents.length})`}
              onToggle={handlePayableRentsCollapseToggle}
              uiDataKey={getUiDataLeaseKey(
                LeasePayableRentsFieldPaths.PAYABLE_RENTS,
              )}
            >
              <PayableRents payableRents={payableRents} />
            </Collapse>
          )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseEqualizedRentsFieldPaths.EQUALIZED_RENTS,
        )}
      >
        {!!equalizedRents.length && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              equalizedRentsCollapseState !== undefined
                ? equalizedRentsCollapseState
                : false
            }
            headerTitle={`${LeaseEqualizedRentsFieldTitles.EQUALIZED_RENTS} (${equalizedRents.length})`}
            onToggle={handleEqualizedRentsCollapseToggle}
            uiDataKey={getUiDataLeaseKey(
              LeaseEqualizedRentsFieldPaths.EQUALIZED_RENTS,
            )}
          >
            <EqualizedRents equalizedRents={equalizedRents} />
          </Collapse>
        )}
      </Authorization>
    </Collapse>
  );
};

export default connect(
  (state, props: Props) => {
    const id = props.rent.id;
    return {
      contractRentsCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.contract_rents`,
      ),
      equalizedRentsCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.equalized_rents`,
      ),
      oldDwellingsInHousingCompaniesPriceIndexCollapseState:
        getCollapseStateByKey(
          state,
          `${ViewModes.READONLY}.${formName}.${id}.old_dwellings_in_housing_companies_price_index`,
        ),
      fixedInitialYearRentsCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.fixed_initial_year_rents`,
      ),
      indexAdjustedRentsCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.index_adjusted_rents`,
      ),
      leaseAttributes: getLeaseAttributes(state),
      leaseTypeIdentifier: getCurrentLeaseTypeIdentifier(state),
      payableRentsCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.payable_rents`,
      ),
      rentCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.rent`,
      ),
      rentAdjustmentsCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.rent_adjustments`,
      ),
    };
  },
  {
    receiveCollapseStates,
  },
)(RentItem);
