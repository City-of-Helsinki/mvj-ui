import React, { ReactElement } from "react";
import { FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
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
  getIsSaveClicked,
} from "@/leases/selectors";
import { getReceivableTypes } from "@/leaseCreateCharge/selectors";
import { getLeaseTypeList } from "@/leaseType/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { PlotSearchFieldPaths } from "@/plotSearch/enums";
import type { Attributes } from "types";
import type { DueDate, ReceivableType } from "@/leases/types";
import type { LeaseTypeList } from "@/leaseType/types";
import type { ServiceUnit } from "@/serviceUnits/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { useSelector } from "react-redux";
const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

type DueDatesProps = {
  dueDates: Array<DueDate>;
  fields: any;
};

const DueDates = ({ dueDates, fields }: DueDatesProps): ReactElement => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

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
                          <FormFieldLegacy
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
                              <FormFieldLegacy
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

const BasicInfoEmpty = () => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  return (
    <Authorization
      allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLegacy
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
  field: string;
  rentType: string;
  receivableTypeOptions: Array<Record<string, any>>;
  serviceUnit: ServiceUnit;
  yearlyDueDates: Array<DueDate>;
};

const BasicInfoIndexOrManual = ({
  field,
  rentType,
  receivableTypeOptions,
  serviceUnit,
  yearlyDueDates,
}: BasicInfoIndexOrManualProps) => {
  const cycle = useSelector((state) => selector(state, `${field}.cycle`));
  const dueDates = useSelector((state) =>
    selector(state, `${field}.due_dates`),
  );
  const dueDatesType = useSelector((state) =>
    selector(state, `${field}.due_dates_type`),
  );
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const isSaveClicked = useSelector(getIsSaveClicked);

  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
              <FormFieldLegacy
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
            <FormFieldLegacy
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
              component={DueDates}
              dueDates={dueDates}
              name="due_dates"
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
              <FormFieldLegacy
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
                <FormFieldLegacy
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
                <FormFieldLegacy
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
              <FormFieldLegacy
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
            <FormFieldLegacy
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
    </>
  );
};

type BasicInfoOneTimeProps = {};

const BasicInfoOneTime = () => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
    </>
  );
};

type BasicInfoFixedProps = {
  field: string;
  receivableTypeOptions: Array<Record<string, any>>;
  serviceUnit: ServiceUnit;
  yearlyDueDates: Array<DueDate>;
};

const BasicInfoFixed = ({
  field,
  receivableTypeOptions,
  serviceUnit,
  yearlyDueDates,
}: BasicInfoFixedProps) => {
  const dueDates = useSelector((state) =>
    selector(state, `${field}.due_dates`),
  );
  const dueDatesType = useSelector((state) =>
    selector(state, `${field}.due_dates_type`),
  );
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
              component={DueDates}
              dueDates={dueDates}
              name="due_dates"
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
            <FormFieldLegacy
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
    </>
  );
};

type BasicInfoFreeProps = {};

const BasicInfoFree = () => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
    </>
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
  field: string;
  rentType: string | null | undefined;
};

const BasicInfoEdit = ({ field, rentType }: Props) => {
  const currentLease = useSelector(getCurrentLease);
  const leaseTypes: LeaseTypeList = useSelector(getLeaseTypeList);
  const dueDatesPerYear: number | null | undefined = useSelector((state) =>
    selector(state, `${field}.due_dates_per_year`),
  );
  const dueDatesType: string | null | undefined = useSelector((state) =>
    selector(state, `${field}.due_dates_type`),
  );

  const receivableTypes: Array<ReceivableType> =
    useSelector(getReceivableTypes);

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
    <>
      {!rentType && <BasicInfoEmpty />}
      {(rentType === RentTypes.INDEX ||
        rentType === RentTypes.INDEX2022 ||
        rentType === RentTypes.MANUAL) && (
        <BasicInfoIndexOrManual
          field={field}
          rentType={rentType}
          yearlyDueDates={yearlyDueDates}
          receivableTypeOptions={receivableTypeOptions}
          serviceUnit={currentLease.service_unit}
        />
      )}
      {rentType === RentTypes.ONE_TIME && <BasicInfoOneTime />}
      {rentType === RentTypes.FIXED && (
        <BasicInfoFixed
          field={field}
          yearlyDueDates={yearlyDueDates}
          receivableTypeOptions={receivableTypeOptions}
          serviceUnit={currentLease.service_unit}
        />
      )}
      {rentType === RentTypes.FREE && <BasicInfoFree />}
    </>
  );
};

export default BasicInfoEdit;
