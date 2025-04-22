import React, { Component } from "react";
import { connect } from "react-redux";
import {
  change,
  formValueSelector,
  getFormValues,
  reduxForm,
} from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormField from "@/components/form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import { FieldTypes, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { LeaseFieldPaths, LeaseFieldTitles, LeaseHistoryContentTypes, CreateLeaseFormFieldNames } from "@/leases/enums";
import { filterOptionsByLabel } from "@/components/form/filter";
import { getDistrictOptions } from "@/district/helpers";
import { getPayloadCreateLease } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, getFieldAttributes, isFieldAllowedToEdit } from "@/util/helpers";
import {
  getDistrictsByMunicipality,
  getIsFetching as getIsFetchingDistricts,
} from "@/district/selectors";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { referenceNumber } from "@/components/form/validations";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { DistrictList } from "@/district/types";
import type { UserServiceUnit } from "@/usersPermissions/types";
import { AreaSearch } from "@/areaSearch/types";

type OwnProps = {
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  allowToChangeRelateTo?: boolean;
  allowToChangeReferenceNumberAndNote?: boolean;
  areaSearch: AreaSearch | null;
  confirmButtonLabel?: string;
  ref?: Function;
};

type Props = OwnProps & {
  change: (...args: Array<any>) => any;
  districts: DistrictList;
  fetchDistrictsByMunicipality: (...args: Array<any>) => any;
  formValues: Record<string, any>;
  leaseAttributes: Attributes;
  municipality: string;
  setRefForFirstField?: (...args: Array<any>) => any;
  userActiveServiceUnit: UserServiceUnit;
  valid: boolean;
  district: number | string;
  isFetchingDistricts: boolean;
};

class CreateLeaseForm extends Component<Props> {
  firstField: any;

  componentDidMount() {
    const { areaSearch, change, municipality, fetchDistrictsByMunicipality } = this.props;

    if (municipality) {
      fetchDistrictsByMunicipality(parseInt(municipality));
    }
    if (areaSearch) {
      change(CreateLeaseFormFieldNames.APPLICATION_RECEIVED_AT, formatDate(areaSearch?.received_date, "yyyy-MM-dd") || null);
      change(CreateLeaseFormFieldNames.START_DATE, formatDate(areaSearch?.start_date, "yyyy-MM-dd") || null);
      change(CreateLeaseFormFieldNames.END_DATE, formatDate(areaSearch?.end_date, "yyyy-MM-dd") || null);
      change(CreateLeaseFormFieldNames.RELATED_PLOT_APPLICATION, {
        object_id: areaSearch.id,
        content_type_model: LeaseHistoryContentTypes.AREA_SEARCH,
      });
    }
  }

  componentWillUnmount() {
    const { areaSearch } = this.props;
    if (areaSearch) {
      const { change } = this.props;
      change(CreateLeaseFormFieldNames.APPLICATION_RECEIVED_AT, null);
      change(CreateLeaseFormFieldNames.START_DATE, null);
      change(CreateLeaseFormFieldNames.END_DATE, null);
      change(CreateLeaseFormFieldNames.RELATED_PLOT_APPLICATION, null);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.municipality !== nextProps.municipality) {
      const { change, fetchDistrictsByMunicipality } = this.props;

      if (nextProps.municipality) {
        fetchDistrictsByMunicipality(nextProps.municipality);
        change(CreateLeaseFormFieldNames.DISTRICT, "");
      } else {
        change(CreateLeaseFormFieldNames.DISTRICT, "");
      }
    }
  }

  componentDidUpdate() {
    const { areaSearch, change, formValues, userActiveServiceUnit } = this.props;

    if (userActiveServiceUnit && formValues && !formValues.service_unit) {
      change(CreateLeaseFormFieldNames.SERVICE_UNIT, userActiveServiceUnit.id);
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  setFocus = () => {
    if (this.firstField) {
      this.firstField.focus();
    }
  };
  handleCreate = () => {
    const { areaSearch, formValues, onSubmit } = this.props;
    onSubmit(getPayloadCreateLease(formValues));
  };

  render() {
    const {
      allowToChangeRelateTo,
      allowToChangeReferenceNumberAndNote,
      districts,
      isFetchingDistricts,
      leaseAttributes,
      onClose,
      userActiveServiceUnit,
      valid,
      confirmButtonLabel,
    } = this.props;
    const districtOptions = getDistrictOptions(districts);
    if (!userActiveServiceUnit) return null;
    return (
      <div>
        <Row>
          <Column small={4}>
            <Authorization
              allow={isFieldAllowedToEdit(
                leaseAttributes,
                LeaseFieldPaths.STATE,
              )}
            >
              <FormField
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseFieldPaths.STATE,
                )}
                name={CreateLeaseFormFieldNames.STATE}
                setRefForField={this.setRefForFirstField}
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
                  {userActiveServiceUnit.name
                    ? userActiveServiceUnit.name
                    : "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={4}>
            <Authorization
              allow={isFieldAllowedToEdit(
                leaseAttributes,
                LeaseFieldPaths.TYPE,
              )}
            >
              <FormField
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
                  uiDataKey={getUiDataLeaseKey(
                    LeaseFieldPaths.REFERENCE_NUMBER,
                  )}
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
            onClick={this.handleCreate}
            text={confirmButtonLabel || "Luo tunnus"}
          />
        </ModalButtonWrapper>
      </div>
    );
  }
}

const formName = FormNames.LEASE_CREATE_MODAL;
const selector = formValueSelector(formName);
export default flowRight(
  connect(
    (state) => {
      const municipality = selector(state, "municipality");
      return {
        formValues: getFormValues(formName)(state),
        district: selector(state, "district"),
        districts: getDistrictsByMunicipality(state, municipality),
        leaseAttributes: getLeaseAttributes(state),
        municipality: municipality,
        note: selector(state, "note"),
        reference_number: selector(state, "reference_number"),
        state: selector(state, "state"),
        type: selector(state, "type"),
        application_received_at: selector(state, "application_received_at"),
        isFetchingDistricts: getIsFetchingDistricts(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
      };
    },
    {
      change,
      fetchDistrictsByMunicipality,
    },
    null,
    {
      forwardRef: true,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLeaseForm) as React.ComponentType<OwnProps>;
