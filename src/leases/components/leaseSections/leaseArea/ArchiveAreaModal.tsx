import React from "react";
import { useRef, useEffect } from "react";
import { Row, Column } from "react-foundation";
import { useSelector } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormText from "@/components/form/FormText";
import Modal from "@/components/modal/Modal";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "@/leases/enums";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import { ButtonColors } from "@/components/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { formValueSelector } from "redux-form";
import { getDecisionOptions } from "@/leases/helpers";
type Props = {
  onArchive: (...args: Array<any>) => any;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  open: boolean;
  valid: boolean;
};

const ArchiveAreaModal: React.FC<Props> = ({
  onArchive,
  onCancel,
  onClose,
  open,
  valid,
}) => {
  const selector = formValueSelector(FormNames.LEASE_AREAS);
  const attributes = useSelector(getAttributes);
  const currentLease = useSelector(getCurrentLease);
  const decisionOptions = getDecisionOptions(currentLease);
  const archivedDecision = useSelector((state) =>
    selector(state, "archived_decision"),
  );
  const archivedNote = useSelector((state) => selector(state, "archived_note"));

  let firstField: any = null;
  const setRefForFirstField = (element: any) => {
    firstField = element;
  };

  // Prevent focus() on first render
  const mounted = useRef(true);
  useEffect(() => {
    if (mounted.current) {
      mounted.current = false;
      return;
    }
    if (open && firstField) {
      firstField.focus();
    }
  }, [open, firstField]);

  const handleArchive = () => {
    onArchive({
      archived_at: new Date().toISOString(),
      archived_note: archivedNote,
      archived_decision: archivedDecision,
    });
  };

  return (
    <div>
      <Modal
        className="modal-small modal-autoheight"
        title={ConfirmationModalTexts.ARCHIVE_LEASE_AREA.TITLE}
        isOpen={open}
        onClose={onClose}
      >
        <>
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
              onClick={handleArchive}
              text={ConfirmationModalTexts.ARCHIVE_LEASE_AREA.BUTTON}
            />
          </div>
        </>
      </Modal>
    </div>
  );
};

export default ArchiveAreaModal;
