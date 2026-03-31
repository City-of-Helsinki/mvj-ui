import React from "react";
import { Row, Column } from "react-foundation";
import { getCurrentLeaseStartDate } from "@/leases/selectors";
import type { PeriodicRentAdjustmentType } from "@/leases/types";
import type { OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps } from "@/oldDwellingsInHousingCompaniesPriceIndex/types";
import BoxItemContainer from "@/components/content/BoxItemContainer";
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
import { useSelector } from "react-redux";

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps;
  periodicRentAdjustmentType: PeriodicRentAdjustmentType;
  startPriceIndexPointFigureValue: number | undefined;
  startPriceIndexPointFigureYear: number | undefined;
};

const OldDwellingsInHousingCompaniesPriceIndexView: React.FC<Props> = ({
  oldDwellingsInHousingCompaniesPriceIndex,
  periodicRentAdjustmentType,
  startPriceIndexPointFigureValue,
  startPriceIndexPointFigureYear,
}) => {
  const leaseStartDate = useSelector(getCurrentLeaseStartDate);

  const { point_figures: pointFigures, source_table_label: sourceTableLabel } =
    oldDwellingsInHousingCompaniesPriceIndex || {};
  return (
    <>
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
                ? getReviewDays(leaseStartDate, periodicRentAdjustmentType).map(
                    (date: string, index: number) => {
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
                    },
                  )
                : ""}
            </>
          </Column>
        </Row>
      </BoxItemContainer>
    </>
  );
};

export default OldDwellingsInHousingCompaniesPriceIndexView;
