// @flow
import React, {Component} from 'react';

import Modal from '$components/modal/Modal';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import Button from '$components/button/Button';
import PlotApplicationApplicantInfoCheckForm from '$src/plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheckForm';
// import TradeRegisterTemplate from "$src/tradeRegister/components/TradeRegisterTemplate";
import CreditDecisionTemplate from '$src/creditDecision/components/CreditDecisionTemplate';
import {ContactTypes} from '$src/contacts/enums';
import {PlotApplicationApplicantInfoCheckExternalTypes} from '$src/plotApplications/enums';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
  infoCheck: Object,
  modalPage: number,
  setPage: Function,
  businessId?: string,
  personId?: string
}

type State = {
  stage: number
};

class PlotApplicationApplicantInfoCheckModal extends Component<Props, State> {
  // TODO: Not entirely the correct type, as wrappedInstance isn't resolved below correctly.
  form: ?typeof PlotApplicationApplicantInfoCheckForm;

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen || prevProps.modalPage !== this.props.modalPage) {
      if (this.form) {
        // $FlowFixMe
        this.form.wrappedInstance.setFocus();
      }
    }
  }

  setRefForForm: Function = (element: any): void => {
    this.form = element;
  }

  render(): React$Node {
    const {
      isOpen,
      onClose,
      onSubmit,
      infoCheck,
      modalPage,
      setPage,
      businessId,
      personId,
    } = this.props;

    let title = '';
    if (infoCheck) {
      if (modalPage === 1) {
        title = 'Ulkoinen palvelu / ' + infoCheck.kind.label;
      } else if (modalPage === 2) {
        title = infoCheck.kind.label;
      }
    }

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        {
          infoCheck && modalPage === 1 && <div>
            {infoCheck.kind.external === PlotApplicationApplicantInfoCheckExternalTypes.CREDIT_INQUIRY && <>
              {businessId && <CreditDecisionTemplate businessId={businessId} contactType={ContactTypes.BUSINESS} />}
              {personId && <CreditDecisionTemplate nin={personId} contactType={ContactTypes.PERSON} />}
            </>}
            {infoCheck.kind.external === PlotApplicationApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY && <>
              <div className="alert">Kaupparekisteri-integraatiota ei ole vielä toteutettu.</div>
            </>}
            {!businessId && !personId && <div className="alert">Hakemuksen osiosta ei löytynyt hakijan tunnistetietoa!</div>}
            <ModalButtonWrapper>
              <Button onClick={() => setPage(2)} text="Jatka" />
            </ModalButtonWrapper>
          </div>
        }
        {
          infoCheck && modalPage === 2 && <div>
            <PlotApplicationApplicantInfoCheckForm
              onSubmit={onSubmit}
              onClose={onClose}
              infoCheck={infoCheck}
              ref={this.setRefForForm} />
          </div>
        }
      </Modal>
    );
  }
}

export default PlotApplicationApplicantInfoCheckModal;
