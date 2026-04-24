import React, { useEffect, useMemo, useState } from "react";
import { Row, Column } from "react-foundation";
import classNames from "classnames";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRentEdit from "./BasisOfRentEdit";
import CalculateRentTotal from "./CalculateRentTotal";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import GrayBox from "@/components/content/GrayBox";
import GreenBox from "@/components/content/GreenBox";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  BasisOfRentManagementSubventionsFieldPaths,
  LeaseBasisOfRentsFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { calculateBasisOfRentTotalDiscountedInitialYearRent } from "@/leases/helpers";
import { getFieldOptions, hasPermissions, isEmptyValue } from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { BasisOfRent } from "@/leases/types";
import { useSelector } from "react-redux";
type Props = {
  addButtonClass?: string;
  archived: boolean;
  basisOfRents: Array<BasisOfRent>;
  fields: any;
  formName: string;
  onArchive?: (...args: Array<any>) => any;
  onUnarchive?: (...args: Array<any>) => any;
  showLockedAt?: boolean;
  showPlansInspectedAt?: boolean;
};

const BasisOfRentsEdit = ({
  addButtonClass,
  archived,
  basisOfRents,
  fields,
  formName,
  onArchive,
  onUnarchive,
  showLockedAt,
  showPlansInspectedAt,
}: Props) => {
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const [areaUnitOptions, setAreaUnitOptions] = useState([]);
  const [intendedUseOptions, setIntendedUseOptions] = useState([]);
  const [managementTypeOptions, setManagementTypeOptions] = useState([]);
  const [subventionTypeOptions, setSubventionTypeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const indexOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX),
    [leaseAttributes],
  );

  useEffect(() => {
    setAreaUnitOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.AREA_UNIT,
      ).map((option) => ({
        ...option,
        label: !isEmptyValue(option.label)
          ? option.label.replace("^2", "²")
          : option.label,
      })),
    );
    setIntendedUseOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.INTENDED_USE,
      ),
    );
    setManagementTypeOptions(
      getFieldOptions(
        leaseAttributes,
        BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
      ),
    );
    setSubventionTypeOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE,
      ),
    );
    setTypeOptions(
      getFieldOptions(leaseAttributes, LeaseBasisOfRentsFieldPaths.TYPE),
    );
  }, [leaseAttributes]);

  const handleAdd = () => {
    fields.push({});
  };
  const removeBasisOfRent = (index: number) => {
    fields.remove(index);
  };

  const totalDiscountedInitialYearRent =
    calculateBasisOfRentTotalDiscountedInitialYearRent(
      basisOfRents,
      indexOptions,
    );

  if (!archived && (!fields || !fields.length)) {
    return (
      <Authorization
        allow={hasPermissions(
          usersPermissions,
          UsersPermissions.ADD_LEASEBASISOFRENT,
        )}
        errorComponent={
          <FormText className="no-margin">Ei vuokralaskureita</FormText>
        }
      >
        <Row>
          <Column>
            <AddButtonSecondary
              className={classNames(addButtonClass, {
                "no-top-margin": !fields || !fields.length,
              })}
              label="Lisää vuokralaskuri"
              onClick={handleAdd}
            />
          </Column>
        </Row>
      </Authorization>
    );
  }

  return (
    <AppConsumer>
      {({ dispatch }) => {
        if (archived) {
          if (!fields || !fields.length) return null;
          return (
            <>
              <h3
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Arkisto
              </h3>
              <GrayBox>
                <BoxItemContainer>
                  {fields &&
                    !!fields.length &&
                    fields.map((field, index) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            fields.remove(index);
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText:
                            ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT
                              .BUTTON,
                          confirmationModalLabel:
                            ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT
                              .LABEL,
                          confirmationModalTitle:
                            ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT
                              .TITLE,
                        });
                      };

                      const handleUnarchive = (
                        savedItem: Record<string, any>,
                      ) => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            if (onUnarchive) {
                              onUnarchive(index, savedItem);
                            }
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText:
                            ConfirmationModalTexts.UNARCHIVE_LEASE_BASIS_OF_RENT
                              .BUTTON,
                          confirmationModalLabel:
                            ConfirmationModalTexts.UNARCHIVE_LEASE_BASIS_OF_RENT
                              .LABEL,
                          confirmationModalTitle:
                            ConfirmationModalTexts.UNARCHIVE_LEASE_BASIS_OF_RENT
                              .TITLE,
                        });
                      };

                      return (
                        <BasisOfRentEdit
                          key={index}
                          archived={true}
                          areaUnitOptions={areaUnitOptions}
                          field={field}
                          formName={formName}
                          indexOptions={indexOptions}
                          intendedUseOptions={intendedUseOptions}
                          managementTypeOptions={managementTypeOptions}
                          onRemove={handleRemove}
                          onUnarchive={handleUnarchive}
                          showLockedAt={showLockedAt}
                          showPlansInspectedAt={showPlansInspectedAt}
                          showTotal={
                            fields.length > 1 && fields.length === index + 1
                          }
                          subventionTypeOptions={subventionTypeOptions}
                          totalDiscountedInitialYearRent={
                            totalDiscountedInitialYearRent
                          }
                        />
                      );
                    })}
                </BoxItemContainer>
              </GrayBox>
            </>
          );
        } else {
          return (
            <GreenBox>
              <BoxItemContainer>
                {fields &&
                  !!fields.length &&
                  fields.map((field, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText:
                          ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT
                            .BUTTON,
                        confirmationModalLabel:
                          ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT
                            .LABEL,
                        confirmationModalTitle:
                          ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT
                            .TITLE,
                      });
                    };

                    const handleArchive = (savedItem: Record<string, any>) => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          if (onArchive) {
                            onArchive(index, savedItem);
                          }
                        },
                        confirmationModalButtonClassName: ButtonColors.SUCCESS,
                        confirmationModalButtonText:
                          ConfirmationModalTexts.ARCHIVE_LEASE_BASIS_OF_RENT
                            .BUTTON,
                        confirmationModalLabel:
                          ConfirmationModalTexts.ARCHIVE_LEASE_BASIS_OF_RENT
                            .LABEL,
                        confirmationModalTitle:
                          ConfirmationModalTexts.ARCHIVE_LEASE_BASIS_OF_RENT
                            .TITLE,
                      });
                    };

                    return (
                      <BasisOfRentEdit
                        key={index}
                        archived={false}
                        areaUnitOptions={areaUnitOptions}
                        field={field}
                        formName={formName}
                        indexOptions={indexOptions}
                        intendedUseOptions={intendedUseOptions}
                        managementTypeOptions={managementTypeOptions}
                        onArchive={handleArchive}
                        onRemove={handleRemove}
                        showLockedAt={showLockedAt}
                        showPlansInspectedAt={showPlansInspectedAt}
                        showTotal={
                          fields.length > 1 && fields.length === index + 1
                        }
                        subventionTypeOptions={subventionTypeOptions}
                        totalDiscountedInitialYearRent={
                          totalDiscountedInitialYearRent
                        }
                      />
                    );
                  })}
              </BoxItemContainer>

              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.ADD_LEASEBASISOFRENT,
                )}
              >
                <Row>
                  <Column>
                    <AddButtonSecondary
                      className={classNames({
                        "no-top-margin": !fields || !fields.length,
                      })}
                      label="Lisää vuokralaskuri"
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>

              {basisOfRents.length > 1 && (
                <CalculateRentTotal
                  basisOfRents={basisOfRents}
                  indexOptions={indexOptions}
                />
              )}
            </GreenBox>
          );
        }
      }}
    </AppConsumer>
  );
};

export default BasisOfRentsEdit;
