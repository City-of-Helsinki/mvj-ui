// @flow
import React from 'react';
import {getFormValues, isValid} from 'redux-form';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import Modal from '$components/modal/Modal';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import SteppedDiscountForm from './SteppedDiscountForm';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';

type Props = {
  decisionOptions: Array<Object>,
  formValues: Object,
  isOpen: boolean,
  onClose: Function,
  onSave: Function,
  valid: boolean,
}

const SteppedDiscountModal = ({
  decisionOptions,
  formValues,
  isOpen,
  onClose,
  onSave,
  valid,
}: Props) => {
  const handleSave = () => {
    onSave(formValues);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Porrastettu alennus'
    >
      <SteppedDiscountForm
        decisionOptions={decisionOptions}
      />

      <ModalButtonWrapper>
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onClose}
          text='Peruuta'
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!valid}
          onClick={handleSave}
          text='Tallenna'
        />
      </ModalButtonWrapper>
    </Modal>
  );
};

const formName = FormNames.LEASE_STEPPED_DISCOUNT;

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        valid: isValid(formName)(state),
      };
    },
  ),
)(SteppedDiscountModal);
