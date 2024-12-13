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
  OldDwellingsInHousingCompaniesPriceIndexType,
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
import { getReviewDays } from "@/leases/helpers";
import AddButton from "@/components/form/AddButton";

type Props = {
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndexProps | null;
  oldDwellingsInHousingCompaniesPriceIndexType: OldDwellingsInHousingCompaniesPriceIndexType;
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
      oldDwellingsInHousingCompaniesPriceIndexType,
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
    return (
      oldDwellingsInHousingCompaniesPriceIndex ?
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
                name={`${field}.old_dwellings_in_housing_companies_price_index_type`}
                overrideValues={{
                  label: LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.TYPE,
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
                {leaseStartDate ? 
                  getReviewDays(leaseStartDate, oldDwellingsInHousingCompaniesPriceIndexType).map(
                    (date: string, index: number) => {
                      return <FormText key={LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths.NUMBERS + `[${index}]`}>
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
    : 
    <AddButton
      className={'no-top-margin'}
      label='Lisää tasotarkistus'
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
