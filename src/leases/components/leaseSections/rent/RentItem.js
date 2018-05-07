// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';
import get from 'lodash/get';
import classNames from 'classnames';

import BasicInfo from './BasicInfo';
import Collapse from '$components/collapse/Collapse';
import ContractRents from './ContractRents';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustments from './RentAdjustments';
import {RentTypes} from '$src/leases/enums';
import {isRentActive} from '$src/leases/helpers';
import {formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  rent: Object,
}

type State = {
  isActive: boolean,
}

class RentItem extends Component<Props, State> {
  componentWillMount() {
    const {rent} = this.props;
    this.setState({isActive: isRentActive(rent)});
  }

  render() {
    const {attributes, rent} = this.props;
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

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(RentItem);
