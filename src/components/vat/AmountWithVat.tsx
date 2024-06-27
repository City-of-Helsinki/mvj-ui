import React, { PureComponent } from "react";
import { connect } from "react-redux";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import { formatNumber } from "util/helpers";
import { getCurrentLease } from "/src/leases/selectors";
import { getVats } from "vat/selectors";
import type { VatList } from "vat/types";
type Props = {
  amount: number;
  date: string;
  isSubjectToVat: boolean;
  vats: VatList;
};

class AmountWithVat extends PureComponent<Props> {
  displayName: "test";
  getVatPercent = () => {
    const {
      date,
      vats
    } = this.props;
    const vat = vats.find(vat => {
      return (!vat.end_date || !isAfter(new Date(date), new Date(vat.end_date))) && (!vat.start_date || !isBefore(new Date(date), new Date(vat.start_date)));
    });

    if (vat) {
      return vat.percent;
    }

    return 0;
  };

  render() {
    const {
      amount,
      isSubjectToVat
    } = this.props;
    const vatPercent = this.getVatPercent();
    const amountWithVat = (1 + vatPercent / 100) * amount;
    return <span>{isSubjectToVat ? `${formatNumber(amount)} € / ${formatNumber(amountWithVat)} € (alv ${vatPercent}%)` : `${formatNumber(amount)} €`}</span>;
  }

}

export default connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    isSubjectToVat: currentLease.is_subject_to_vat,
    vats: getVats(state)
  };
})(AmountWithVat);