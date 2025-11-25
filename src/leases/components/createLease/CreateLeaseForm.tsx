import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-final-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import { FieldTypes } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
  CreateLeaseFormFieldNames,
} from "@/leases/enums";
import { filterOptionsByLabel } from "@/components/form/filter";
import { getDistrictOptions } from "@/district/helpers";
import { getPayloadCreateLease } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  getFieldAttributes,
  isFieldAllowedToEdit,
} from "@/util/helpers";
import {
  getDistrictsByMunicipality,
  getIsFetching as getIsFetchingDistricts,
} from "@/district/selectors";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { referenceNumber } from "@/components/form/validations";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import { AreaSearch } from "@/areaSearch/types";
import { CreateLeaseFormValues } from "@/leases/types";
import type { FormApi } from "final-form";

type Props = {
  allowToChangeRelateTo?: boolean;
  allowToChangeReferenceNumberAndNote?: boolean;
  areaSearch?: AreaSearch | null;
  confirmButtonLabel?: string;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  setRefForFirstField?: (element: any) => void;
};

const FormContent: React.FC<{
  form: FormApi<CreateLeaseFormValues, Partial<CreateLeaseFormValues>>;
  values: any;
  valid: boolean;
  handleSubmit: () => void;
  onClose: Props["onClose"];
  confirmButtonLabel: Props["confirmButtonLabel"];
  leaseAttributes: any;
  userActiveServiceUnit: any;
  isFetchingDistricts: boolean;
  prevMunicipalityRef: React.MutableRefObject<string | null>;
  allowToChangeReferenceNumberAndNote: boolean;
  allowToChangeRelateTo: boolean;
  setRefForFirstField: any;
}> = ({
  form,
  values,
  valid,
  handleSubmit,
  onClose,
  confirmButtonLabel,
  leaseAttributes,
  userActiveServiceUnit,
  isFetchingDistricts,
  prevMunicipalityRef,
  allowToChangeReferenceNumberAndNote,
  allowToChangeRelateTo,
  setRefForFirstField,
}) => {
  const dispatch = useDispatch();
  const districts = useSelector((state) =>
    getDistrictsByMunicipality(state, parseInt(values.municipality)),
  );
  const districtOptions = getDistrictOptions(districts);

  useEffect(() => {
    if (prevMunicipalityRef.current === null) {
      prevMunicipalityRef.current = values.municipality;
      return;
    }

    if (values.municipality !== prevMunicipalityRef.current) {
      if (values.municipality) {
        dispatch(fetchDistrictsByMunicipality(parseInt(values.municipality)));
      }
      if (values.district) {
        // When municipality changes, clear district field
        form.change(CreateLeaseFormFieldNames.DISTRICT, "");
      }
      prevMunicipalityRef.current = values.municipality;
    }
    // Intended not to react to `values.district` updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.municipality, form, dispatch]);

  return (
    <div>
      <Row>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.STATE)}
          >
            <FormField
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseFieldPaths.STATE,
              )}
              name={CreateLeaseFormFieldNames.STATE}
              setRefForField={setRefForFirstField}
              overrideValues={{
                label: LeaseFieldTitles.STATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATE)}
            />
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseFieldPaths.SERVICE_UNIT,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SERVICE_UNIT)}
              >
                {LeaseFieldTitles.SERVICE_UNIT}
              </FormTextTitle>
              <FormText>
                {userActiveServiceUnit.name ? userActiveServiceUnit.name : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.TYPE)}
          >
            <FormField
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseFieldPaths.TYPE,
              )}
              name={CreateLeaseFormFieldNames.TYPE}
              overrideValues={{
                label: LeaseFieldTitles.TYPE,
                fieldType: FieldTypes.LEASE_TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.TYPE)}
            />
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseFieldPaths.MUNICIPALITY,
            )}
          >
            <FormField
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseFieldPaths.MUNICIPALITY,
              )}
              name={CreateLeaseFormFieldNames.MUNICIPALITY}
              overrideValues={{
                label: LeaseFieldTitles.MUNICIPALITY,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MUNICIPALITY)}
            />
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseFieldPaths.DISTRICT,
            )}
          >
            <FormField
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseFieldPaths.DISTRICT,
              )}
              filterOption={filterOptionsByLabel}
              name={CreateLeaseFormFieldNames.DISTRICT}
              overrideValues={{
                label: LeaseFieldTitles.DISTRICT,
                options: districtOptions,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.DISTRICT)}
              isLoading={isFetchingDistricts}
            />
          </Authorization>
        </Column>
      </Row>
      {allowToChangeReferenceNumberAndNote && (
        <Row>
          <Column small={4}>
            <Authorization
              allow={isFieldAllowedToEdit(
                leaseAttributes,
                LeaseFieldPaths.REFERENCE_NUMBER,
              )}
            >
              <FormField
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseFieldPaths.REFERENCE_NUMBER,
                )}
                name={CreateLeaseFormFieldNames.REFERENCE_NUMBER}
                validate={referenceNumber}
                overrideValues={{
                  label: LeaseFieldTitles.REFERENCE_NUMBER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REFERENCE_NUMBER)}
              />
            </Authorization>
          </Column>
          <Column small={8}>
            <Authorization
              allow={isFieldAllowedToEdit(
                leaseAttributes,
                LeaseFieldPaths.NOTE,
              )}
            >
              <FormField
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseFieldPaths.NOTE,
                )}
                name={CreateLeaseFormFieldNames.NOTE}
                overrideValues={{
                  label: LeaseFieldTitles.NOTE,
                  fieldType: FieldTypes.TEXTAREA,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTE)}
              />
            </Authorization>
          </Column>
        </Row>
      )}
      <Row>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseFieldPaths.APPLICATION_RECEIVED_AT,
            )}
          >
            <FormField
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseFieldPaths.APPLICATION_RECEIVED_AT,
              )}
              name={CreateLeaseFormFieldNames.APPLICATION_RECEIVED_AT}
              overrideValues={{
                fieldType: FieldTypes.DATE,
                label: LeaseFieldTitles.APPLICATION_RECEIVED_AT,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseFieldPaths.APPLICATION_RECEIVED_AT,
              )}
            />
          </Authorization>
        </Column>
      </Row>
      {allowToChangeRelateTo && (
        <Row>
          <Column small={4}>
            <Authorization
              allow={isFieldAllowedToEdit(
                leaseAttributes,
                LeaseFieldPaths.RELATE_TO,
              )}
            >
              <FormField
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseFieldPaths.RELATE_TO,
                )}
                name={CreateLeaseFormFieldNames.RELATE_TO}
                overrideValues={{
                  fieldType: FieldTypes.LEASE,
                  label: LeaseFieldTitles.RELATE_TO,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.RELATE_TO)}
              />
            </Authorization>
          </Column>
        </Row>
      )}

      <ModalButtonWrapper>
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onClose}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!valid || isFetchingDistricts}
          onClick={handleSubmit}
          text={confirmButtonLabel || "Luo tunnus"}
        />
      </ModalButtonWrapper>
    </div>
  );
};

