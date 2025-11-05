import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  change,
  formValueSelector,
  getFormValues,
  reduxForm,
  type InjectedFormProps,
} from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import { FieldTypes, FormNames } from "@/enums";
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

type OwnProps = {
  allowToChangeRelateTo?: boolean;
  allowToChangeReferenceNumberAndNote?: boolean;
  areaSearch?: AreaSearch | null;
  confirmButtonLabel?: string;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  setRefForFirstField?: (element: any) => void;
};
type Props = OwnProps & InjectedFormProps<CreateLeaseFormValues, OwnProps>;

const formName = FormNames.LEASE_CREATE_MODAL;
const formFieldSelector = formValueSelector(formName);

const CreateLeaseForm: React.FC<Props> = ({
  allowToChangeRelateTo,
  allowToChangeReferenceNumberAndNote,
  areaSearch,
  confirmButtonLabel,
  valid,
  onClose,
  onSubmit,
  setRefForFirstField,
}) => {
  const dispatch = useDispatch();

  const leaseAttributes = useSelector(getLeaseAttributes);
  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);
  const isFetchingDistricts = useSelector(getIsFetchingDistricts);

  // Form-specific state from Redux store
  const formValues = useSelector(
    getFormValues(formName),
  ) as CreateLeaseFormValues;

  const municipality = useSelector((state) =>
    formFieldSelector(state, "municipality"),
  );
  const districts = useSelector((state) =>
    getDistrictsByMunicipality(state, municipality),
  );
  // Trigger re-renders when form field values change
  useSelector((state) => formFieldSelector(state, "district"));
  useSelector((state) => formFieldSelector(state, "note"));
  useSelector((state) => formFieldSelector(state, "reference_number"));
  useSelector((state) => formFieldSelector(state, "state"));
  useSelector((state) => formFieldSelector(state, "type"));
  useSelector((state) => formFieldSelector(state, "application_received_at"));

  useEffect(() => {
    if (municipality) {
      dispatch(fetchDistrictsByMunicipality(parseInt(municipality)));
    }
    // When municipality changes, reset district value
    dispatch(change(formName, CreateLeaseFormFieldNames.DISTRICT, ""));
  }, [municipality, fetchDistrictsByMunicipality, dispatch]);

  useEffect(() => {
    if (areaSearch) {
      dispatch(
        change(
          formName,
          CreateLeaseFormFieldNames.APPLICATION_RECEIVED_AT,
          formatDate(areaSearch?.received_date, "yyyy-MM-dd") || null,
        ),
      );
      dispatch(
        change(
          formName,
          CreateLeaseFormFieldNames.START_DATE,
          formatDate(areaSearch?.start_date, "yyyy-MM-dd") || null,
        ),
      );
      dispatch(
        change(
          formName,
          CreateLeaseFormFieldNames.END_DATE,
          formatDate(areaSearch?.end_date, "yyyy-MM-dd") || null,
        ),
      );
      dispatch(
        change(
          formName,
          CreateLeaseFormFieldNames.AREA_SEARCH_ID,
          areaSearch.id,
        ),
      );
    }

    return () => {
      if (areaSearch) {
        dispatch(
          change(
            formName,
            CreateLeaseFormFieldNames.APPLICATION_RECEIVED_AT,
            null,
          ),
        );
        dispatch(change(formName, CreateLeaseFormFieldNames.START_DATE, null));
        dispatch(change(formName, CreateLeaseFormFieldNames.END_DATE, null));
        dispatch(
          change(formName, CreateLeaseFormFieldNames.AREA_SEARCH_ID, null),
        );
      }
    };
  }, [areaSearch, dispatch]);

  useEffect(() => {
    if (userActiveServiceUnit && formValues && !formValues.service_unit) {
      dispatch(
        change(
          formName,
          CreateLeaseFormFieldNames.SERVICE_UNIT,
          userActiveServiceUnit.id,
        ),
      );
    }
  }, [userActiveServiceUnit, formValues, dispatch]);

  const handleCreate = () => {
    onSubmit(getPayloadCreateLease(formValues));
  };

  const districtOptions = getDistrictOptions(districts);

  if (!userActiveServiceUnit) return null;

  return (
    <div>
      <Row>
        <Column small={4}>
          <Authorization
            allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.STATE)}
          >
            <FormFieldLegacy
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
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseFieldPaths.TYPE,
              )}
              name={CreateLeaseFormFieldNames.TYPE}
              overrideValues={{
                label: LeaseFieldTitles.TYPE,
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
            <FormFieldLegacy
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
              <FormFieldLegacy
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
          onClick={handleCreate}
          text={confirmButtonLabel || "Luo tunnus"}
        />
      </ModalButtonWrapper>
    </div>
  );
};

export default reduxForm<CreateLeaseFormValues, OwnProps>({
  form: formName,
})(CreateLeaseForm);
