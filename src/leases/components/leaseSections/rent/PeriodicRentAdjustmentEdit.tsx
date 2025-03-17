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
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, getFieldAttributes } from "@/util/helpers";
import FormField from "@/components/form/FormField";
import { Attributes } from "@/types";
import { getReviewDays } from "@/leases/helpers";
import AddButton from "@/components/form/AddButton";

type Props = {
  priceIndex: PeriodicRentAdjustmentPriceIndexProps | null;
  adjustmentType: PeriodicRentAdjustmentType;
  addPeriodicRentAdjustmentPriceIndex: () => void;
  field: string;
  leaseAttributes: Attributes;
  leaseStartDate: string;
  isSaveClicked: boolean;
};

const getLastYearsIndexPointFigure = (
  pointFigures: IndexPointFigureYearlyProps[],
): string => {
  const lastYear = new Date().getFullYear() - 1;
  const lastYearsFigure =
    pointFigures?.find(
      (x: IndexPointFigureYearlyProps) => x.year == lastYear,
    ) || null;
  return lastYearsFigure
    ? `${lastYearsFigure.year} * ${lastYearsFigure.value}`
    : "Viime vuoden indeksipisteluku puuttuu";
};

class PeriodicRentAdjustmentEdit extends PureComponent<Props> {
  render() {
    const {
      priceIndex,
      adjustmentType,
      addPeriodicRentAdjustmentPriceIndex,
      field,
      leaseAttributes,
      leaseStartDate,
      isSaveClicked,
    } = this.props;

    const {
      point_figures: pointFigures,
      source_table_label: sourceTableLabel,
    } = priceIndex || {};
    return priceIndex ? (
      <Fragment>
        <BoxItemContainer>
          <Row>
            <Column>
              <FormField
                // FIXME changing this value doesn't update review days
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentPeriodicRentAdjustmentFieldPaths.ADJUSTMENT_TYPE,
                )}
                name={`${field}.periodic_rent_adjustment.adjustment_type`}
                overrideValues={{
                  label:
                    LeaseRentPeriodicRentAdjustmentFieldTitles.ADJUSTMENT_TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentPeriodicRentAdjustmentFieldPaths.ADJUSTMENT_TYPE,
                )}
              />
            </Column>
            <Column>
              <FormTextTitle
                enableUiDataEdit
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
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentPeriodicRentAdjustmentFieldPaths.STARTING_POINT_FIGURE_VALUE,
                )}
              >
                {
                  LeaseRentPeriodicRentAdjustmentFieldTitles.STARTING_POINT_FIGURE
                }
              </FormTextTitle>
              <FormText>{getLastYearsIndexPointFigure(pointFigures)}</FormText>
              <FormText>{sourceTableLabel}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                enableUiDataEdit
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
    ) : (
      <AddButton
        className={"no-top-margin"}
        label="Lisää tasotarkistus"
        onClick={addPeriodicRentAdjustmentPriceIndex}
      />
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
)(PeriodicRentAdjustmentEdit);
