import React, { Fragment, PureComponent } from 'react';
import { Row, Column } from "react-foundation";
import { getCurrentLeaseStartDate, getAttributes as getLeaseAttributes } from '@/leases/selectors';
import { flowRight } from 'lodash';
import { connect } from 'react-redux';
import type { 
  OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps,
  IndexPointFigureYearly as IndexPointFigureYearlyProps,
} from '@/leases/types';
import BoxItemContainer from '@/components/content/BoxItemContainer';
import { withWindowResize } from '@/components/resize/WindowResizeHandler';
import FormText from "@/components/form/FormText";
import FormTextTitle from '@/components/form/FormTextTitle';
import { LeaseFieldTitles, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles } from '@/leases/enums';
import { getUiDataLeaseKey } from '@/uiData/helpers';
import { formatDate } from '@/util/helpers';

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps;
  leaseStartDate: string;
};

const getLastYearsIndexPointNumber = (pointFigures: IndexPointFigureYearlyProps[]): string => {
  const lastYear = new Date().getFullYear() - 1;
  const lastYearIndex = pointFigures?.find((x: IndexPointFigureYearlyProps) => x.year == lastYear) || null;
  return lastYearIndex ? `${lastYearIndex.year} * ${lastYearIndex.value}` : 'Indeksipisteluvut puuttuvat';
}

const getReviewDaysSorted = (pointFigures: IndexPointFigureYearlyProps[]): IndexPointFigureYearlyProps[] => {
  // deep copy
  const sortedNumbers = JSON.parse(JSON.stringify(pointFigures));
  
  sortedNumbers.sort((a: IndexPointFigureYearlyProps, b: IndexPointFigureYearlyProps) => a.year - b.year);
  return sortedNumbers;
}

class OldDwellingsInHousingCompaniesPriceIndexView extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex,
      leaseStartDate
    } = this.props;
    const {
      name,
      point_figures: pointFigures,
      source_table_label: sourceTableLabel
    } = oldDwellingsInHousingCompaniesPriceIndex || {};
    return <Fragment>
      <BoxItemContainer>
        <Row>
          <Column>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NAME)}>
              {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.NAME}
            </FormTextTitle>
            <FormText>{name}</FormText>
          </Column>
          <Column>
            <FormTextTitle>
              {LeaseFieldTitles.START_DATE}
            </FormTextTitle>
            <FormText>{formatDate(leaseStartDate)}</FormText>
          </Column>
          <Column>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS)}>
              {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.NUMBERS}
            </FormTextTitle>
            <FormText>{getLastYearsIndexPointNumber(pointFigures)}</FormText>
            <FormText>{sourceTableLabel}</FormText>
          </Column>
          <Column>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS)}>
                  {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS}
                </FormTextTitle>
                  <>
                    {pointFigures && !!pointFigures.length ? 
                      getReviewDaysSorted(pointFigures).map(
                        (number: IndexPointFigureYearlyProps, index: number) => {
                          return <FormText key={LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS + `[${index}]`}>
                            {`1.1.${number.year}`}
                          </FormText>
                        }
                      )
                      : ""}
                  </>
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
}))(OldDwellingsInHousingCompaniesPriceIndexView);