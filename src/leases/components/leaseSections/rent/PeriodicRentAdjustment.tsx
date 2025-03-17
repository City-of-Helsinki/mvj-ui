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
  PeriodicRentAdjustmentPriceIndex as PeriodicRentAdjustmentPriceIndexProps,
  IndexPointFigureYearly as IndexPointFigureYearlyProps,
} from "@/periodicRentAdjustmentPriceIndex/types";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import { withWindowResize } from "@/components/resize/WindowResizeHandler";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  LeaseFieldTitles,
  LeaseRentPeriodicRentAdjustmentPriceIndexFieldPaths,
  LeaseRentPeriodicRentAdjustmentFieldTitles,
  LeaseRentPeriodicRentAdjustmentFieldPaths,
  periodicRentAdjustmentTypes,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate } from "@/util/helpers";
import { getReviewDays } from "@/leases/helpers";

type Props = {
  priceIndex: PeriodicRentAdjustmentPriceIndexProps;
  adjustmentType: PeriodicRentAdjustmentType;
  leaseStartDate: string;
};

const getLastYearsIndexPointFigureText = (
  pointFigures: IndexPointFigureYearlyProps[],
): string => {
  // TODO not absolute previous year, but year previous to lease start date.
  const lastYear = new Date().getFullYear() - 1;
  const lastYearIndex =
    pointFigures?.find(
      (x: IndexPointFigureYearlyProps) => x.year == lastYear,
    ) || null;
  return lastYearIndex
    ? `${lastYearIndex.year} * ${lastYearIndex.value}`
    : "Viime vuoden indeksipisteluku puuttuu";
};

class PeriodicRentAdjustmentPriceIndexView extends PureComponent<Props> {
  render() {
    const { priceIndex, adjustmentType, leaseStartDate } = this.props;
    const {
      point_figures: pointFigures,
      source_table_label: sourceTableLabel,
    } = priceIndex || {};
    // TODO get point figure value and starting year from point_figures,
    //      and save it wherever needed in order to send them to API when saving.
    return (
      <Fragment>
        <BoxItemContainer>
          <Row>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentPeriodicRentAdjustmentFieldPaths.ADJUSTMENT_TYPE,
                )}
              >
                {LeaseRentPeriodicRentAdjustmentFieldTitles.ADJUSTMENT_TYPE}
              </FormTextTitle>
              <FormText>{periodicRentAdjustmentTypes[adjustmentType]}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentPeriodicRentAdjustmentFieldPaths.START_DATE,
                )}
              >
                {LeaseFieldTitles.START_DATE}
              </FormTextTitle>
              <FormText>{formatDate(leaseStartDate)}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentPeriodicRentAdjustmentPriceIndexFieldPaths.POINT_FIGURES,
                )}
              >
                {
                  LeaseRentPeriodicRentAdjustmentFieldTitles.STARTING_POINT_FIGURE
                }
              </FormTextTitle>
              <FormText>
                {getLastYearsIndexPointFigureText(pointFigures)}
              </FormText>
              <FormText>{sourceTableLabel}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentPeriodicRentAdjustmentFieldPaths.REVIEW_DAYS,
                )}
              >
                {LeaseRentPeriodicRentAdjustmentFieldTitles.REVIEW_DAYS}
              </FormTextTitle>
              <>
                {leaseStartDate && adjustmentType
                  ? getReviewDays(leaseStartDate, adjustmentType).map(
                      (date: string, index: number) => {
                        return (
                          <FormText
                            key={
                              LeaseRentPeriodicRentAdjustmentFieldTitles.REVIEW_DAYS +
                              `[${index}]`
                            }
                          >
                            {date}
                          </FormText>
                        );
                      },
                    )
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
)(PeriodicRentAdjustmentPriceIndexView);
