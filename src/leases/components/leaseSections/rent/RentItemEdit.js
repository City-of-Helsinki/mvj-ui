// @flow
import React, {Component} from 'react';
import {FieldArray, FormSection} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import classNames from 'classnames';
import moment from 'moment';

import AddButton from '$components/form/AddButton';
import BasicInfoEdit from './BasicInfoEdit';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContractRentsEdit from './ContractRentsEdit';
import Collapse from '$components/collapse/Collapse';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RemoveButton from '$components/form/RemoveButton';
import RentAdjustmentsEdit from './RentAdjustmentsEdit';
import {RentTypes} from '$src/leases/enums';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  fields: any,
  rentsFormValues: Array<Object>,
}

class RentItemEdit extends Component {
  props: Props

  isRentActive = (rent: Object) => {
    const now = moment();
    const startDate = get(rent, 'start_date');
    const endDate = get(rent, 'end_date');
    if(startDate && now.isSameOrAfter(startDate) && endDate && moment(endDate).isSameOrAfter(now)) {
      return true;
    }
    return false;
  }

  render() {
    const {attributes, decisionOptions, fields, rentsFormValues} = this.props;

    return (
      <div>
        {fields && !!fields.length &&
          fields.map((item, index) => {
            const rent = get(rentsFormValues, item);
            const rentType = get(rentsFormValues, `${item}.type`);

            return (
              <Collapse
                key={item.id ? item.id : `index_${index}`}
                className={classNames({'not-active': !this.isRentActive(rent)})}
                defaultOpen={true}
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
                      attributes={attributes}
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
                    headerTitle={
                      <h3 className='collapse__header-title'>Sopimusvuokra</h3>
                    }>
                    <FieldArray
                      attributes={attributes}
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
                      attributes={attributes}
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
                    headerTitle={
                      <h3 className='collapse__header-title'>Alennukset ja korotukset</h3>
                    }>
                    <FieldArray
                      attributes={attributes}
                      component={RentAdjustmentsEdit}
                      decisionOptions={decisionOptions}
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
              label='Lisää uusi vuokra'
              onClick={() => fields.push({})}
              title='Lisää uusi vuokra'
            />
          </Column>
        </Row>
      </div>
    );
  }
}

export default RentItemEdit;
