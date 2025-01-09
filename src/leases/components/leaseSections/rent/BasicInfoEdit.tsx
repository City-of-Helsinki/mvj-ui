import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { change, FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import { rentCustomDateOptions } from "@/leases/constants";
import { FieldTypes, FormNames } from "@/enums";
import {
  DueDatesPositions,
  FixedDueDates,
  LeaseRentDueDatesFieldPaths,
  LeaseRentDueDatesFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
  RentCycles,
  RentTypes,
  RentDueDateTypes,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { formatDueDates } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { getReceivableTypes } from "@/leaseCreateCharge/selectors";
import { getLeaseTypeList } from "@/leaseType/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { PlotSearchFieldPaths } from "@/plotSearch/enums";
import type { Attributes } from "types";
import type { DueDate, Lease, ReceivableType } from "@/leases/types";
import type { LeaseTypeList } from "@/leaseType/types";
import type { ServiceUnit } from "@/serviceUnits/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

type DueDatesProps = {
  dueDates: Array<DueDate>;
  fields: any;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const renderDueDates = ({
  dueDates,
  fields,
  isSaveClicked,
  leaseAttributes,
  usersPermissions,
}: DueDatesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <Authorization
      allow={isFieldAllowedToRead(
        leaseAttributes,
        LeaseRentDueDatesFieldPaths.DUE_DATES,
      )}
    >
      <>
        <Row>
          <Column>
            <FormTextTitle
              required={isFieldRequired(
                leaseAttributes,
                LeaseRentDueDatesFieldPaths.DUE_DATES,
              )}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseRentDueDatesFieldPaths.DUE_DATES,
              )}
            >
              {LeaseRentDueDatesFieldTitles.DUE_DATES}
            </FormTextTitle>
          </Column>
        </Row>
        <Authorization
          allow={
            isFieldAllowedToEdit(
              leaseAttributes,
              LeaseRentDueDatesFieldPaths.DAY,
            ) ||
            isFieldAllowedToEdit(
              leaseAttributes,
              LeaseRentDueDatesFieldPaths.MONTH,
            )
          }
          errorComponent={
            <FormText>{formatDueDates(dueDates) || "-"}</FormText>
          }
        >
          {fields &&
            !!fields.length &&
            fields.map((due_date, index) => {
              const handleRemove = () => {
                fields.remove(index);
              };

              return (
                <Row key={index}>
                  <Column small={12}>
                    <Row>
                      <Column small={6}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentDueDatesFieldPaths.DAY,
                          )}
                        >
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              leaseAttributes,
                              LeaseRentDueDatesFieldPaths.DAY,
                            )}
                            invisibleLabel
                            name={`${due_date}.day`}
                            overrideValues={{
                              label: LeaseRentDueDatesFieldTitles.DAY,
                            }}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6}>
                        <FieldAndRemoveButtonWrapper
                          className="absolute-remove-button-position"
                          field={
                            <Authorization
                              allow={isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseRentDueDatesFieldPaths.MONTH,
                              )}
                            >
                              <FormField
                                className="with-dot"
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(
                                  leaseAttributes,
                                  LeaseRentDueDatesFieldPaths.MONTH,
                                )}
                                invisibleLabel
                                name={`${due_date}.month`}
                                overrideValues={{
                                  label: LeaseRentDueDatesFieldTitles.MONTH,
                                }}
                              />
                            </Authorization>
                          }
                          removeButton={
                            <Authorization
                              allow={hasPermissions(
                                usersPermissions,
                                UsersPermissions.CHANGE_RENT_DUE_DATES,
                              )}
                            >
                              <RemoveButton
                                className="third-level"
                                onClick={handleRemove}
                                title="Poista eräpäivä"
                              />
                            </Authorization>
                          }
                        />
                      </Column>
                    </Row>
                  </Column>
                </Row>
              );
            })}
        </Authorization>

        <Authorization
          allow={hasPermissions(
            usersPermissions,
            UsersPermissions.CHANGE_RENT_DUE_DATES,
          )}
        >
          <Row>
            <Column>
              <AddButtonThird label="Lisää eräpäivä" onClick={handleAdd} />
            </Column>
          </Row>
        </Authorization>
      </>
    </Authorization>
  );
};

