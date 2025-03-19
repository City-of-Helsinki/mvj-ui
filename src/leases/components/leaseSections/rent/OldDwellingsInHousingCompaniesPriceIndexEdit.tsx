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
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, getFieldAttributes } from "@/util/helpers";
import FormField from "@/components/form/FormField";
import { Attributes } from "@/types";
import { getReviewDays } from "@/leases/helpers";
import AddButton from "@/components/form/AddButton";

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps | null;
  periodicRentAdjustmentType: PeriodicRentAdjustmentType;
  addOldDwellingsInHousingCompaniesPriceIndex: () => void;
  field: string;
  leaseAttributes: Attributes;
  leaseStartDate: string;
  isSaveClicked: boolean;
};

const getLastYearsIndexPointNumber = (
  pointFigures: IndexPointFigureYearlyProps[],
): string => {
  const lastYear = new Date().getFullYear() - 1;
  const lastYearIndex =
    pointFigures?.find(
      (x: IndexPointFigureYearlyProps) => x.year == lastYear,
    ) || null;
  return lastYearIndex
    ? `${lastYearIndex.year} * ${lastYearIndex.value}`
    : "Indeksipisteluvut puuttuvat";
};

class OldDwellingsInHousingCompaniesPriceIndexEdit extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex,
      periodicRentAdjustmentType,
      addOldDwellingsInHousingCompaniesPriceIndex,
      field,
      leaseAttributes,
      leaseStartDate,
      isSaveClicked,
    } = this.props;

    const {
      point_figures: pointFigures,
      source_table_label: sourceTableLabel,
    } = oldDwellingsInHousingCompaniesPriceIndex || {};
    return oldDwellingsInHousingCompaniesPriceIndex ? (
      <Fragment>
        <BoxItemContainer>
          <Row>
            <Column>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.PERIODIC_RENT_ADJUSTMENT_TYPE,
                )}
                name={`${field}.periodic_rent_adjustment_type`}
                overrideValues={{
                  label:
                    LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentsFieldPaths.PERIODIC_RENT_ADJUSTMENT_TYPE,
                )}
              />
            </Column>
            <Column>
              <FormTextTitle
                enableUiDataEdit
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
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.POINT_FIGURES,
                )}
              >
                {
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.POINT_FIGURES
                }
              </FormTextTitle>
              <FormText>{getLastYearsIndexPointNumber(pointFigures)}</FormText>
              <FormText>{sourceTableLabel}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                enableUiDataEdit
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
                            LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.POINT_FIGURES +
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
    ) : (
      <AddButton
        className={"no-top-margin"}
        label="Lisää tasotarkistus"
        onClick={addOldDwellingsInHousingCompaniesPriceIndex}
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
)(OldDwellingsInHousingCompaniesPriceIndexEdit);
