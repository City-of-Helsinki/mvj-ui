import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Collapse from "@/components/collapse/Collapse";
import DecisionConditionsEdit from "./DecisionConditionsEdit";
import FormField from "@/components/form/final-form/FormField";
import { receiveCollapseStates } from "@/leases/actions";
import { FieldTypes, FormNames, ViewModes } from "@/enums";
import {
  LeaseDecisionConditionsFieldPaths,
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getDecisionById } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { referenceNumber } from "@/components/form/validations";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  field: string;
  decisionId: number;
  onAttach: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
};

const formName = FormNames.LEASE_DECISIONS;

const DecisionItemEdit: React.FC<Props> = ({
  field,
  onAttach,
  onRemove,
  decisionId,
}) => {
  const attributes: Attributes = useSelector(getAttributes);
  const currentLease: Lease = useSelector(getCurrentLease);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const dispatch = useDispatch();

  const errors = useSelector((state) => getErrorsByFormName(state, formName));

  const conditionsCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${decisionId}.conditions`,
    ),
  );

  const decisionCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${decisionId}.decision`,
    ),
  );

  const handleCollapseToggle = (key: string, val: boolean) => {
    if (!decisionId) {
      return;
    }
    dispatch(
      receiveCollapseStates({
        [ViewModes.EDIT]: {
          [FormNames.LEASE_DECISIONS]: {
            [decisionId]: {
              [key]: val,
            },
          },
        },
      }),
    );
  };

  const handleDecisionCollapseToggle = (val: boolean) => {
    handleCollapseToggle("decision", val);
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("conditions", val);
  };

  const handleAttach = () => {
    onAttach(decisionId);
  };

  const sectionReadOnlyRenderer = (value: string | null | undefined) =>
    value ? `${value} §` : "-";

  const decisionMakerOptions = getFieldOptions(
    attributes,
    LeaseDecisionsFieldPaths.DECISION_MAKER,
  );
  const typeOptions = getFieldOptions(
    attributes,
    LeaseDecisionsFieldPaths.TYPE,
  );
  const decisionErrors = get(errors, field),
    savedDecision = getDecisionById(currentLease, decisionId);
  return (
    <Collapse
      defaultOpen={
        decisionCollapseState !== undefined ? decisionCollapseState : true
      }
      hasErrors={isSaveClicked && !isEmpty(decisionErrors)}
      headerTitle={
        savedDecision ? (
          <>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.DECISION_MAKER,
              )}
            >
              <span>
                {getLabelOfOption(
                  decisionMakerOptions,
                  get(savedDecision, "decision_maker"),
                ) || "-"}
              </span>
            </Authorization>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.DECISION_DATE,
              )}
            >
              {savedDecision.decision_date ? (
                <span>
                  &nbsp;&nbsp;{formatDate(savedDecision.decision_date)}
                </span>
              ) : null}
            </Authorization>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.SECTION,
              )}
            >
              {savedDecision.section ? (
                <span>&nbsp;&nbsp;{savedDecision.section} §</span>
              ) : null}
            </Authorization>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.TYPE,
              )}
            >
              {savedDecision.type ? (
                <span>
                  &nbsp;&nbsp;
                  {getLabelOfOption(typeOptions, savedDecision.type)}
                </span>
              ) : null}
            </Authorization>
            {!!savedDecision.conditions &&
              !!savedDecision.conditions.length &&
              ` (${savedDecision.conditions.length} ${savedDecision.conditions.length === 1 ? "ehto" : "ehtoa"})`}
          </>
        ) : (
          "-"
        )
      }
      onAttach={
        decisionId &&
        hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION)
          ? handleAttach
          : null
      }
      onRemove={
        hasPermissions(usersPermissions, UsersPermissions.DELETE_DECISION)
          ? onRemove
          : null
      }
      onToggle={handleDecisionCollapseToggle}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.DECISION_MAKER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseDecisionsFieldPaths.DECISION_MAKER,
                )}
                name={`${field}.decision_maker`}
                overrideValues={{
                  label: LeaseDecisionsFieldTitles.DECISION_MAKER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseDecisionsFieldPaths.DECISION_MAKER,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.DECISION_DATE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseDecisionsFieldPaths.DECISION_DATE,
                )}
                name={`${field}.decision_date`}
                overrideValues={{
                  label: LeaseDecisionsFieldTitles.DECISION_DATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseDecisionsFieldPaths.DECISION_DATE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={1}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.SECTION,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseDecisionsFieldPaths.SECTION,
                )}
                name={`${field}.section`}
                unit="§"
                readOnlyValueRenderer={sectionReadOnlyRenderer}
                overrideValues={{
                  label: LeaseDecisionsFieldTitles.SECTION,
                }}
                enableUiDataEdit
                tooltipStyle={{
                  right: 12,
                }}
                uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.SECTION)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={8} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.TYPE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseDecisionsFieldPaths.TYPE,
                )}
                name={`${field}.type`}
                overrideValues={{
                  label: LeaseDecisionsFieldTitles.TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.TYPE)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.REFERENCE_NUMBER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseDecisionsFieldPaths.REFERENCE_NUMBER,
                )}
                name={`${field}.reference_number`}
                validate={referenceNumber}
                overrideValues={{
                  label: LeaseDecisionsFieldTitles.REFERENCE_NUMBER,
                  fieldType: FieldTypes.REFERENCE_NUMBER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseDecisionsFieldPaths.REFERENCE_NUMBER,
                )}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseDecisionsFieldPaths.DESCRIPTION,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseDecisionsFieldPaths.DESCRIPTION,
                )}
                name={`${field}.description`}
                overrideValues={{
                  label: LeaseDecisionsFieldTitles.DESCRIPTION,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseDecisionsFieldPaths.DESCRIPTION,
                )}
              />
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>

      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseDecisionConditionsFieldPaths.CONDITIONS,
        )}
      >
        <FieldArray name={`${field}.conditions`}>
          {(fieldArrayProps) =>
            DecisionConditionsEdit({
              ...fieldArrayProps,
              errors: errors,
              isSaveClicked: isSaveClicked,
              collapseState: conditionsCollapseState,
              onCollapseToggle: handleConditionsCollapseToggle,
            })
          }
        </FieldArray>
      </Authorization>
    </Collapse>
  );
};

export default DecisionItemEdit;