type BasicInfoEmptyProps = {
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
};

const BasicInfoEmpty = ({
  isSaveClicked,
  leaseAttributes,
}: BasicInfoEmptyProps) => {
  return (
    <Authorization
      allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
            name={PlotSearchFieldPaths.TYPE}
            overrideValues={{
              label: LeaseRentsFieldTitles.TYPE,
            }}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.TYPE)}
          />
        </Column>
      </Row>
    </Authorization>
  );
};

type BasicInfoIndexOrManualProps = {
  cycle: string | null | undefined;
  dueDates: Array<DueDate>;
  dueDatesType: string | null | undefined;
  field: string;
  rentType: string;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  receivableTypeOptions: Array<Record<string, any>>;
  serviceUnit: ServiceUnit;
  usersPermissions: UsersPermissionsType;
  yearlyDueDates: Array<DueDate>;
};

const BasicInfoIndexOrManual = ({
  cycle,
  dueDates,
  dueDatesType,
  rentType,
  isSaveClicked,
  leaseAttributes,
  receivableTypeOptions,
  serviceUnit,
  usersPermissions,
  yearlyDueDates,
}: BasicInfoIndexOrManualProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.TYPE,
              )}
              name="type"
              overrideValues={{
                label: LeaseRentsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.TYPE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.START_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.START_DATE,
              )}
              name="start_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.START_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.END_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.END_DATE,
              )}
              name="end_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.END_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.END_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.CYCLE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.CYCLE,
              )}
              name="cycle"
              overrideValues={{
                label: LeaseRentsFieldTitles.CYCLE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.CYCLE)}
            />
          </Authorization>
        </Column>

        {rentType === RentTypes.INDEX && ( // Not needed for INDEX2022
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.INDEX_TYPE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.INDEX_TYPE,
                )}
                name="index_type"
                overrideValues={{
                  label: LeaseRentsFieldTitles.INDEX_TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.INDEX_TYPE)}
              />
            </Authorization>
          </Column>
        )}

        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.DUE_DATES_TYPE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.DUE_DATES_TYPE,
              )}
              name="due_dates_type"
              overrideValues={{
                label: LeaseRentsFieldTitles.DUE_DATES_TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.DUE_DATES_TYPE)}
            />
          </Authorization>
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM && (
          <Column small={6} medium={4} large={1}>
            {/* Authorization is done on renderDueDates component */}
            <FieldArray
              component={renderDueDates}
              dueDates={dueDates}
              isSaveClicked={isSaveClicked}
              leaseAttributes={leaseAttributes}
              name="due_dates"
              usersPermissions={usersPermissions}
            />
          </Column>
        )}
        {dueDatesType === RentDueDateTypes.FIXED && (
          <Column small={6} medium={4} large={1}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.DUE_DATES_PER_YEAR,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.DUE_DATES_PER_YEAR,
                )}
                name="due_dates_per_year"
                overrideValues={{
                  fieldType: FieldTypes.CHOICE,
                  label: LeaseRentsFieldTitles.DUE_DATES_PER_YEAR,
                  options: rentCustomDateOptions,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentsFieldPaths.DUE_DATES_PER_YEAR,
                )}
              />
            </Authorization>
          </Column>
        )}
        {dueDatesType === RentDueDateTypes.FIXED && (
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentDueDatesFieldPaths.DUE_DATES,
              )}
            >
              <>
                <FormTextTitle
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseRentsFieldPaths.YEARLY_DUE_DATES,
                  )}
                >
                  {LeaseRentsFieldTitles.YEARLY_DUE_DATES}
                </FormTextTitle>
                <FormText>
                  {yearlyDueDates && !!yearlyDueDates
                    ? formatDueDates(yearlyDueDates)
                    : "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        )}
      </Row>

      {rentType === RentTypes.MANUAL && (
        <Row>
          {(cycle === RentCycles.JANUARY_TO_DECEMBER ||
            cycle === RentCycles.APRIL_TO_MARCH) && (
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseRentsFieldPaths.MANUAL_RATIO,
                )}
              >
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    leaseAttributes,
                    LeaseRentsFieldPaths.MANUAL_RATIO,
                  )}
                  name="manual_ratio"
                  overrideValues={{
                    label: LeaseRentsFieldTitles.MANUAL_RATIO,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseRentsFieldPaths.MANUAL_RATIO,
                  )}
                />
              </Authorization>
            </Column>
          )}
          {cycle === RentCycles.APRIL_TO_MARCH && (
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseRentsFieldPaths.MANUAL_RATIO_PREVIOUS,
                )}
              >
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    leaseAttributes,
                    LeaseRentsFieldPaths.MANUAL_RATIO_PREVIOUS,
                  )}
                  name="manual_ratio_previous"
                  overrideValues={{
                    label: LeaseRentsFieldTitles.MANUAL_RATIO_PREVIOUS,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseRentsFieldPaths.MANUAL_RATIO_PREVIOUS,
                  )}
                />
              </Authorization>
            </Column>
          )}
        </Row>
      )}

      {serviceUnit.use_rent_override_receivable_type && (
        <Row>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.OVERRIDE_RECEIVABLE_TYPE,
            )}
          >
            <Column small={12} medium={6} large={4}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.OVERRIDE_RECEIVABLE_TYPE,
                )}
                name="override_receivable_type"
                overrideValues={{
                  label: LeaseRentsFieldTitles.OVERRIDE_RECEIVABLE_TYPE,
                  options: receivableTypeOptions,
                  required: true,
                }}
              />
            </Column>
          </Authorization>
        </Row>
      )}

      <Row>
        <Column small={12} medium={8} large={10}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.NOTE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.NOTE,
              )}
              name="note"
              overrideValues={{
                label: LeaseRentsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.NOTE)}
            />
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

