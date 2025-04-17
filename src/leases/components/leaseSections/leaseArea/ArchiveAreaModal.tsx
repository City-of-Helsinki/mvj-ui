import React, { Component } from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import Modal from "@/components/modal/Modal";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "@/leases/enums";
import { ButtonColors } from "@/components/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
type Props = {
  archivedNote: string;
  archivedDecision: number | null | undefined;
  attributes: Attributes;
  decisionOptions: Array<Record<string, any>>;
  label: string;
  onArchive: (...args: Array<any>) => any;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  open: boolean;
  valid: boolean;
};

class ArchiveAreaModal extends Component<Props> {
  firstField: any;

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.open && this.props.open) {
      if (this.firstField) {
        this.firstField.focus();
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  handleArchive = () => {
    const { archivedDecision, archivedNote, onArchive } = this.props;
    onArchive({
      archived_at: new Date().toISOString(),
      archived_note: archivedNote,
      archived_decision: archivedDecision,
    });
  };

  render() {
    const { attributes, decisionOptions, onCancel, onClose, open, valid } =
      this.props;
    return (
      <div>
        <Modal
          className="modal-small modal-autoheight"
          title={ConfirmationModalTexts.ARCHIVE_LEASE_AREA.TITLE}
          isOpen={open}
          onClose={onClose}
        >
          <FormText>{ConfirmationModalTexts.ARCHIVE_LEASE_AREA.LABEL}</FormText>
          <Row>
            <Column>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreasFieldPaths.ARCHIVED_DECISION,
                )}
              >
                <FormFieldLegacy
                  setRefForField={this.setRefForFirstField}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseAreasFieldPaths.ARCHIVED_DECISION,
                  )}
                  name="archived_decision"
                  overrideValues={{
                    label: LeaseAreasFieldTitles.ARCHIVED_DECISION,
                    options: decisionOptions,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.ARCHIVED_DECISION,
                  )}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreasFieldPaths.ARCHIVED_NOTE,
                )}
              >
                <FormFieldLegacy
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseAreasFieldPaths.ARCHIVED_NOTE,
                  )}
                  name="archived_note"
                  overrideValues={{
                    label: LeaseAreasFieldTitles.ARCHIVED_NOTE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.ARCHIVED_NOTE,
                  )}
                />
              </Authorization>
            </Column>
          </Row>
          <div className="confirmation-modal__footer">
            <Button
              className={ButtonColors.SECONDARY}
              onClick={onCancel}
              text="Peruuta"
            />
            <Button
              className={ButtonColors.SUCCESS}
              disabled={!valid}
              onClick={this.handleArchive}
              text={ConfirmationModalTexts.ARCHIVE_LEASE_AREA.BUTTON}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

const formName = FormNames.LEASE_ARCHIVE_AREA;
const selector = formValueSelector(formName);
export default flowRight(
  connect((state) => {
    return {
      archivedDecision: selector(state, "archived_decision"),
      archivedNote: selector(state, "archived_note"),
      attributes: getAttributes(state),
    };
  }),
  reduxForm({
    form: formName,
  }),
)(ArchiveAreaModal) as React.ComponentType<any>;
