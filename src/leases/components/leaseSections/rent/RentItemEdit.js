// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {change, FieldArray, formValueSelector, FormSection} from 'redux-form';
import {Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BasicInfoEdit from './BasicInfoEdit';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import ContractRentsEdit from './ContractRentsEdit';
import FixedInitialYearRentsEdit from './FixedInitialYearRentsEdit';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustmentsEdit from './RentAdjustmentsEdit';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, RentDueDateTypes, RentTypes} from '$src/leases/enums';
import {isRentActive, isRentArchived} from '$src/leases/helpers';
import {formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  change: Function,
  contractRentsCollapseState: boolean,
  contractRents: Array<Object>,
  dueDates: Array<Object>,
  dueDatesType: string,
  errors: ?Object,
  field: string,
  fixedInitialYearRentsCollapseState: boolean,
  index: number,
  indexAdjustedRentsCollapseState: boolean,
  isSaveClicked: boolean,
  onRemove: Function,
  payableRentsCollapseState: boolean,
  receiveCollapseStates: Function,
  rentAdjustments: Array<Object>,
  rentAdjustmentsCollapseState: boolean,
  rentCollapseState: boolean,
  rentId: number,
  rents: Array<Object>,
  rentType: ?string,
}

type State = {
  active: boolean,
  archived: boolean,
  attributes: Attributes,
  contractRentErrors: ?Object,
  errors: ?Object,
  fixedInitialYearRentErrors: ?Object,
  indexAdjustedRents: Array<Object>,
  payableRents: Array<Object>,
  rentAdjustmentsErrors: ?Object,
  rentErrors: ?Object,
  rentId: number,
  savedRent: Object,
  typeOptions: Array<Object>,
}

const getRentById = (rents: Array<Object>, id: number) => {
  if(!id) return {};

  return rents.find((rent) => rent.id === id);
};

class RentItemEdit extends PureComponent<Props, State> {
  state = {
    active: false,
    archived: false,
    attributes: {},
    contractRentErrors: null,
    errors: null,
    fixedInitialYearRentErrors: null,
    indexAdjustedRents: [],
    payableRents: [],
    rentAdjustmentsErrors: null,
    rentErrors: null,
    rentId: -1,
    savedRent: {},
    typeOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.typeOptions = getAttributeFieldOptions(props.attributes, 'rents.child.children.type');
    }

    if(props.errors !== state.errors) {
      newState.errors = props.errors;
      newState.rentErrors = get(props.errors, props.field);
      newState.fixedInitialYearRentErrors = get(props.errors, `${props.field}.fixed_initial_year_rents`);
      newState.contractRentErrors = get(props.errors, `${props.field}.contract_rents`);
      newState.rentAdjustmentsErrors = get(props.errors, `${props.field}.rent_adjustments`);
    }