type BasicInfoOneTimeProps = {
  dueDates: Array<DueDate>;
  dueDatesType: string | null | undefined;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const BasicInfoOneTime = ({
  isSaveClicked,
  leaseAttributes,
}: BasicInfoOneTimeProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.TYPE,
              )}
              name="type"
              overrideValues={{
                label: LeaseRentsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.TYPE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.START_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.START_DATE,
              )}
              name="start_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.START_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.END_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.END_DATE,
              )}
              name="end_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.END_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.END_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.AMOUNT,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.AMOUNT,
              )}
              name="amount"
              unit="€"
              overrideValues={{
                label: LeaseRentsFieldTitles.AMOUNT,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.AMOUNT)}
            />
          </Authorization>
        </Column>
      </Row>
      <Authorization
        allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.NOTE)}
      >
        <Row>
          <Column>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.NOTE,
              )}
              name="note"
              overrideValues={{
                label: LeaseRentsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.NOTE)}
            />
          </Column>
        </Row>
      </Authorization>
    </Fragment>
  );
};

type BasicInfoFixedProps = {
  dueDates: Array<DueDate>;
  dueDatesType: string | null | undefined;
  field: string;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  receivableTypeOptions: Array<Record<string, any>>;
  serviceUnit: ServiceUnit;
  usersPermissions: UsersPermissionsType;
  yearlyDueDates: Array<DueDate>;
};

