// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, FormSection} from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BasicInfoEdit from './BasicInfoEdit';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContractRentsEdit from './ContractRentsEdit';
import Collapse from '$components/collapse/Collapse';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustmentsEdit from './RentAdjustmentsEdit';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, RentTypes} from '$src/leases/enums';
import {isRentActive} from '$src/leases/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contractRentsCollapseState: boolean,
  dueDatesType: ?string,
  errors: ?Object,
  field: string,
  index: number,
  indexAdjustedRentsCollapseState: boolean,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
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
  dueDatesType,
  errors,
  field,
  index,
  indexAdjustedRentsCollapseState,
  isSaveClicked,
  onOpenDeleteModal,
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
    contractRentErrors = get(errors, `${field}.contract_rents`),
    rentAdjustmentsErrors = get(errors, `${field}.rent_adjustments`),
    isActive = isRentActive(savedRent);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={rentCollapseState !== undefined ? rentCollapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(rentErrors)}
      headerTitle={<h3 className='collapse__header-title'>{getLabelOfOption(typeOptions, get(savedRent, 'type')) || '-'}</h3>}
      onRemove={handleRemove}
      onToggle={handleRentCollapseToggle}
    >
      <FormSection name={field}>
        <BoxContentWrapper>
          <BasicInfoEdit
            dueDatesType={dueDatesType}
            isSaveClicked={isSaveClicked}
            onOpenDeleteModal={onOpenDeleteModal}
            rentType={rentType}
          />
        </BoxContentWrapper>
      </FormSection>

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
            onOpenDeleteModal={onOpenDeleteModal}
            rentType={rentType}
          />
        </Collapse>
      }

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={indexAdjustedRentsCollapseState !== undefined ? indexAdjustedRentsCollapseState : true}
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
          defaultOpen={rentAdjustmentsCollapseState !== undefined ? rentAdjustmentsCollapseState : true}
          hasErrors={isSaveClicked && !isEmpty(rentAdjustmentsErrors)}
          headerTitle={<h3 className='collapse__header-title'>Alennukset ja korotukset</h3>}
          onToggle={handleRentAdjustmentsCollapseToggle}
        >
          <FieldArray
            component={RentAdjustmentsEdit}
            isSaveClicked={isSaveClicked}
            name={`${field}.rent_adjustments`}
            onOpenDeleteModal={onOpenDeleteModal}
          />
        </Collapse>
      }

      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.FIXED ||
        rentType === RentTypes.MANUAL) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={payableRentsCollapseState !== undefined ? payableRentsCollapseState : true}
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
        dueDatesType: selector(state, `${props.field}.due_dates_type`),
        errors: getErrorsByFormName(state, formName),
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
