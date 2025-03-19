import React, { Fragment, PureComponent } from "react";
import { Row, Column } from "react-foundation";
import {
  getCurrentLeaseStartDate,
  getAttributes as getLeaseAttributes,
} from "@/leases/selectors";
import { flowRight } from "lodash";
import { connect } from "react-redux";
import type { PeriodicRentAdjustmentType } from "@/leases/types";
import type {
  OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps,
  IndexPointFigureYearly as IndexPointFigureYearlyProps,
} from "@/oldDwellingsInHousingCompaniesPriceIndex/types";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import { withWindowResize } from "@/components/resize/WindowResizeHandler";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  LeaseFieldTitles,
  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths,
  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles,
  LeaseRentsFieldPaths,
  periodicRentAdjustmentTypes,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate } from "@/util/helpers";
import { getReviewDays, getPointFigureFormText } from "@/leases/helpers";

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps;
  periodicRentAdjustmentType: PeriodicRentAdjustmentType;
  leaseStartDate: string;
  startPriceIndexPointFigureValue: number | undefined;
  startPriceIndexPointFigureYear: number | undefined;
};

class OldDwellingsInHousingCompaniesPriceIndexView extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex,
      periodicRentAdjustmentType,
      leaseStartDate,
      startPriceIndexPointFigureValue,
      startPriceIndexPointFigureYear,
    } = this.props;
    const {
      point_figures: pointFigures,
      source_table_label: sourceTableLabel,
    } = oldDwellingsInHousingCompaniesPriceIndex || {};
    return (
      <Fragment>
        <BoxItemContainer>
          <Row>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentsFieldPaths.PERIODIC_RENT_ADJUSTMENT_TYPE,
                )}
              >
                {
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.TYPE
                }
              </FormTextTitle>
              <FormText>
                {periodicRentAdjustmentTypes[periodicRentAdjustmentType]}
              </FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.START_DATE,
                )}
              >
                {LeaseFieldTitles.START_DATE}
              </FormTextTitle>
              <FormText>{formatDate(leaseStartDate)}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.POINT_FIGURES,
                )}
              >
                {
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.POINT_FIGURES
                }
              </FormTextTitle>
              <FormText>
                {getPointFigureFormText(
                  pointFigures,
                  leaseStartDate,
                  startPriceIndexPointFigureYear,
                  startPriceIndexPointFigureValue,
                )}
              </FormText>
              <FormText>{sourceTableLabel}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.REVIEW_DAYS,
                )}
              >
                {
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS
                }
              </FormTextTitle>
              <>
                {leaseStartDate
                  ? getReviewDays(
                      leaseStartDate,
                      periodicRentAdjustmentType,
                    ).map((date: string, index: number) => {
                      return (
                        <FormText
                          key={
                            LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS +
                            `[${index}]`
                          }
                        >
                          {date}
                        </FormText>
                      );
                    })
                  : ""}
              </>
            </Column>
          </Row>
        </BoxItemContainer>
      </Fragment>
    );
  }
}

export default flowRight(
  withWindowResize,
  connect((state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
      leaseStartDate: getCurrentLeaseStartDate(state),
    };
  }),
)(OldDwellingsInHousingCompaniesPriceIndexView);