const BasicInfoFixed = ({
  dueDates,
  dueDatesType,
  field,
  isSaveClicked,
  leaseAttributes,
  receivableTypeOptions,
  serviceUnit,
  usersPermissions,
  yearlyDueDates,
}: BasicInfoFixedProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.TYPE,
              )}
              name="type"
              overrideValues={{
                label: LeaseRentsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.TYPE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.START_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.START_DATE,
              )}
              name="start_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.START_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.END_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.END_DATE,
              )}
              name="end_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.END_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.END_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.DUE_DATES_TYPE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.DUE_DATES_TYPE,
              )}
              name="due_dates_type"
              overrideValues={{
                label: LeaseRentsFieldTitles.DUE_DATES_TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.DUE_DATES_TYPE)}
            />
          </Authorization>
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM && (
          <Column small={6} medium={4} large={2}>
            {/* Authorization is done on renderDueDates component */}
            <FieldArray
              component={renderDueDates}
              dueDates={dueDates}
              isSaveClicked={isSaveClicked}
              leaseAttributes={leaseAttributes}
              name="due_dates"
              usersPermissions={usersPermissions}
            />
          </Column>
        )}
        {dueDatesType === RentDueDateTypes.FIXED && (
          <Column small={6} medium={4} large={1}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.DUE_DATES_PER_YEAR,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.DUE_DATES_PER_YEAR,
                )}
                name="due_dates_per_year"
                overrideValues={{
                  fieldType: FieldTypes.CHOICE,
                  label: LeaseRentsFieldTitles.DUE_DATES_PER_YEAR,
                  options: rentCustomDateOptions,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentsFieldPaths.DUE_DATES_PER_YEAR,
                )}
              />
            </Authorization>
          </Column>
        )}
        {dueDatesType === RentDueDateTypes.FIXED && (
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentDueDatesFieldPaths.DUE_DATES,
              )}
            >
              <>
                <FormTextTitle
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseRentsFieldPaths.YEARLY_DUE_DATES,
                  )}
                >
                  {LeaseRentsFieldTitles.YEARLY_DUE_DATES}
                </FormTextTitle>
                <FormText>
                  {yearlyDueDates && !!yearlyDueDates
                    ? formatDueDates(yearlyDueDates)
                    : "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        )}
      </Row>

      {serviceUnit.use_rent_override_receivable_type && (
        <Row>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.OVERRIDE_RECEIVABLE_TYPE,
            )}
          >
            <Column small={12} medium={6} large={4}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentsFieldPaths.OVERRIDE_RECEIVABLE_TYPE,
                )}
                name="override_receivable_type"
                overrideValues={{
                  label: LeaseRentsFieldTitles.OVERRIDE_RECEIVABLE_TYPE,
                  options: receivableTypeOptions,
                  required: true,
                }}
              />
            </Column>
          </Authorization>
        </Row>
      )}

      <Row>
        <Column small={12} medium={8} large={10}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.NOTE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.NOTE,
              )}
              name="note"
              overrideValues={{
                label: LeaseRentsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.NOTE)}
            />
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

type BasicInfoFreeProps = {
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
};

const BasicInfoFree = ({
  isSaveClicked,
  leaseAttributes,
}: BasicInfoFreeProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.TYPE,
              )}
              name="type"
              overrideValues={{
                label: LeaseRentsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.TYPE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.START_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.START_DATE,
              )}
              name="start_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.START_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.END_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.END_DATE,
              )}
              name="end_date"
              overrideValues={{
                label: LeaseRentsFieldTitles.END_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.END_DATE)}
            />
          </Authorization>
        </Column>
      </Row>

      <Authorization
        allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.NOTE)}
      >
        <Row>
          <Column>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentsFieldPaths.NOTE,
              )}
              name="note"
              overrideValues={{
                label: LeaseRentsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.NOTE)}
            />
          </Column>
        </Row>
      </Authorization>
    </Fragment>
  );
};

/**
 * Get receivable type options for override receivable type select.
 * ReceivableTypes must be fetched separately from API, because receivabletype
 * choices from leaseAttributes are not filtered by service unit.
 *
 * @param receivableTypes Receivable types filtered by lease's service unit
 * @returns Array Receivabletype options for select element
 */
const getOverrideReceivableTypeOptions = (
  receivableTypes: Array<ReceivableType>,
) => {
  const options = receivableTypes.map((rt) => ({
    label: rt.name,
    value: rt.id,
  }));
  const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label));
  const emptyItem = { label: "", value: "" };
  return [emptyItem, ...sortedOptions];
};

