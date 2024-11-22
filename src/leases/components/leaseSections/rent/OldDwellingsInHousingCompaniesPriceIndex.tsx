import React, { Fragment, PureComponent } from 'react';
import { Row, Column } from "react-foundation";
import { getCurrentLeaseStartDate, getAttributes as getLeaseAttributes } from '@/leases/selectors';
import { flowRight } from 'lodash';
import { connect } from 'react-redux';
import type { 
  OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps,
  IndexNumberYearly as IndexNumberYearlyProps,
} from '@/leases/types';
import BoxItemContainer from '@/components/content/BoxItemContainer';
import { withWindowResize } from '@/components/resize/WindowResizeHandler';
import FormText from "@/components/form/FormText";
import FormTextTitle from '@/components/form/FormTextTitle';
import { LeaseFieldTitles, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles } from '@/leases/enums';
import Authorization from '@/components/authorization/Authorization';
import { getUiDataLeaseKey } from '@/uiData/helpers';
import { formatDate } from '../../../../util/helpers';

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps;
  leaseStartDate: string;
};

const getLastYearsIndexPointNumber = (annualIndexNumbers: IndexNumberYearlyProps[]): string => {
  const lastYear = new Date().getFullYear() - 1;
  const lastYearIndex = annualIndexNumbers.find((x: IndexNumberYearlyProps) => x.year == lastYear);
  return lastYearIndex ? `${lastYearIndex.year} * ${lastYearIndex.number}` : '';
}

const getReviewDaysSorted = (annualIndexNumbers: IndexNumberYearlyProps[]): IndexNumberYearlyProps[] => {
  // deep copy
  const sortedNumbers = JSON.parse(JSON.stringify(annualIndexNumbers));
  
  sortedNumbers.sort((a: IndexNumberYearlyProps, b: IndexNumberYearlyProps) => a.year - b.year);
  return sortedNumbers;
}

class OldDwellingsInHousingCompaniesPriceIndex extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex: {
        name,
        numbers,
        source_table_label: sourceTableLabel,
      },
      leaseStartDate
    } = this.props;
    return <Fragment>
      <BoxItemContainer>
        <Row>
          <Column>
            <Authorization allow={true/*isFieldAllowedToRead(leaseAttributes, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NAME)*/}>
              <>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NAME)}>
                  {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.NAME}
                </FormTextTitle>
                <FormText>{name}</FormText>
              </>
            </Authorization>
          </Column>
          <Column>
          <Authorization allow={true/*isFieldAllowedToRead(leaseAttributes, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NAME)*/}>
              <>
                <FormTextTitle>
                  {LeaseFieldTitles.START_DATE}
                </FormTextTitle>
                <FormText>{formatDate(leaseStartDate)}</FormText>
              </>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={true/*isFieldAllowedToRead(leaseAttributes, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NAME)*/}>
              <>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS)}>
                  {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.NUMBERS}
                </FormTextTitle>
                <FormText>{getLastYearsIndexPointNumber(numbers)}</FormText>
                <FormText>{sourceTableLabel}</FormText>
              </>
            </Authorization>

          </Column>
          <Column>
            <Authorization allow={true/*isFieldAllowedToRead(leaseAttributes, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NAME)*/}>
              <>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS)}>
                  {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS}
                </FormTextTitle>
                  <>
                    {numbers && !!numbers.length ? 
                      getReviewDaysSorted(numbers).map(
                        (number: IndexNumberYearlyProps, index: number) => {
                          return <FormText key={LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS + `[${index}]`}>
                            {`1.1.${number.year}`}
                          </FormText>
                        }
                      )
                      : ""}
                  </>
              </>
            </Authorization>
          </Column>
        </Row>
      </BoxItemContainer>
    </Fragment>
  }
}

export default flowRight(withWindowResize, connect(state => {
  return {
    leaseAttributes: getLeaseAttributes(state),
    leaseStartDate: getCurrentLeaseStartDate(state)
  };
}))(OldDwellingsInHousingCompaniesPriceIndex);