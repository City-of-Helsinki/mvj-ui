import React, { Fragment, PureComponent } from "react";
import { Row, Column } from "react-foundation";
import {
  getCurrentLeaseStartDate,
  getAttributes as getLeaseAttributes,
} from "@/leases/selectors";
import { flowRight } from "lodash";
import { connect } from "react-redux";
import type {
  OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps,
  IndexPointFigureYearly as IndexPointFigureYearlyProps,
} from "@/leases/types";
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

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps;
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

const getReviewDaysSorted = (
  pointFigures: IndexPointFigureYearlyProps[],
): IndexPointFigureYearlyProps[] => {
  // deep copy
  const sortedNumbers = JSON.parse(JSON.stringify(pointFigures));

  sortedNumbers.sort(
    (a: IndexPointFigureYearlyProps, b: IndexPointFigureYearlyProps) =>
      a.year - b.year,
  );
  return sortedNumbers;
};

class OldDwellingsInHousingCompaniesPriceIndexViewEdit extends PureComponent<Props> {
  render() {
    const {
      oldDwellingsInHousingCompaniesPriceIndex,
      leaseAttributes,
      leaseStartDate,
      isSaveClicked,
    } = this.props;

    if (!oldDwellingsInHousingCompaniesPriceIndex) {
      return <p>Lisää tasotarkistus</p>;
    }

    const {
      point_figures: pointFigures,
      source_table_label: sourceTableLabel,
    } = oldDwellingsInHousingCompaniesPriceIndex || {};
    console.log("leaseAttributes", leaseAttributes);
    return (
      <Fragment>
        <BoxItemContainer>
          <Row>
            <Column>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX_TYPE,
                )}
                name="old_dwellings_in_housing_companies_price_index_type"
                overrideValues={{
                  label: LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.TYPE,
                  type: "choice",
                }}
                // enableUiDataEdit
                // uiDataKey={getUiDataLeaseKey(LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX_TYPE)}
              />
            </Column>
            <Column>
              <FormTextTitle>{LeaseFieldTitles.START_DATE}</FormTextTitle>
              <FormText>{formatDate(leaseStartDate)}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS,
                )}
              >
                {
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.NUMBERS
                }
              </FormTextTitle>
              <FormText>{getLastYearsIndexPointNumber(pointFigures)}</FormText>
              <FormText>{sourceTableLabel}</FormText>
            </Column>
            <Column>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS,
                )}
              >
                {
                  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.REVIEW_DAYS
                }
              </FormTextTitle>
              <>
                {pointFigures && !!pointFigures.length
                  ? getReviewDaysSorted(pointFigures).map(
                      (number: IndexPointFigureYearlyProps, index: number) => {
                        return (
                          <FormText
                            key={
                              LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS +
                              `[${index}]`
                            }
                          >
                            {`1.1.${number.year}`}
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
)(OldDwellingsInHousingCompaniesPriceIndexViewEdit);
