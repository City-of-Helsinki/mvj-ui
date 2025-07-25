import React, { Component } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Authorization from "@/components/authorization/Authorization";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import GreenBox from "@/components/content/GreenBox";
import LeaseItemsEdit from "./LeaseItemsEdit";
import SubTitle from "@/components/content/SubTitle";
import { receiveFormValidFlags } from "@/infillDevelopment/actions";
import { FieldTypes, FormNames } from "@/enums";
import {
  InfillDevelopmentCompensationFieldPaths,
  InfillDevelopmentCompensationFieldTitles,
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeasesFieldTitles,
} from "@/infillDevelopment/enums";
import { getUiDataInfillDevelopmentKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import {
  getAttributes as getInfillDevelopmentAttributes,
  getFormInitialValues,
  getIsSaveClicked,
} from "@/infillDevelopment/selectors";
import { referenceNumber } from "@/components/form/validations";
import type { Attributes } from "types";
import type { InfillDevelopment } from "@/infillDevelopment/types";
type Props = {
  infillDevelopment: InfillDevelopment;
  infillDevelopmentAttributes: Attributes;
  isFocusedOnMount?: boolean;
  isSaveClicked: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
};

class InfillDevelopmentForm extends Component<Props> {
  firstField: any;

  componentDidMount() {
    const { isFocusedOnMount } = this.props;

    if (isFocusedOnMount) {
      this.setFocusOnFirstField();
    }
  }

  componentDidUpdate(prevProps) {
    const { receiveFormValidFlags } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.INFILL_DEVELOPMENT]: this.props.valid,
      });
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  setFocusOnFirstField = () => {
    this.firstField.focus();
  };

  render() {
    const { infillDevelopment, infillDevelopmentAttributes, isSaveClicked } =
      this.props;
    return (
      <form>
        <GreenBox>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.NAME,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.NAME,
                  )}
                  name="name"
                  setRefForField={this.setRefForFirstField}
                  overrideValues={{
                    label: InfillDevelopmentCompensationFieldTitles.NAME,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.NAME,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
                  )}
                  name="detailed_plan_identifier"
                  overrideValues={{
                    label:
                      InfillDevelopmentCompensationFieldTitles.DETAILED_PLAN_IDENTIFIER,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER,
                  )}
                  name="reference_number"
                  validate={referenceNumber}
                  overrideValues={{
                    label:
                      InfillDevelopmentCompensationFieldTitles.REFERENCE_NUMBER,
                    fieldType: FieldTypes.REFERENCE_NUMBER,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.STATE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.STATE,
                  )}
                  name="state"
                  overrideValues={{
                    label: InfillDevelopmentCompensationFieldTitles.STATE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.STATE,
                  )}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.USER,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.USER,
                  )}
                  name="user"
                  overrideValues={{
                    fieldType: FieldTypes.USER,
                    label: InfillDevelopmentCompensationFieldTitles.USER,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.USER,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE,
                  )}
                  name="lease_contract_change_date"
                  overrideValues={{
                    label:
                      InfillDevelopmentCompensationFieldTitles.LEASE_CONTRACT_CHANGE_DATE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={12} medium={4} large={8}>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationFieldPaths.NOTE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.NOTE,
                  )}
                  name="note"
                  overrideValues={{
                    label: InfillDevelopmentCompensationFieldTitles.NOTE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationFieldPaths.NOTE,
                  )}
                />
              </Authorization>
            </Column>
          </Row>

          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES,
            )}
          >
            <>
              <SubTitle
                enableUiDataEdit
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.INFILL_DEVELOPMENT_COMPENSATION_LEASES
                }
              </SubTitle>
              <FieldArray
                component={LeaseItemsEdit}
                infillDevelopment={infillDevelopment}
                isSaveClicked={isSaveClicked}
                name={`infill_development_compensation_leases`}
              />
            </>
          </Authorization>
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.INFILL_DEVELOPMENT;
export default flowRight(
  connect(
    (state) => {
      return {
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        initialValues: getFormInitialValues(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    form: formName,
  }),
)(InfillDevelopmentForm) as React.ComponentType<any>;
