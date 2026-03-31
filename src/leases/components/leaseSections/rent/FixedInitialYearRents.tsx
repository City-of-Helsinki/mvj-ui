import React, { useEffect, useState } from "react";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  LeaseRentFixedInitialYearRentsFieldPaths,
  LeaseRentFixedInitialYearRentsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { useWindowResize } from "@/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
import { useSelector } from "react-redux";
type Props = {
  fixedInitialYearRents: Array<Record<string, any>>;
};

const FixedInitialYearRentsEdit: React.FC<Props> = ({
  fixedInitialYearRents,
}) => {
  const largeScreen = useWindowResize();
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  const [intendedUseOptions, setIntendedUseOptions] = useState([]);

  useEffect(() => {
    setIntendedUseOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE,
      ),
    );
  }, [leaseAttributes]);

  return (
    <>
      <BoxItemContainer>
        {(!fixedInitialYearRents || !fixedInitialYearRents.length) && (
          <FormText>Ei kiinteitä alkuvuosivuokria</FormText>
        )}

        {fixedInitialYearRents &&
          !!fixedInitialYearRents.length &&
          largeScreen && (
            <Row>
              <Column large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE,
                  )}
                >
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE,
                    )}
                  >
                    {LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT,
                  )}
                >
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT,
                    )}
                  >
                    {LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column large={1}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentFixedInitialYearRentsFieldPaths.START_DATE,
                  )}
                >
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseRentFixedInitialYearRentsFieldPaths.START_DATE,
                    )}
                  >
                    {LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column large={1}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentFixedInitialYearRentsFieldPaths.END_DATE,
                  )}
                >
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseRentFixedInitialYearRentsFieldPaths.END_DATE,
                    )}
                  >
                    {LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}
                  </FormTextTitle>
                </Authorization>
              </Column>
            </Row>
          )}
        {fixedInitialYearRents &&
          !!fixedInitialYearRents.length &&
          fixedInitialYearRents.map((rent, index) => {
            if (largeScreen) {
              return (
                <Row key={index}>
                  <Column small={3} medium={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE,
                      )}
                    >
                      <FormText>
                        {getLabelOfOption(
                          intendedUseOptions,
                          rent.intended_use,
                        ) || "-"}
                      </FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT,
                      )}
                    >
                      <FormText>
                        {!isEmptyValue(rent.amount)
                          ? `${formatNumber(rent.amount)} €`
                          : "-"}
                      </FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={1}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentFixedInitialYearRentsFieldPaths.START_DATE,
                      )}
                    >
                      <FormText>{formatDate(rent.start_date) || "-"}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={1}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentFixedInitialYearRentsFieldPaths.END_DATE,
                      )}
                    >
                      <FormText>{formatDate(rent.end_date) || "-"}</FormText>
                    </Authorization>
                  </Column>
                </Row>
              );
            } else {
              return (
                <BoxItem
                  className="no-border-on-first-child no-border-on-last-child"
                  key={index}
                >
                  <BoxContentWrapper>
                    <Row>
                      <Column small={6} medium={3} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE,
                          )}
                        >
                          <>
                            <FormTextTitle
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE,
                              )}
                            >
                              {
                                LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE
                              }
                            </FormTextTitle>
                            <FormText>
                              {getLabelOfOption(
                                intendedUseOptions,
                                rent.intended_use,
                              ) || "-"}
                            </FormText>
                          </>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={3} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT,
                          )}
                        >
                          <>
                            <FormTextTitle
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT,
                              )}
                            >
                              {LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}
                            </FormTextTitle>
                            <FormText>
                              {!isEmptyValue(rent.amount)
                                ? `${formatNumber(rent.amount)} €`
                                : "-"}
                            </FormText>
                          </>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={3} large={1}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentFixedInitialYearRentsFieldPaths.START_DATE,
                          )}
                        >
                          <>
                            <FormTextTitle
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentFixedInitialYearRentsFieldPaths.START_DATE,
                              )}
                            >
                              {
                                LeaseRentFixedInitialYearRentsFieldTitles.START_DATE
                              }
                            </FormTextTitle>
                            <FormText>
                              {formatDate(rent.start_date) || "-"}
                            </FormText>
                          </>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={3} large={1}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentFixedInitialYearRentsFieldPaths.END_DATE,
                          )}
                        >
                          <>
                            <FormTextTitle
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentFixedInitialYearRentsFieldPaths.END_DATE,
                              )}
                            >
                              {
                                LeaseRentFixedInitialYearRentsFieldTitles.END_DATE
                              }
                            </FormTextTitle>
                            <FormText>
                              {formatDate(rent.end_date) || "-"}
                            </FormText>
                          </>
                        </Authorization>
                      </Column>
                    </Row>
                  </BoxContentWrapper>
                </BoxItem>
              );
            }
          })}
      </BoxItemContainer>
    </>
  );
};

export default FixedInitialYearRentsEdit;
