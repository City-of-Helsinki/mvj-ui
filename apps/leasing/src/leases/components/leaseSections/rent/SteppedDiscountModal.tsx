import React from "react";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import SteppedDiscountForm from "./SteppedDiscountForm";
import { ButtonColors } from "@/components/enums";
import { Form } from "react-final-form";

type Props = {
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
};

const SteppedDiscountModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Porrastettu alennus">
      <Form onSubmit={onSave} key={isOpen.toString()}>
        {({ valid, handleSubmit }) => (
          <>
            <SteppedDiscountForm />

            <ModalButtonWrapper>
              <Button
                className={ButtonColors.SECONDARY}
                onClick={onClose}
                text="Peruuta"
                type="button"
              />
              <Button
                className={ButtonColors.SUCCESS}
                disabled={!valid}
                onClick={handleSubmit}
                text="Tallenna"
                type="button"
              />
            </ModalButtonWrapper>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default SteppedDiscountModal;
