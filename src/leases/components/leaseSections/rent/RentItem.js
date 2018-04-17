// @flow
import React, {Component} from 'react';
import {Column} from 'react-foundation';
import get from 'lodash/get';
import classNames from 'classnames';
import moment from 'moment';

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

type State = {
  isActive: boolean,
}

class RentItem extends Component {
  props: Props
  state: State

  componentWillMount() {
    this.setState({isActive: this.isRentActive()});
  }

  isRentActive = () => {
    const {rent} = this.props;
    const now = moment();
    const startDate = get(rent, 'start_date');
    const endDate = get(rent, 'end_date');

    if(startDate && now.isSameOrAfter(startDate) && endDate && moment(endDate).isSameOrAfter(now)) {
      return true;
    }

    return false;
  }

  render() {
    const {attributes, decisionOptions, rent} = this.props;
    const {isActive} = this.state;
    const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
    const rentType = get(rent, 'type');

    return (
      <Collapse
        className={classNames({'not-active': !isActive})}
        defaultOpen={!!isActive}
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
              <h4 className='collapse__header-title'>Sopimusvuokra</h4>
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
              <h4 className='collapse__header-title'>Indeksitarkistettu vuokra</h4>
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
              <h4 className='collapse__header-title'>Alennukset ja korotukset</h4>
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
              <h4 className='collapse__header-title'>Perittävä vuokra</h4>
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
