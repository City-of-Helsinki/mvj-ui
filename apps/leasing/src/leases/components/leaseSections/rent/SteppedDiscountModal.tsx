import React from "react";
import { getFormValues, isValid } from "redux-form";
import { useSelector } from "react-redux";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import SteppedDiscountForm from "./SteppedDiscountForm";
import { FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
type Props = {
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
};

const formName = FormNames.LEASE_STEPPED_DISCOUNT;
const SteppedDiscountModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const handleSave = () => {
    onSave(formValues);
  };

  const formValues = useSelector(getFormValues(formName));
  const valid = useSelector(isValid(formName));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Porrastettu alennus">
      <SteppedDiscountForm />

      <ModalButtonWrapper>
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onClose}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!valid}
          onClick={handleSave}
          text="Tallenna"
        />
      </ModalButtonWrapper>
    </Modal>
  );
};

export default SteppedDiscountModal;
