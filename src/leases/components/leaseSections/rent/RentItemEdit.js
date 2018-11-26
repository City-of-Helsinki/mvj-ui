// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, FormSection} from 'redux-form';
import {Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BasicInfoEdit from './BasicInfoEdit';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContractRentsEdit from './ContractRentsEdit';
import Collapse from '$components/collapse/Collapse';
import FixedInitialYearRentsEdit from './FixedInitialYearRentsEdit';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustmentsEdit from './RentAdjustmentsEdit';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, RentTypes} from '$src/leases/enums';
import {isRentActive, isRentArchived} from '$src/leases/helpers';
import {formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contractRentsCollapseState: boolean,
  errors: ?Object,
  field: string,
  fixedInitialYearRentsCollapseState: boolean,
  index: number,
  indexAdjustedRentsCollapseState: boolean,
  isSaveClicked: boolean,
  onRemove: Function,
  payableRentsCollapseState: boolean,
  receiveCollapseStates: Function,
  rentAdjustmentsCollapseState: boolean,
  rentCollapseState: boolean,
  rentId: number,
  rents: Array<Object>,
  rentType: ?string,
}

const RentItemEdit = ({
  attributes,
  contractRentsCollapseState,
  errors,
  field,
  fixedInitialYearRentsCollapseState,
  index,
  indexAdjustedRentsCollapseState,
  isSaveClicked,
  onRemove,
  payableRentsCollapseState,
  receiveCollapseStates,
  rentAdjustmentsCollapseState,
  rentCollapseState,
  rentId,
  rents,
  rentType,
}: Props) =>  {
  const getRentById = (id: number) => {
    if(!id) {
      return {};
    }

    return rents.find((rent) => rent.id === id);
  };

  const handleRentCollapseToggle = (val: boolean) => {
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

  const handleFixedInitialYearRentsCollapseToggle = (val: boolean) => {
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

  const handleContractRentsCollapseToggle = (val: boolean) => {
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

  const handleIndexAdjustedRentsCollapseToggle = (val: boolean) => {
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

  const handleRentAdjustmentsCollapseToggle = (val: boolean) => {
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

  const handlePayableRentsCollapseToggle = (val: boolean) => {
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

  const handleRemove = () => {
    onRemove(index);
  };

  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type'),
    savedRent = getRentById(rentId),
    rentErrors = get(errors, field),
    fixedInitialYearRentErrors = get(errors, `${field}.fixed_initial_year_rents`),
    contractRentErrors = get(errors, `${field}.contract_rents`),
    rentAdjustmentsErrors = get(errors, `${field}.rent_adjustments`),
    active = isRentActive(savedRent),
    archived = isRentArchived(savedRent);

  return (
    <Collapse
      className={classNames({'archived': archived})}
      defaultOpen={rentCollapseState !== undefined ? rentCollapseState : active}
      hasErrors={isSaveClicked && !isEmpty(rentErrors)}
      headerTitle={<h3 className='collapse__header-title'>{getLabelOfOption(typeOptions, get(savedRent, 'type')) || '-'}</h3>}
      header={
        <div>
          <Column small={10}>
            <span className='collapse__header-subtitle'>
              {formatDateRange(get(savedRent, 'start_date'), get(savedRent, 'end_date')) || '-'}
            </span>
          </Column>
        </div>
      }
      onRemove={handleRemove}
      onToggle={handleRentCollapseToggle}
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
          headerTitle={<h3 className='collapse__header-title'>Kiinteä alkuvuosivuokra</h3>}
          onToggle={handleFixedInitialYearRentsCollapseToggle}
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
          headerTitle={<h3 className='collapse__header-title'>Sopimusvuokra</h3>}
          onToggle={handleContractRentsCollapseToggle}
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

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={indexAdjustedRentsCollapseState !== undefined ? indexAdjustedRentsCollapseState : false}
          headerTitle={<h3 className='collapse__header-title'>Indeksitarkistettu vuokra</h3>}
          onToggle={handleIndexAdjustedRentsCollapseToggle}
        >
          <IndexAdjustedRents
            indexAdjustedRents={get(savedRent, 'index_adjusted_rents', [])}
          />
        </Collapse>
      }

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.FIXED ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={rentAdjustmentsCollapseState !== undefined ? rentAdjustmentsCollapseState : false}
          hasErrors={isSaveClicked && !isEmpty(rentAdjustmentsErrors)}
          headerTitle={<h3 className='collapse__header-title'>Alennukset ja korotukset</h3>}
          onToggle={handleRentAdjustmentsCollapseToggle}
        >
          <FieldArray
            component={RentAdjustmentsEdit}
            isSaveClicked={isSaveClicked}
            name={`${field}.rent_adjustments`}
          />
        </Collapse>
      }

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.FIXED ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={payableRentsCollapseState !== undefined ? payableRentsCollapseState : false}
          headerTitle={<h3 className='collapse__header-title'>Perittävä vuokra</h3>}
          onToggle={handlePayableRentsCollapseToggle}
        >
          <PayableRents
            payableRents={get(savedRent, 'payable_rents', [])}
          />
        </Collapse>
      }
    </Collapse>
  );
};

const formName = FormNames.RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    if(id) {
      return {
        attributes: getAttributes(state),
        contractRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.contract_rents`),
        errors: getErrorsByFormName(state, formName),
        fixedInitialYearRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.fixed_initial_year_rents`),
        indexAdjustedRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.index_adjusted_rents`),
        isSaveClicked: getIsSaveClicked(state),
        payableRentsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.payable_rents`),
        rentAdjustmentsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.rent_adjustments`),
        rentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.RENTS}.${id}.rent`),
        rentId: id,
        rentType: selector(state, `${props.field}.type`),
      };
    }
    return {
      attributes: getAttributes(state),
      dueDatesType: selector(state, `${props.field}.due_dates_type`),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      rentId: id,
      rentType: selector(state, `${props.field}.type`),
    };
  },
  {
    receiveCollapseStates,
  }
)(RentItemEdit);
