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
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { Attributes } from "@/types";
import { getReviewDays, getPointFigureFormText } from "@/leases/helpers";
import AddButton from "@/components/form/AddButton";

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps | null;
  periodicRentAdjustmentType: PeriodicRentAdjustmentType;
  addOldDwellingsInHousingCompaniesPriceIndex: () => void;
  startPriceIndexPointFigureValue: number | undefined;
  startPriceIndexPointFigureYear: number | undefined;
  field: string;
  leaseAttributes: Attributes;
  leaseStartDate: string;
  isSaveClicked: boolean;
};

class OldDwellingsInHousingCompaniesPriceIndexEdit extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex,
      periodicRentAdjustmentType,
      addOldDwellingsInHousingCompaniesPriceIndex,
      startPriceIndexPointFigureValue,
      startPriceIndexPointFigureYear,
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
              <FormFieldLegacy
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