    if(props.rentId !== state.rentId) {
      const savedRent = getRentById(props.rents, props.rentId);

      newState.rentId = props.rentId;
      newState.savedRent = savedRent;
      newState.active = isRentActive(savedRent);
      newState.archived = isRentArchived(savedRent);
      newState.indexAdjustedRents = get(savedRent, 'index_adjusted_rents', []);
      newState.payableRents = get(savedRent, 'payable_rents', []);
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.rentType !== this.props.rentType) {
      this.addEmptyContractRentIfNeeded();
    }
    if(prevProps.dueDatesType !== this.props.dueDatesType) {
      this.addEmptyDueDateIfNeeded();
    }
  }

  addEmptyContractRentIfNeeded = () => {
    const {change, contractRents, field} = this.props;

    if(!contractRents || !contractRents.length) {
      change(formName, `${field}.contract_rents`, [{}]);
    }
  }

  addEmptyDueDateIfNeeded = () => {
    const {change, dueDates, dueDatesType, field} = this.props;

    if(dueDatesType === RentDueDateTypes.CUSTOM && (!dueDates || !dueDates.length)) {
      change(formName, `${field}.due_dates`, [{}]);
    }
  }

  handleRentCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, rentId} = this.props;

    if(!rentId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.RENTS]: {
          [rentId]: {
            rent: val,
          },
        },
      },
    });
  };

  handleFixedInitialYearRentsCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, rentId} = this.props;

    if(!rentId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.RENTS]: {
          [rentId]: {
            fixed_initial_year_rents: val,
          },
        },
      },
    });
  };

  handleContractRentsCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, rentId} = this.props;

    if(!rentId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.RENTS]: {
          [rentId]: {
            contract_rents: val,
          },
        },
      },
    });
  };

  handleIndexAdjustedRentsCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, rentId} = this.props;

    if(!rentId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.RENTS]: {
          [rentId]: {
            index_adjusted_rents: val,
          },
        },
      },
    });
  };

  handleRentAdjustmentsCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, rentId} = this.props;

    if(!rentId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.RENTS]: {
          [rentId]: {
            rent_adjustments: val,
          },
        },
      },
    });
  };

  handlePayableRentsCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, rentId} = this.props;

    if(!rentId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.RENTS]: {
          [rentId]: {
            payable_rents: val,
          },
        },
      },
    });
  };

  handleRemove = () => {
    const {index, onRemove} = this.props;

    onRemove(index);
  };

  render() {
    const {
      contractRentsCollapseState,
      field,
      fixedInitialYearRentsCollapseState,
      indexAdjustedRentsCollapseState,
      isSaveClicked,
      payableRentsCollapseState,
      rentAdjustments,
      rentAdjustmentsCollapseState,
      rentCollapseState,
      rentType,
    } = this.props;
    const {
      active,
      archived,
      contractRentErrors,
      fixedInitialYearRentErrors,
      indexAdjustedRents,
      payableRents,
      rentAdjustmentsErrors,
      rentErrors,
      savedRent,
      typeOptions,
    } = this.state;

    return (
      <Collapse
        className={classNames({'archived': archived})}
        defaultOpen={rentCollapseState !== undefined ? rentCollapseState : active}
        hasErrors={isSaveClicked && !isEmpty(rentErrors)}
        headerTitle={<CollapseHeaderTitle>{getLabelOfOption(typeOptions, get(savedRent, 'type')) || '-'}</CollapseHeaderTitle>}
        headerSubtitles={
          <Column small={6} medium={8} large={10}>
            <CollapseHeaderSubtitle>{formatDateRange(get(savedRent, 'start_date'), get(savedRent, 'end_date')) || '-'}</CollapseHeaderSubtitle>
          </Column>
        }
        onRemove={this.handleRemove}
        onToggle={this.handleRentCollapseToggle}
      >
        <FormSection name={field}>
          <BoxContentWrapper>
            <BasicInfoEdit
              field={field}
              isSaveClicked={isSaveClicked}
              rentType={rentType}
            />
          </BoxContentWrapper>
        </FormSection>

        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={fixedInitialYearRentsCollapseState !== undefined ? fixedInitialYearRentsCollapseState : true}
            hasErrors={isSaveClicked && !isEmpty(fixedInitialYearRentErrors)}
            headerTitle={<CollapseHeaderTitle>Kiinteä alkuvuosivuokra</CollapseHeaderTitle>}
            onToggle={this.handleFixedInitialYearRentsCollapseToggle}
          >
            <FieldArray
              component={FixedInitialYearRentsEdit}
              isSaveClicked={isSaveClicked}
              name={`${field}.fixed_initial_year_rents`}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.FIXED ||
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={contractRentsCollapseState !== undefined ? contractRentsCollapseState : true}
            hasErrors={isSaveClicked && !isEmpty(contractRentErrors)}
            headerTitle={<CollapseHeaderTitle>Sopimusvuokra</CollapseHeaderTitle>}
            onToggle={this.handleContractRentsCollapseToggle}
          >
            <FieldArray
              component={ContractRentsEdit}
              isSaveClicked={isSaveClicked}
              name={`${field}.contract_rents`}
              rentField={field}
              rentType={rentType}
            />
          </Collapse>
        }

        {!!indexAdjustedRents.length &&
          (rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={indexAdjustedRentsCollapseState !== undefined ? indexAdjustedRentsCollapseState : false}
            headerTitle={<CollapseHeaderTitle>Indeksitarkistettu vuokra</CollapseHeaderTitle>}
            onToggle={this.handleIndexAdjustedRentsCollapseToggle}
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
            hasErrors={isSaveClicked && !isEmpty(rentAdjustmentsErrors)}
            headerTitle={<CollapseHeaderTitle>Alennukset ja korotukset ({rentAdjustments ? rentAdjustments.length : 0})</CollapseHeaderTitle>}
            onToggle={this.handleRentAdjustmentsCollapseToggle}
          >
            <FieldArray
              component={RentAdjustmentsEdit}
              isSaveClicked={isSaveClicked}
              name={`${field}.rent_adjustments`}
            />
          </Collapse>
        }

        {!!payableRents.length &&
          (rentType === RentTypes.INDEX || rentType === RentTypes.FIXED || rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={payableRentsCollapseState !== undefined ? payableRentsCollapseState : false}
            headerTitle={<CollapseHeaderTitle>Perittävä vuokra</CollapseHeaderTitle>}
            onToggle={this.handlePayableRentsCollapseToggle}
          >
            <PayableRents payableRents={payableRents} />
          </Collapse>
        }
      </Collapse>
    );
  }
}

const formName = FormNames.RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    const newProps: any = {
      attributes: getAttributes(state),
      contractRents: selector(state, `${props.field}.contract_rents`),
      dueDates: selector(state, `${props.field}.due_dates`),
      dueDatesType: selector(state, `${props.field}.due_dates_type`),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      rentAdjustments: selector(state, `${props.field}.rent_adjustments`),
      rentId: id,
      rentType: selector(state, `${props.field}.type`),
    };

    if(id) {
      newProps.fixedInitialYearRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.fixed_initial_year_rents`);
      newProps.indexAdjustedRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.index_adjusted_rents`);
      newProps.payableRentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.payable_rents`);
      newProps.rentAdjustmentsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.rent_adjustments`);
      newProps.rentCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.rent`);
    }

    return newProps;
  },
  {
    change,
    receiveCollapseStates,
  }
)(RentItemEdit);
