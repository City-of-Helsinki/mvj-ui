// @flow
import React, {Component} from 'react';
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
import {isRentActive} from '$src/leases/helpers';
import {FormNames, RentTypes} from '$src/leases/enums';

type Props = {
  errors: ?Object,
  fields: any,
  formValues: Array<Object>,
}

class RentItemEdit extends Component<Props> {
  render() {
    const {errors, fields, formValues} = this.props;

    return (
      <div>
        {fields && !!fields.length &&
          fields.map((item, index) => {
            const rent = get(formValues, item);
            const rentType = get(formValues, `${item}.type`);
            const rentErrors = get(errors, item);
            const contractRentErrors = get(errors, `${item}.contract_rents`);
            const rentAdjustmentsErrors = get(errors, `${item}.rent_adjustments`);

            return (
              <Collapse
                key={item.id ? item.id : `index_${index}`}
                className={classNames({'not-active': !isRentActive(rent)})}
                defaultOpen={true}
                hasErrors={!isEmpty(rentErrors)}
                headerTitle={
                  <h3 className='collapse__header-title'>Vuokra {index + 1}</h3>
                }>
                <FormSection name={item}>
                  <BoxContentWrapper>
                    <RemoveButton
                      className='position-topright-no-padding'
                      onClick={() => fields.remove(index)}
                      title="Poista alennus/korotus"
                    />
                    <BasicInfoEdit
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
                    hasErrors={!isEmpty(contractRentErrors)}
                    headerTitle={
                      <h3 className='collapse__header-title'>Sopimusvuokra</h3>
                    }>
                    <FieldArray
                      component={ContractRentsEdit}
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
                    hasErrors={!isEmpty(rentAdjustmentsErrors)}
                    headerTitle={
                      <h3 className='collapse__header-title'>Alennukset ja korotukset</h3>
                    }>
                    <FieldArray
                      component={RentAdjustmentsEdit}
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
        <Row>
          <Column>
            <AddButton
              label='Lisää vuokra'
              onClick={() => fields.push({})}
              title='Lisää vuokra'
            />
          </Column>
        </Row>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      formValues: getFormValues(FormNames.RENTS)(state),
    };
  },
)(RentItemEdit);
