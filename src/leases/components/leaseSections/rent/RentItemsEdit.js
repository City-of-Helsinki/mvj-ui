// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, FormSection, getFormValues} from 'redux-form';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';


import AddButton from '$components/form/AddButton';
import BasicInfoEdit from './BasicInfoEdit';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContractRentsEdit from './ContractRentsEdit';
import Collapse from '$components/collapse/Collapse';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RemoveButton from '$components/form/RemoveButton';
import RentAdjustmentsEdit from './RentAdjustmentsEdit';
import {FormNames, RentTypes} from '$src/leases/enums';
import {isRentActive} from '$src/leases/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  enableAddButton: boolean,
  errors: ?Object,
  fields: any,
  formValues: Array<Object>,
  isSaveClicked: boolean,
  rents: Array<Object>,
}

const RentItemsEdit = ({
  attributes,
  enableAddButton = true,
  errors,
  fields,
  formValues,
  isSaveClicked,
  rents,
}: Props) =>  {
  const getRentById = (id: number) => {
    if(!id) {
      return {};
    }

    return rents.find((rent) => rent.id === id);
  };

  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      {fields && !!fields.length &&
        fields.map((item, index) => {
          const rent = get(formValues, item);
          const rentType = get(formValues, `${item}.type`);
          const rentErrors = get(errors, item);
          const savedRent = getRentById(get(formValues, `${item}.id`));
          const contractRentErrors = get(errors, `${item}.contract_rents`);
          const rentAdjustmentsErrors = get(errors, `${item}.rent_adjustments`);

          return (
            <Collapse
              key={item.id ? item.id : `index_${index}`}
              className={classNames({'not-active': !isRentActive(savedRent)})}
              defaultOpen={true}
              hasErrors={isSaveClicked && !isEmpty(rentErrors)}
              headerTitle={
                <h3 className='collapse__header-title'>{getLabelOfOption(typeOptions, get(savedRent, 'type')) || '-'}</h3>
              }>
              <FormSection name={item}>
                <BoxContentWrapper>
                  <RemoveButton
                    className='position-topright-no-padding'
                    onClick={() => fields.remove(index)}
                    title="Poista alennus/korotus"
                  />
                  <BasicInfoEdit
                    isSaveClicked={isSaveClicked}
                    rent={rent}
                    rentType={rentType}
                  />
                </BoxContentWrapper>

              </FormSection>

              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.FIXED ||
                rentType === RentTypes.MANUAL
              ) &&
                <Collapse
                  className='collapse__secondary'
                  defaultOpen={true}
                  hasErrors={isSaveClicked && !isEmpty(contractRentErrors)}
                  headerTitle={
                    <h3 className='collapse__header-title'>Sopimusvuokra</h3>
                  }>
                  <FieldArray
                    component={ContractRentsEdit}
                    isSaveClicked={isSaveClicked}
                    name={`${item}.contract_rents`}
                    rentType={rentType}
                  />
                </Collapse>
              }

              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL
              ) &&
                <Collapse
                  className='collapse__secondary'
                  defaultOpen={true}
                  headerTitle={
                    <h3 className='collapse__header-title'>Indeksitarkistettu vuokra</h3>
                  }>
                  <IndexAdjustedRents
                    indexAdjustedRents={get(rent, 'index_adjusted_rents', [])}
                  />
                </Collapse>
              }

              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.FIXED ||
                rentType === RentTypes.MANUAL
              ) &&
                <Collapse
                  className='collapse__secondary'
                  defaultOpen={true}
                  hasErrors={isSaveClicked && !isEmpty(rentAdjustmentsErrors)}
                  headerTitle={
                    <h3 className='collapse__header-title'>Alennukset ja korotukset</h3>
                  }>
                  <FieldArray
                    component={RentAdjustmentsEdit}
                    isSaveClicked={isSaveClicked}
                    name={`${item}.rent_adjustments`}
                  />
                </Collapse>
              }

              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.FIXED ||
                rentType === RentTypes.MANUAL
              ) &&
                <Collapse
                  className='collapse__secondary'
                  defaultOpen={true}
                  headerTitle={
                    <h3 className='collapse__header-title'>Perittävä vuokra</h3>
                  }>
                  <PayableRents
                    payableRents={get(rent, 'payable_rents', [])}
                  />
                </Collapse>
              }
            </Collapse>
          );
        })
      }
      {enableAddButton &&
        <Row>
          <Column>
            <AddButton
              label='Lisää vuokra'
              onClick={() => fields.push({})}
              title='Lisää vuokra'
            />
          </Column>
        </Row>
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      formValues: getFormValues(FormNames.RENTS)(state),
    };
  },
)(RentItemsEdit);
