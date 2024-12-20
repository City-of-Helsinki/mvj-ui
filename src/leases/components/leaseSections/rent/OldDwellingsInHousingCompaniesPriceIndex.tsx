import React, { Fragment, PureComponent } from 'react';
import { Row, Column } from "react-foundation";
import { getCurrentLeaseStartDate, getAttributes as getLeaseAttributes } from '@/leases/selectors';
import { flowRight } from 'lodash';
import { connect } from 'react-redux';
import type { 
  OldDwellingsInHousingCompaniesPriceIndexType,
} from '@/leases/types';
import type { 
  OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps,
  IndexPointFigureYearly as IndexPointFigureYearlyProps,
} from '@/oldDwellingsInHousingCompaniesPriceIndex/types';
import BoxItemContainer from '@/components/content/BoxItemContainer';
import { withWindowResize } from '@/components/resize/WindowResizeHandler';
import FormText from "@/components/form/FormText";
import FormTextTitle from '@/components/form/FormTextTitle';
import { LeaseFieldTitles, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths, LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles, LeaseRentsFieldPaths, oldDwellingsInHousingCompaniesPriceIndexTypes } from '@/leases/enums';
import { getUiDataLeaseKey } from '@/uiData/helpers';
import { formatDate } from '@/util/helpers';
import { getReviewDays } from '@/leases/helpers';

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps;
  oldDwellingsInHousingCompaniesPriceIndexType: OldDwellingsInHousingCompaniesPriceIndexType;
  leaseStartDate: string;
};

const getLastYearsIndexPointNumber = (pointFigures: IndexPointFigureYearlyProps[]): string => {
  const lastYear = new Date().getFullYear() - 1;
  const lastYearIndex = pointFigures?.find((x: IndexPointFigureYearlyProps) => x.year == lastYear) || null;
  return lastYearIndex ? `${lastYearIndex.year} * ${lastYearIndex.value}` : 'Indeksipisteluvut puuttuvat';
}

class OldDwellingsInHousingCompaniesPriceIndexView extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex,
      oldDwellingsInHousingCompaniesPriceIndexType,
      leaseStartDate
    } = this.props;
    const {
      point_figures: pointFigures,
      source_table_label: sourceTableLabel
    } = oldDwellingsInHousingCompaniesPriceIndex || {};
    return <Fragment>
      <BoxItemContainer>
        <Row>
          <Column>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX_TYPE)}>
              {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{oldDwellingsInHousingCompaniesPriceIndexTypes[oldDwellingsInHousingCompaniesPriceIndexType]}</FormText>
          </Column>
          <Column>
            <FormTextTitle>
              {LeaseFieldTitles.START_DATE}
            </FormTextTitle>
            <FormText>{formatDate(leaseStartDate)}</FormText>
          </Column>
          <Column>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.POINT_FIGURES)}>
              {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.POINT_FIGURES}
            </FormTextTitle>
            <FormText>{getLastYearsIndexPointNumber(pointFigures)}</FormText>
            <FormText>{sourceTableLabel}</FormText>
          </Column>
          <Column>
                <FormTextTitle>
                  {LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS}
                </FormTextTitle>
                  <>
                    {leaseStartDate ? 
                      getReviewDays(leaseStartDate, oldDwellingsInHousingCompaniesPriceIndexType).map(
                        (date: string, index: number) => {
                          return <FormText key={LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS + `[${index}]`}>
                            {date}
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