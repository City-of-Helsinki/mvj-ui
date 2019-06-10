// @flow
import React, {PureComponent} from 'react';
import {isValid} from 'redux-form';
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
  isOpen: boolean,
  onClose: Function,
  valid: boolean,
}

class SteppedDiscountModal extends PureComponent<Props> {
  render() {
    const {
      decisionOptions,
      isOpen,
      onClose,
      valid,
    } = this.props;
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
            onClick={this.handleSave}
            text='Tallenna'
          />
        </ModalButtonWrapper>
      </Modal>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        valid: isValid(FormNames.LEASE_STEPPED_DISCOUNT)(state),
      };
    },
  ),
)(SteppedDiscountModal);