type Props = {
  change: (...args: Array<any>) => any;
  currentLease: Lease;
  cycle: string;
  dueDates: Array<DueDate>;
  dueDatesPerYear: number | null | undefined;
  dueDatesType: string | null | undefined;
  field: string;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  leaseTypes: LeaseTypeList;
  receivableTypes: Array<ReceivableType>;
  rentType: string | null | undefined;
  usersPermissions: UsersPermissionsType;
};

const BasicInfoEdit = ({
  currentLease,
  cycle,
  dueDates,
  dueDatesPerYear,
  dueDatesType,
  field,
  isSaveClicked,
  leaseAttributes,
  leaseTypes,
  receivableTypes,
  rentType,
  usersPermissions,
}: Props) => {
  const getYearlyDueDates = () => {
    const leaseTypeId = get(currentLease, "type.id");
    const leaseType = leaseTypes.find((item) => item.id === leaseTypeId);
    if (
      !dueDatesPerYear ||
      !leaseType ||
      dueDatesType !== RentDueDateTypes.FIXED
    )
      return [];
    return FixedDueDates[
      rentType === RentTypes.FIXED
        ? DueDatesPositions.START_OF_MONTH
        : leaseType.due_dates_position
    ][dueDatesPerYear];
  };
  const yearlyDueDates = getYearlyDueDates();
  const receivableTypeOptions =
    getOverrideReceivableTypeOptions(receivableTypes);
  return (
    <Fragment>
      {!rentType && (
        <BasicInfoEmpty
          isSaveClicked={isSaveClicked}
          leaseAttributes={leaseAttributes}
        />
      )}
      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.INDEX2022 ||
        rentType === RentTypes.MANUAL) && (
        <BasicInfoIndexOrManual
          cycle={cycle}
          dueDates={dueDates}
          dueDatesType={dueDatesType}
          field={field}
          rentType={rentType}
          isSaveClicked={isSaveClicked}
          leaseAttributes={leaseAttributes}
          usersPermissions={usersPermissions}
          yearlyDueDates={yearlyDueDates}
          receivableTypeOptions={receivableTypeOptions}
          serviceUnit={currentLease.service_unit}
        />
      )}
      {rentType === RentTypes.ONE_TIME && (
        <BasicInfoOneTime
          dueDates={dueDates}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
          leaseAttributes={leaseAttributes}
          usersPermissions={usersPermissions}
        />
      )}
      {rentType === RentTypes.FIXED && (
        <BasicInfoFixed
          dueDates={dueDates}
          dueDatesType={dueDatesType}
          field={field}
          isSaveClicked={isSaveClicked}
          leaseAttributes={leaseAttributes}
          usersPermissions={usersPermissions}
          yearlyDueDates={yearlyDueDates}
          receivableTypeOptions={receivableTypeOptions}
          serviceUnit={currentLease.service_unit}
        />
      )}
      {rentType === RentTypes.FREE && (
        <BasicInfoFree
          isSaveClicked={isSaveClicked}
          leaseAttributes={leaseAttributes}
        />
      )}
    </Fragment>
  );
};

type BasicInfoEditProps = {
  field: string;
  isSaveClicked: boolean;
  rentType: string;
};

export default connect(
  (state, props: BasicInfoEditProps) => {
    return {
      currentLease: getCurrentLease(state),
      cycle: selector(state, `${props.field}.cycle`),
      dueDatesPerYear: selector(state, `${props.field}.due_dates_per_year`),
      dueDatesType: selector(state, `${props.field}.due_dates_type`),
      dueDates: selector(state, `${props.field}.due_dates`),
      leaseAttributes: getLeaseAttributes(state),
      leaseTypes: getLeaseTypeList(state),
      receivableTypes: getReceivableTypes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    change,
  },
)(BasicInfoEdit);
