import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { change, FieldArray, formValueSelector, FormSection } from "redux-form";
import { Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import BasicInfoEdit from "./BasicInfoEdit";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import ContractRentsEdit from "./ContractRentsEdit";
import EqualizedRents from "./EqualizedRents";
import FixedInitialYearRentsEdit from "./FixedInitialYearRentsEdit";
import IndexAdjustedRents from "./IndexAdjustedRents";
import PayableRents from "./PayableRents";
import RentAdjustmentsEdit from "./RentAdjustmentsEdit";
import { receiveCollapseStates } from "@/leases/actions";
import { FormNames, ViewModes } from "@/enums";
import { ContractRentPeriods, LeaseRentsFieldPaths, LeaseRentFixedInitialYearRentsFieldPaths, LeaseRentFixedInitialYearRentsFieldTitles, LeaseRentContractRentsFieldPaths, LeaseRentContractRentsFieldTitles, LeaseIndexAdjustedRentsFieldPaths, LeaseIndexAdjustedRentsFieldTitles, LeaseRentAdjustmentsFieldPaths, LeaseRentAdjustmentsFieldTitles, LeasePayableRentsFieldPaths, LeasePayableRentsFieldTitles, LeaseEqualizedRentsFieldPaths, LeaseEqualizedRentsFieldTitles, RentDueDateTypes, RentTypes, LeaseRentsFieldTitles, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDateRange, getFieldOptions, getLabelOfOption, hasPermissions, isActive, isArchived, isEmptyValue, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes as getLeaseAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import OldDwellingsInHousingCompaniesPriceIndexEdit from "./OldDwellingsInHousingCompaniesPriceIndexEdit";
type Props = {
  change: (...args: Array<any>) => any;
  contractRentsCollapseState: boolean;
  contractRents: Array<Record<string, any>>;
  dueDates: Array<Record<string, any>>;
  dueDatesType: string;
  equalizedRentsCollapseState: boolean;
  errors: Record<string, any> | null | undefined;
  field: string;
  oldDwellingsInHousingCompaniesPriceIndexCollapseState: boolean;
  fixedInitialYearRents: Array<Record<string, any>>;
  fixedInitialYearRentsCollapseState: boolean;
  index: number;
  indexAdjustedRentsCollapseState: boolean;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  onRemove: (...args: Array<any>) => any;
  payableRentsCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  rentAdjustments: Array<Record<string, any>>;
  rentAdjustmentsCollapseState: boolean;
  rentCollapseState: boolean;
  rentId: number;
  rents: Array<Record<string, any>>;
  rentType: string | null | undefined;
  usersPermissions: UsersPermissionsType;
};
type State = {
  active: boolean;
  archived: boolean;
  contractRentErrors: Record<string, any> | null | undefined;
  equalizedRents: Array<Record<string, any>>;
  errors: Record<string, any> | null | undefined;
  fixedInitialYearRentErrors: Record<string, any> | null | undefined;
  indexAdjustedRents: Array<Record<string, any>>;
  leaseAttributes: Attributes;
  payableRents: Array<Record<string, any>>;
  rentAdjustmentsErrors: Record<string, any> | null | undefined;
  rentErrors: Record<string, any> | null | undefined;
  rentId: number;
  savedRent: Record<string, any>;
  typeOptions: Array<Record<string, any>>;
};

const getRentById = (rents: Array<Record<string, any>>, id: number) => {
  if (!id) return null;
  return rents.find(rent => rent.id === id);
};

class RentItemEdit extends PureComponent<Props, State> {
  state = {
    active: false,
    archived: false,
    contractRentErrors: null,
    equalizedRents: [],
    errors: null,
    fixedInitialYearRentErrors: null,
    indexAdjustedRents: [],
    leaseAttributes: null,
    payableRents: [],
    rentAdjustmentsErrors: null,
    rentErrors: null,
    rentId: -1,
    savedRent: {},
    typeOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.typeOptions = getFieldOptions(props.leaseAttributes, LeaseRentsFieldPaths.TYPE);
    }

    if (props.errors !== state.errors) {
      newState.errors = props.errors;
      newState.rentErrors = get(props.errors, props.field);
      newState.fixedInitialYearRentErrors = get(props.errors, `${props.field}.fixed_initial_year_rents`);
      newState.contractRentErrors = get(props.errors, `${props.field}.contract_rents`);
      newState.rentAdjustmentsErrors = get(props.errors, `${props.field}.rent_adjustments`);
    }

    if (props.rentId !== state.rentId) {
      const savedRent = getRentById(props.rents, props.rentId);
      newState.rentId = props.rentId;
      newState.savedRent = savedRent;
      newState.active = isActive(savedRent);
      newState.archived = isArchived(savedRent);
      newState.indexAdjustedRents = get(savedRent, 'index_adjusted_rents', []);
      newState.payableRents = get(savedRent, 'payable_rents', []);
      newState.equalizedRents = get(savedRent, 'equalized_rents', []);
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.rentType !== this.props.rentType) {
      this.addEmptyContractRentIfNeeded();
      this.clearContractRentPeriodIfNeeded();
    }

    if (prevProps.dueDatesType !== this.props.dueDatesType) {
      this.addEmptyDueDateIfNeeded();
    }
  }

  clearContractRentPeriodIfNeeded = () => {
    const {
      change,
      contractRents,
      field,
      rentType
    } = this.props;

    if ((rentType === RentTypes.INDEX || rentType === RentTypes.INDEX2022) && contractRents && contractRents.length) {
      contractRents.forEach((item, index) => {
        if (!isEmptyValue(item.period) && item.period !== ContractRentPeriods.PER_YEAR) {
          change(formName, `${field}.contract_rents[${index}].period`, '');
        }

        if (!isEmptyValue(item.period) && item.base_amount_period !== ContractRentPeriods.PER_YEAR) {
          change(formName, `${field}.contract_rents[${index}].base_amount_period`, '');
        }
      });
    }
  };
  addEmptyContractRentIfNeeded = () => {
    const {
      change,
      contractRents,
      field
    } = this.props;

    if (!contractRents || !contractRents.length) {
      change(formName, `${field}.contract_rents`, [{}]);
    }
  };
  addEmptyDueDateIfNeeded = () => {
    const {
      change,
      dueDates,
      dueDatesType,
      field
    } = this.props;

    if (dueDatesType === RentDueDateTypes.CUSTOM && (!dueDates || !dueDates.length)) {
      change(formName, `${field}.due_dates`, [{}]);
    }
  };
  handleCollapseToggle = (key: string, val: boolean) => {
    const {
      receiveCollapseStates,
      rentId
    } = this.props;
    if (!rentId) return;
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_RENTS]: {
          [rentId]: {
            [key]: val
          }
        }
      }
    });
  };
  handleRentCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('rent', val);
  };
  handleOldDwellingsInHousingCompaniesPriceIndexCollapseState = (val: boolean) => {
    this.handleCollapseToggle('old_dwellings_in_housing_companies_price_index', val);
  }
  handleFixedInitialYearRentsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('fixed_initial_year_rents', val);
  };
  handleContractRentsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('contract_rents', val);
  };
  handleIndexAdjustedRentsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('index_adjusted_rents', val);
  };
  handleRentAdjustmentsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('rent_adjustments', val);
  };
  handlePayableRentsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('payable_rents', val);
  };
  handleEqualizedRentsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('equalized_rents', val);
  };
  handleRemove = () => {
    const {
      index,
      onRemove
    } = this.props;
    onRemove(index);
  };

  render() {
    const {
      contractRents,
      contractRentsCollapseState,
      equalizedRentsCollapseState,
      field,
      fixedInitialYearRents,
      oldDwellingsInHousingCompaniesPriceIndexCollapseState,
      fixedInitialYearRentsCollapseState,
      indexAdjustedRentsCollapseState,
      isSaveClicked,
      leaseAttributes,
      payableRentsCollapseState,
      rentAdjustments,
      rentAdjustmentsCollapseState,
      rentCollapseState,
      rentType,
      rents,
      usersPermissions
    } = this.props;
    const {
      active,
      archived,
      contractRentErrors,
      equalizedRents,
      fixedInitialYearRentErrors,
      indexAdjustedRents,
      payableRents,
      rentAdjustmentsErrors,
      rentErrors,
      savedRent,
      typeOptions
    } = this.state;
    const rentTypeIsIndex = rentType === RentTypes.INDEX,
          rentTypeIsIndex2022 = rentType === RentTypes.INDEX2022,
          rentTypeIsManual = rentType === RentTypes.MANUAL,
          rentTypeIsFixed = rentType === RentTypes.FIXED;
    const oldDwellingsInHousingCompaniesPriceIndex = get(savedRent, 'old_dwellings_in_housing_companies_price_index');
    const oldDwellingsInHousingCompaniesPriceIndexType = get(savedRent, 'old_dwellings_in_housing_companies_price_index_type');
    return <Collapse archived={archived} defaultOpen={rentCollapseState !== undefined ? rentCollapseState : active || rents.length === 1 && !archived} hasErrors={isSaveClicked && !isEmpty(rentErrors)} headerTitle={<Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}>
            {getLabelOfOption(typeOptions, get(savedRent, 'type')) || '-'}
          </Authorization>} headerSubtitles={<Column small={6} medium={8} large={10}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.END_DATE) || isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.START_DATE)}>
              <CollapseHeaderSubtitle>{formatDateRange(get(savedRent, 'start_date'), get(savedRent, 'end_date')) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>} onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_RENT) ? this.handleRemove : null} onToggle={this.handleRentCollapseToggle}>
        <FormSection name={field}>
          <BoxContentWrapper>
            <BasicInfoEdit field={field} isSaveClicked={isSaveClicked} rentType={rentType} />
          </BoxContentWrapper>
        </FormSection>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX)}>
          <Collapse className='collapse__secondary' defaultOpen={oldDwellingsInHousingCompaniesPriceIndexCollapseState !== undefined ? oldDwellingsInHousingCompaniesPriceIndexCollapseState : true} hasErrors={/*TODO: Error handling*/false} headerTitle={`${LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX}`} onToggle={this.handleFixedInitialYearRentsCollapseToggle}>
              <OldDwellingsInHousingCompaniesPriceIndexEdit 
                oldDwellingsInHousingCompaniesPriceIndex={oldDwellingsInHousingCompaniesPriceIndex}
                oldDwellingsInHousingCompaniesPriceIndexType={oldDwellingsInHousingCompaniesPriceIndexType}
                typeFieldName={`${field}.old_dwellings_in_housing_companies_price_index_type`}
              />
            </Collapse>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}>
          {(rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsManual) && <Collapse className='collapse__secondary' defaultOpen={fixedInitialYearRentsCollapseState !== undefined ? fixedInitialYearRentsCollapseState : true} hasErrors={isSaveClicked && !isEmpty(fixedInitialYearRentErrors)} headerTitle={`${LeaseRentFixedInitialYearRentsFieldTitles.FIXED_INITIAL_YEAR_RENTS} (${fixedInitialYearRents ? fixedInitialYearRents.length : 0})`} onToggle={this.handleFixedInitialYearRentsCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}>
              <FieldArray component={FixedInitialYearRentsEdit} isSaveClicked={isSaveClicked} name={`${field}.fixed_initial_year_rents`} />
            </Collapse>}
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}>
          {(rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsFixed || rentTypeIsManual) && <Collapse className='collapse__secondary' defaultOpen={contractRentsCollapseState !== undefined ? contractRentsCollapseState : true} hasErrors={isSaveClicked && !isEmpty(contractRentErrors)} headerTitle={`${LeaseRentContractRentsFieldTitles.CONTRACT_RENTS} (${contractRents ? contractRents.length : 0})`} onToggle={this.handleContractRentsCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}>
              <FieldArray component={ContractRentsEdit} isSaveClicked={isSaveClicked} name={`${field}.contract_rents`} rentField={field} rentType={rentType} />
            </Collapse>}
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS)}>
          {!!indexAdjustedRents.length && (rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsManual) && <Collapse className='collapse__secondary' defaultOpen={indexAdjustedRentsCollapseState !== undefined ? indexAdjustedRentsCollapseState : false} headerTitle={`${LeaseIndexAdjustedRentsFieldTitles.INDEX_ADJUSTED_RENTS} (${indexAdjustedRents.length})`} onToggle={this.handleIndexAdjustedRentsCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS)}>
              <IndexAdjustedRents indexAdjustedRents={indexAdjustedRents} />
            </Collapse>}
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS)}>
          {(rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsFixed || rentTypeIsManual) && <Collapse className='collapse__secondary' defaultOpen={rentAdjustmentsCollapseState !== undefined ? rentAdjustmentsCollapseState : false} hasErrors={isSaveClicked && !isEmpty(rentAdjustmentsErrors)} headerTitle={`${LeaseRentAdjustmentsFieldTitles.RENT_ADJUSTMENTS} (${rentAdjustments ? rentAdjustments.length : 0})`} onToggle={this.handleRentAdjustmentsCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS)}>
              <FieldArray component={RentAdjustmentsEdit} isSaveClicked={isSaveClicked} name={`${field}.rent_adjustments`} />
            </Collapse>}
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePayableRentsFieldPaths.PAYABLE_RENTS)}>
          {!!payableRents.length && (rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsFixed || rentTypeIsManual) && <Collapse className='collapse__secondary' defaultOpen={payableRentsCollapseState !== undefined ? payableRentsCollapseState : false} headerTitle={`${LeasePayableRentsFieldTitles.PAYABLE_RENTS} (${payableRents.length})`} onToggle={this.handlePayableRentsCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePayableRentsFieldPaths.PAYABLE_RENTS)}>
              <PayableRents payableRents={payableRents} />
            </Collapse>}
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseEqualizedRentsFieldPaths.EQUALIZED_RENTS)}>
          {!!equalizedRents.length && <Collapse className='collapse__secondary' defaultOpen={equalizedRentsCollapseState !== undefined ? equalizedRentsCollapseState : false} headerTitle={`${LeaseEqualizedRentsFieldTitles.EQUALIZED_RENTS} (${equalizedRents.length})`} onToggle={this.handleEqualizedRentsCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseEqualizedRentsFieldPaths.EQUALIZED_RENTS)}>
              <EqualizedRents equalizedRents={equalizedRents} />
            </Collapse>}
        </Authorization>
      </Collapse>;
  }

}

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);
export default connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  const newProps: any = {
    contractRents: selector(state, `${props.field}.contract_rents`),
    dueDates: selector(state, `${props.field}.due_dates`),
    dueDatesType: selector(state, `${props.field}.due_dates_type`),
    errors: getErrorsByFormName(state, formName),
    fixedInitialYearRents: selector(state, `${props.field}.fixed_initial_year_rents`),
    isSaveClicked: getIsSaveClicked(state),
    leaseAttributes: getLeaseAttributes(state),
    rentAdjustments: selector(state, `${props.field}.rent_adjustments`),
    rentId: id,
    rentType: selector(state, `${props.field}.type`),
    usersPermissions: getUsersPermissions(state)
  };

  if (id) {
    newProps.equalizedRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.READONLY}.${formName}.${id}.equalized_rents`);
    newProps.oldDwellingsInHousingCompaniesPriceIndexCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.old_dwellings_in_housing_companies_price_index`);
    newProps.fixedInitialYearRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.fixed_initial_year_rents`);
    newProps.indexAdjustedRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.index_adjusted_rents`);
    newProps.payableRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.payable_rents`);
    newProps.rentAdjustmentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.rent_adjustments`);
    newProps.rentCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.rent`);
  }

  return newProps;
}, {
  change,
  receiveCollapseStates
})(RentItemEdit);