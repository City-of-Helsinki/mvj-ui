// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {formatNumber} from '$src/util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getVats} from '$src/vat/selectors';

import type {VatList} from '$src/vat/types';

type Props = {
  amount: number,
  date: string,
  isSubjectToVat: boolean,
  vats: VatList,
}

class AmountWithVat extends PureComponent<Props> {
  displayName: 'test'

  getVatPercent = () => {
    const {date, vats} = this.props;

    const vat = vats.find((vat) => {
      return ((!vat.end_date || moment(vat.end_date).isSameOrAfter(date, 'day')) &&
        (!vat.start_date || moment(vat.start_date).isSameOrBefore(date, 'day'))
      );
    });

    if(vat) {
      return vat.percent;
    }
    return 0;
  };

  render() {


    const {
      amount,
      isSubjectToVat,
    } = this.props;
    const vatPercent = this.getVatPercent();
    const amountWithVat = (1 + vatPercent/100) * amount;

    return <span>{isSubjectToVat
      ? `${formatNumber(amount)} € / ${formatNumber(amountWithVat)} € (alv ${vatPercent}%)`
      : `${formatNumber(amount)} €`
    }</span>;
  }
}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      isSubjectToVat: currentLease.is_subject_to_vat,
      vats: getVats(state),
    };
  }
)(AmountWithVat);
