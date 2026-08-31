import React, { useCallback } from "react";
import { Form } from "react-final-form";
import { useAppSelector } from "@/root/hooks";
import { Row, Column } from "@/components/grid/Grid";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { FieldTypes } from "@/enums";
import {
  InvoiceNoteFieldPaths,
  InvoiceNoteFieldTitles,
} from "@/invoiceNote/enums";
import { ButtonColors } from "@/components/enums";
import { getFieldAttributes } from "@/util/helpers";
import { getAttributes } from "@/invoiceNote/selectors";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UserServiceUnit } from "@/usersPermissions/types";

type Props = {
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
};

const CreateInvoiceNoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const invoiceNoteAttributes: Attributes = useAppSelector(getAttributes);
  const userActiveServiceUnit: UserServiceUnit = useAppSelector(
    getUserActiveServiceUnit,
  );

  const handleSubmitData = useCallback(
    (data: Record<string, any>) => {
      onSubmit({
        ...data,
        lease: data.lease ? Number(data.lease.value) : null,
      });
    },
    [onSubmit],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Luo laskujen tiedote">
      {isOpen && (
        <Form
          onSubmit={handleSubmitData}
          initialValues={{}}
          render={({ handleSubmit, valid }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Column small={4}>
                  <FormField
                    fieldAttributes={getFieldAttributes(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.LEASE,
                    )}
                    name="lease"
                    disableDirty
                    overrideValues={{
                      fieldType: FieldTypes.LEASE,
                      label: InvoiceNoteFieldTitles.LEASE,
                    }}
                    serviceUnit={userActiveServiceUnit}
                  />
                </Column>
                <Column small={4}>
                  <FormField
                    fieldAttributes={getFieldAttributes(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
                    )}
                    name="billing_period_start_date"
                    disableDirty
                    overrideValues={{
                      label: InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE,
                    }}
                  />
                </Column>
                <Column small={4}>
                  <FormField
                    fieldAttributes={getFieldAttributes(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
                    )}
                    name="billing_period_end_date"
                    disableDirty
                    overrideValues={{
                      label: InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE,
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12}>
                  <FormField
                    fieldAttributes={getFieldAttributes(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.NOTES,
                    )}
                    name="notes"
                    disableDirty
                    overrideValues={{
                      label: InvoiceNoteFieldTitles.NOTES,
                      fieldType: FieldTypes.TEXTAREA,
                    }}
                  />
                </Column>
              </Row>

              <ModalButtonWrapper>
                <Button
                  className={ButtonColors.ALERT}
                  onClick={onClose}
                  text="Peruuta"
                />
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={!valid}
                  onClick={handleSubmit}
                  type="submit"
                  text="Tallenna"
                />
              </ModalButtonWrapper>
            </form>
          )}
        />
      )}
    </Modal>
  );
};

export default CreateInvoiceNoteModal;
