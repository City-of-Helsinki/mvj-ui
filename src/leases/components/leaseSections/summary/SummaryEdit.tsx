import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import { Form } from "react-final-form";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import Collapse from "@/components/collapse/Collapse";
import Divider from "@/components/content/Divider";
import ExternalLink from "@/components/links/ExternalLink";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ListItem from "@/components/content/ListItem";
import ListItems from "@/components/content/ListItems";
import LeaseHistoryEdit from "./LeaseHistoryEdit";
import SummaryLeaseInfo from "./SummaryLeaseInfo";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import { receiveCollapseStates as receiveCollapseStatesAction } from "@/leases/actions";
import { FieldTypes, FormNames, ViewModes } from "@/enums";
import {
  LeaseContractsFieldPaths,
  LeaseFieldTitles,
  LeaseFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { validateSummaryForm } from "@/leases/formValidators";
import { getContentLeaseSummary } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  hasPermissions,
  isFieldAllowedToRead,
  isFieldAllowedToEdit,
  formatDate,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { internalOrder, referenceNumber } from "@/components/form/validations";
import type { Attributes } from "types";
import type { FormApi } from "final-form";

type Props = {
  formApi: FormApi;
};

const SummaryEdit: React.FC<Props> = ({ formApi }: Props) => {
  const formName = FormNames.LEASE_SUMMARY;

  const attributes: Attributes = useSelector(getAttributes);
  const currentLease = useSelector(getCurrentLease);
  const collapseStateBasic = useSelector((state) =>
    getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic`),
  );
  const collapseStateStatistical = useSelector((state) =>
    getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.statistical`),
  );
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);

  const dispatch = useDispatch();
  const receiveCollapseStates = (
    states: Parameters<typeof receiveCollapseStatesAction>[0],
  ) => dispatch(receiveCollapseStatesAction(states));

  const classificationOptions = useMemo(
    () => getFieldOptions(attributes, LeaseFieldPaths.CLASSIFICATION),
    [attributes],
  );

  const summary = useMemo(
    () => getContentLeaseSummary(currentLease),
    [currentLease],
  );

  const handleCollapseToggle = (key: string, val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [key]: val,
        },
      },
    });
  };

  const handleBasicInfoCollapseToggle = (val: boolean) => {
    handleCollapseToggle("basic", val);
  };

  const handleStatisticalInfoCollapseToggle = (val: boolean) => {
    handleCollapseToggle("statistical", val);
  };

  const referenceNumberReadOnlyRenderer = (
    value: string | null | undefined,
  ) => {
    if (value) {
      return (
        <FormText>
          <ExternalLink
            className="no-margin"
            href={getReferenceNumberLink(value)}
            text={value}
          />
        </FormText>
      );
    } else {
      return <FormText>-</FormText>;
    }
  };

  const infillDevelopmentCompensations =
    summary.infill_development_compensations;
  const matchingBasisOfRents = summary.matching_basis_of_rents;
  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {({ handleSubmit, errors }) => (
        <form onSubmit={handleSubmit}>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SUMMARY)}
          >
            {LeaseFieldTitles.SUMMARY}
          </Title>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseFieldPaths.CLASSIFICATION,
            )}
          >
            <WarningContainer hideIcon>
              {summary.classification
                ? getLabelOfOption(
                    classificationOptions,
                    summary.classification,
                  )
                : "-"}
            </WarningContainer>
          </Authorization>
          <Divider />
          <Row className="summary__content-wrapper">
            <Column small={12} medium={8} large={9}>
              <Collapse
                defaultOpen={
                  collapseStateBasic !== undefined ? collapseStateBasic : true
                }
                hasErrors={isSaveClicked && !isEmpty(errors)}
                headerTitle={LeaseFieldTitles.SUMMARY_BASIC_INFO}
                onToggle={handleBasicInfoCollapseToggle}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseFieldPaths.SUMMARY_BASIC_INFO,
                )}
              >
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.STATE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.STATE,
                        )}
                        name="state"
                        overrideValues={{
                          label: LeaseFieldTitles.STATE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATE)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.START_DATE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.START_DATE,
                        )}
                        name="start_date"
                        overrideValues={{
                          label: LeaseFieldTitles.START_DATE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.START_DATE,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.END_DATE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.END_DATE,
                        )}
                        name="end_date"
                        overrideValues={{
                          label: LeaseFieldTitles.END_DATE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.END_DATE)}
                      />
                    </Authorization>
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.LESSOR,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.LESSOR,
                        )}
                        name="lessor"
                        overrideValues={{
                          fieldType: FieldTypes.LESSOR,
                          label: LeaseFieldTitles.LESSOR,
                        }}
                        serviceUnit={currentLease.service_unit}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.LESSOR)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.PREPARER,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.PREPARER,
                        )}
                        name="preparer"
                        overrideValues={{
                          fieldType: FieldTypes.USER,
                          label: LeaseFieldTitles.PREPARER,
                        }}
                        serviceUnit={currentLease.service_unit}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.PREPARER)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.CLASSIFICATION,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.CLASSIFICATION,
                        )}
                        name="classification"
                        overrideValues={{
                          label: "Julkisuusluokka",
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.CLASSIFICATION,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.SERVICE_UNIT,
                      )}
                    >
                      <>
                        <FormTextTitle
                          uiDataKey={getUiDataLeaseKey(
                            LeaseFieldPaths.SERVICE_UNIT,
                          )}
                        >
                          {LeaseFieldTitles.SERVICE_UNIT}
                        </FormTextTitle>
                        <FormText>
                          {summary.service_unit
                            ? summary.service_unit.name ||
                              summary.service_unit.id
                            : "-"}
                        </FormText>
                      </>
                    </Authorization>
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.INTENDED_USE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.INTENDED_USE,
                        )}
                        name="intended_use"
                        overrideValues={{
                          fieldType: FieldTypes.INTENDED_USE,
                          label: LeaseFieldTitles.INTENDED_USE,
                        }}
                        serviceUnit={currentLease.service_unit}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.INTENDED_USE,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={8}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.INTENDED_USE_NOTE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.INTENDED_USE_NOTE,
                        )}
                        name="intended_use_note"
                        overrideValues={{
                          label: LeaseFieldTitles.INTENDED_USE_NOTE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.INTENDED_USE_NOTE,
                        )}
                      />
                    </Authorization>
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.FINANCING,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.FINANCING,
                        )}
                        name="financing"
                        overrideValues={{
                          label: LeaseFieldTitles.FINANCING,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.FINANCING)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.MANAGEMENT,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.MANAGEMENT,
                        )}
                        name="management"
                        overrideValues={{
                          label: LeaseFieldTitles.MANAGEMENT,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.MANAGEMENT,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.TRANSFERABLE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.TRANSFERABLE,
                        )}
                        name="transferable"
                        overrideValues={{
                          label: LeaseFieldTitles.TRANSFERABLE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.TRANSFERABLE,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.HITAS,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.HITAS,
                        )}
                        name="hitas"
                        overrideValues={{
                          label: LeaseFieldTitles.HITAS,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HITAS)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.RESERVATION_PROCEDURE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.RESERVATION_PROCEDURE,
                        )}
                        name="reservation_procedure"
                        overrideValues={{
                          label: LeaseFieldTitles.RESERVATION_PROCEDURE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.RESERVATION_PROCEDURE,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={hasPermissions(
                        usersPermissions,
                        UsersPermissions.VIEW_BASISOFRENT,
                      )}
                    >
                      <>
                        <FormTextTitle
                          uiDataKey={getUiDataLeaseKey(
                            LeaseFieldPaths.MATCHING_BASIS_OF_RENTS,
                          )}
                        >
                          {LeaseFieldTitles.MATCHING_BASIS_OF_RENTS}
                        </FormTextTitle>
                        {!matchingBasisOfRents ||
                        !matchingBasisOfRents.length ? (
                          <FormText>-</FormText>
                        ) : (
                          <ListItems>
                            {matchingBasisOfRents.map((item, index1) => {
                              return get(item, "property_identifiers", []).map(
                                (property, index2) => (
                                  <ListItem key={`${index1}_${index2}`}>
                                    <ExternalLink
                                      className="no-margin"
                                      href={`${getRouteById(Routes.RENT_BASIS)}/${item.id}`}
                                      text={property.identifier}
                                    />
                                  </ListItem>
                                ),
                              );
                            })}
                          </ListItems>
                        )}
                      </>
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={hasPermissions(
                        usersPermissions,
                        UsersPermissions.VIEW_INFILLDEVELOPMENTCOMPENSATION,
                      )}
                    >
                      <>
                        <FormTextTitle
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            LeaseFieldPaths.INFILL_DEVELOPMENT_COMPENSATIONS,
                          )}
                        >
                          {LeaseFieldTitles.INFILL_DEVELOPMENT_COMPENSATIONS}
                        </FormTextTitle>
                        {!infillDevelopmentCompensations ||
                        !infillDevelopmentCompensations.length ? (
                          <FormText>-</FormText>
                        ) : (
                          <ListItems>
                            {infillDevelopmentCompensations.map((item) => (
                              <ListItem key={item.id}>
                                <ExternalLink
                                  className="no-margin"
                                  href={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${item.id}`}
                                  text={item.name || item.id}
                                />
                              </ListItem>
                            ))}
                          </ListItems>
                        )}
                      </>
                    </Authorization>
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.NOTICE_PERIOD,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.NOTICE_PERIOD,
                        )}
                        name="notice_period"
                        overrideValues={{
                          label: LeaseFieldTitles.NOTICE_PERIOD,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.NOTICE_PERIOD,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={8}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.NOTICE_NOTE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.NOTICE_NOTE,
                        )}
                        name="notice_note"
                        overrideValues={{
                          label: LeaseFieldTitles.NOTICE_NOTE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.NOTICE_NOTE,
                        )}
                      />
                    </Authorization>
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.REFERENCE_NUMBER,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.REFERENCE_NUMBER,
                        )}
                        name="reference_number"
                        validate={referenceNumber}
                        readOnlyValueRenderer={referenceNumberReadOnlyRenderer}
                        overrideValues={{
                          label: LeaseFieldTitles.REFERENCE_NUMBER,
                          fieldType: FieldTypes.REFERENCE_NUMBER,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.REFERENCE_NUMBER,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={8}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.NOTE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.NOTE,
                        )}
                        name="note"
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
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseContractsFieldPaths.CONTRACT_NUMBER,
                      )}
                    >
                      <>
                        <FormTextTitle
                          uiDataKey={getUiDataLeaseKey(
                            LeaseFieldPaths.CONTRACT_NUMBERS,
                          )}
                        >
                          {LeaseFieldTitles.CONTRACT_NUMBERS}
                        </FormTextTitle>
                        <FormText>{summary.contract_numbers || "-"}</FormText>
                      </>
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.IS_SUBJECT_TO_VAT,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.IS_SUBJECT_TO_VAT,
                        )}
                        name="is_subject_to_vat"
                        overrideValues={{
                          label: LeaseFieldTitles.IS_SUBJECT_TO_VAT,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.IS_SUBJECT_TO_VAT,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    {summary.arrangement_decision && (
                      <Authorization
                        allow={isFieldAllowedToRead(
                          attributes,
                          LeaseContractsFieldPaths.CONTRACTS,
                        )}
                      >
                        <>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseFieldPaths.ARRANGEMENT_DECISION,
                            )}
                          >
                            {LeaseFieldTitles.ARRANGEMENT_DECISION}
                          </FormTextTitle>
                          <FormText>
                            {summary.arrangement_decision ? "Kyllä" : "Ei"}
                          </FormText>
                        </>
                      </Authorization>
                    )}
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.INTERNAL_ORDER,
                      )}
                    >
                      {isFieldAllowedToEdit(
                        attributes,
                        LeaseFieldPaths.INTERNAL_ORDER,
                      ) ? (
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(
                            attributes,
                            LeaseFieldPaths.INTERNAL_ORDER,
                          )}
                          name="internal_order"
                          validate={internalOrder}
                          readOnlyValueRenderer={
                            referenceNumberReadOnlyRenderer
                          }
                          overrideValues={{
                            label: LeaseFieldTitles.INTERNAL_ORDER,
                            fieldType: FieldTypes.STRING,
                          }}
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            LeaseFieldPaths.INTERNAL_ORDER,
                          )}
                        />
                      ) : (
                        <>
                          <FormTextTitle
                            uiDataKey={getUiDataLeaseKey(
                              LeaseFieldPaths.INTERNAL_ORDER,
                            )}
                          >
                            {LeaseFieldTitles.INTERNAL_ORDER}
                          </FormTextTitle>
                          <FormText>{summary.internal_order || "-"}</FormText>
                        </>
                      )}
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.APPLICATION_RECEIVED_AT,
                      )}
                    >
                      {isFieldAllowedToEdit(
                        attributes,
                        LeaseFieldPaths.APPLICATION_METADATA,
                      ) ? (
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(
                            attributes,
                            LeaseFieldPaths.APPLICATION_RECEIVED_AT,
                          )}
                          name="application_metadata.application_received_at"
                          overrideValues={{
                            label: LeaseFieldTitles.APPLICATION_RECEIVED_AT,
                          }}
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            LeaseFieldPaths.APPLICATION_RECEIVED_AT,
                          )}
                        />
                      ) : (
                        <>
                          <FormTextTitle
                            uiDataKey={getUiDataLeaseKey(
                              LeaseFieldPaths.APPLICATION_RECEIVED_AT,
                            )}
                          >
                            {LeaseFieldTitles.APPLICATION_RECEIVED_AT}
                          </FormTextTitle>
                          <FormText>
                            {formatDate(
                              summary.application_metadata
                                ?.application_received_at,
                            ) || "-"}
                          </FormText>
                        </>
                      )}
                    </Authorization>
                  </Column>
                </Row>

                <SummaryLeaseInfo />
              </Collapse>

              <Collapse
                defaultOpen={
                  collapseStateStatistical !== undefined
                    ? collapseStateStatistical
                    : true
                }
                headerTitle={LeaseFieldTitles.SUMMARY_STATISTICAL_INFO}
                onToggle={handleStatisticalInfoCollapseToggle}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseFieldPaths.SUMMARY_STATISTICAL_INFO,
                )}
              >
                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.SPECIAL_PROJECT,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.SPECIAL_PROJECT,
                        )}
                        name="special_project"
                        overrideValues={{
                          label: LeaseFieldTitles.SPECIAL_PROJECT,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.SPECIAL_PROJECT,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.SUPPORTIVE_HOUSING,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.SUPPORTIVE_HOUSING,
                        )}
                        name="supportive_housing"
                        overrideValues={{
                          label: LeaseFieldTitles.SUPPORTIVE_HOUSING,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.SUPPORTIVE_HOUSING,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.STATISTICAL_USE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.STATISTICAL_USE,
                        )}
                        name="statistical_use"
                        overrideValues={{
                          label: LeaseFieldTitles.STATISTICAL_USE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.STATISTICAL_USE,
                        )}
                      />
                    </Authorization>
                  </Column>
                </Row>

                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.REAL_ESTATE_DEVELOPER,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.REAL_ESTATE_DEVELOPER,
                        )}
                        name="real_estate_developer"
                        overrideValues={{
                          label: LeaseFieldTitles.REAL_ESTATE_DEVELOPER,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.REAL_ESTATE_DEVELOPER,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.CONVEYANCE_NUMBER,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.CONVEYANCE_NUMBER,
                        )}
                        name="conveyance_number"
                        overrideValues={{
                          label: LeaseFieldTitles.CONVEYANCE_NUMBER,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.CONVEYANCE_NUMBER,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.BUILDING_SELLING_PRICE,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.BUILDING_SELLING_PRICE,
                        )}
                        name="building_selling_price"
                        overrideValues={{
                          label: LeaseFieldTitles.BUILDING_SELLING_PRICE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.BUILDING_SELLING_PRICE,
                        )}
                      />
                    </Authorization>
                  </Column>
                </Row>

                <Row>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.REGULATED,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.REGULATED,
                        )}
                        name="regulated"
                        overrideValues={{
                          label: LeaseFieldTitles.REGULATED,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REGULATED)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={12} medium={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseFieldPaths.REGULATION,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseFieldPaths.REGULATION,
                        )}
                        name="regulation"
                        overrideValues={{
                          label: LeaseFieldTitles.REGULATION,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseFieldPaths.REGULATION,
                        )}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Collapse>
            </Column>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseFieldPaths.RELATED_LEASES,
              )}
            >
              <Column small={12} medium={4} large={3}>
                <LeaseHistoryEdit serviceUnit={currentLease.service_unit} />
              </Column>
            </Authorization>
          </Row>
        </form>
      )}
    </Form>
  );
};

export default SummaryEdit;
