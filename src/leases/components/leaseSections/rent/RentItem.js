// @flow
import React, {Component} from 'react';
import {Column} from 'react-foundation';
import get from 'lodash/get';

import BasicInfo from './BasicInfo';
import Collapse from '$components/collapse/Collapse';
import ContractRents from './ContractRents';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustments from './RentAdjustments';
import {RentTypes} from '$src/leases/enums';
import {formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  rent: Object,
}

class RentItem extends Component {
  props: Props

  render() {
    const {attributes, decisionOptions, rent} = this.props;
    const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
    const rentType = get(rent, 'type');

    return (
      <Collapse
        defaultOpen={true}
        header={
          <div>
            <Column>
              <span className='collapse__header-subtitle'>
                {formatDateRange(rent.start_date, rent.end_date) || '-'}
              </span>
            </Column>
          </div>
        }
        headerTitle={
          <h3 className='collapse__header-title'>{getLabelOfOption(typeOptions, rentType) || '-'}</h3>
        }>
        <BasicInfo
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />

        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.FIXED ||
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>Sopimusvuokra</h3>
            }>
            <ContractRents
              attributes={attributes}
              contractRents={get(rent, 'contract_rents', [])}
              rentType={rentType}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
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
          rentType === RentTypes.MANUAL) &&
          <Collapse
            className='collapse__secondary'
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>Alennukset ja korotukset</h3>
            }>
            <RentAdjustments
              attributes={attributes}
              decisionOptions={decisionOptions}
              rentAdjustments={get(rent, 'rent_adjustments', [])}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.FIXED ||
          rentType === RentTypes.MANUAL) &&
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
  }
}

export default RentItem;