const CreateLeaseForm: React.FC<Props> = ({
  allowToChangeRelateTo,
  allowToChangeReferenceNumberAndNote,
  areaSearch,
  confirmButtonLabel,
  onClose,
  onSubmit,
  setRefForFirstField,
}) => {
  const leaseAttributes = useSelector(getLeaseAttributes);
  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);
  const isFetchingDistricts = useSelector(getIsFetchingDistricts);

  const prevMunicipalityRef = useRef(null);

  const initialValues = useMemo(() => {
    const values: Partial<CreateLeaseFormValues> = {};
    if (areaSearch) {
      values[CreateLeaseFormFieldNames.APPLICATION_RECEIVED_AT] =
        formatDate(areaSearch?.received_date, "yyyy-MM-dd") || null;
      values[CreateLeaseFormFieldNames.START_DATE] =
        formatDate(areaSearch?.start_date, "yyyy-MM-dd") || null;
      values[CreateLeaseFormFieldNames.END_DATE] =
        formatDate(areaSearch?.end_date, "yyyy-MM-dd") || null;
      values[CreateLeaseFormFieldNames.AREA_SEARCH_ID] = areaSearch.id;
    }
    if (userActiveServiceUnit) {
      values[CreateLeaseFormFieldNames.SERVICE_UNIT] = userActiveServiceUnit.id;
    }
    return values;
  }, [areaSearch, userActiveServiceUnit]);

  if (!userActiveServiceUnit) return null;

  return (
    <Form
      initialValues={initialValues}
      onSubmit={(values: CreateLeaseFormValues) =>
        onSubmit(getPayloadCreateLease(values))
      }
    >
      {({ form, values, valid, handleSubmit }) => (
        <FormContent
          form={form}
          values={values}
          valid={valid}
          handleSubmit={handleSubmit}
          confirmButtonLabel={confirmButtonLabel}
          onClose={onClose}
          leaseAttributes={leaseAttributes}
          userActiveServiceUnit={userActiveServiceUnit}
          isFetchingDistricts={isFetchingDistricts}
          prevMunicipalityRef={prevMunicipalityRef}
          allowToChangeReferenceNumberAndNote={
            allowToChangeReferenceNumberAndNote || false
          }
          allowToChangeRelateTo={allowToChangeRelateTo || false}
          setRefForFirstField={setRefForFirstField}
        />
      )}
    </Form>
  );
};

export default CreateLeaseForm;
