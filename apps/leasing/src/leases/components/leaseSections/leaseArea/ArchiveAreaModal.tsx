import React from "react";
import { useRef, useEffect } from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useSelector } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormText from "@/components/form/FormText";
import Modal from "@/components/modal/Modal";
import { ConfirmationModalTexts } from "@/enums";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "@/leases/enums";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import { ButtonColors } from "@/components/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import FormField from "@/components/form/final-form/FormField";
import { getDecisionOptions } from "@/leases/helpers";
import { FormApi } from "final-form";
type Props = {
  formApi: FormApi;
  onArchive: (...args: Array<any>) => any;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  open: boolean;
  valid: boolean;
};

const ArchiveAreaModal: React.FC<Props> = ({
  formApi,
  onArchive,
  onCancel,
  onClose,
  open,
  valid,
}) => {
  const attributes = useSelector(getAttributes);
  const currentLease = useSelector(getCurrentLease);
  const decisionOptions = getDecisionOptions(currentLease);

  const archivedDecision = formApi.getFieldState("archived_decision")?.value;
  const archivedNote = formApi.getFieldState("archived_note")?.value;

  const firstField = useRef<any>(null);
  const setRefForFirstField = (element: any) => {
    firstField.current = element;
  };

  // Prevent focus() on first render
  const mounted = useRef(true);
  useEffect(() => {
    if (mounted.current) {
      mounted.current = false;
      return;
    }
    if (open) {
      // Reset form fields when modal opens
      formApi.change("archived_decision", undefined);
      formApi.change("archived_note", undefined);

      if (firstField.current) {
        firstField.current.focus();
      }
    }
  }, [open, firstField, formApi]);

  const handleArchive = () => {
    onArchive({
      archived_at: new Date().toISOString(),
      archived_note: archivedNote,
      archived_decision: archivedDecision,
    });
  };

  return (
    <div>
      {open && (
        <Modal
          className="modal-small modal-autoheight"
          title={ConfirmationModalTexts.ARCHIVE_LEASE_AREA.TITLE}
          isOpen={open}
          onClose={onClose}
        >
          <>
            <FormText>
              {ConfirmationModalTexts.ARCHIVE_LEASE_AREA.LABEL}
            </FormText>
            <Row>
              <Column>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseAreasFieldPaths.ARCHIVED_DECISION,
                  )}
                >
                  <FormField
                    setRefForField={setRefForFirstField}
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
                  <FormField
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
                onClick={handleArchive}
                text={ConfirmationModalTexts.ARCHIVE_LEASE_AREA.BUTTON}
              />
            </div>
          </>
        </Modal>
      )}
    </div>
  );
};

export default ArchiveAreaModal;
