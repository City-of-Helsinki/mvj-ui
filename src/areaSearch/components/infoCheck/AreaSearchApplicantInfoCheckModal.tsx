import React, { Component } from "react";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import Button from "@/components/button/Button";
import AreaSearchApplicantInfoCheckForm from "@/areaSearch/components/infoCheck/AreaSearchApplicantInfoCheckForm";
import TradeRegisterTemplate from "@/tradeRegister/components/TradeRegisterTemplate";
import CreditDecisionTemplate from "@/creditDecision/components/CreditDecisionTemplate";
import { ContactTypes } from "@/contacts/enums";
import { ApplicantInfoCheckExternalTypes } from "@/application/enums";
import type { AreaSearchApplicantInfoCheckFormProps } from "@/areaSearch/components/infoCheck/AreaSearchApplicantInfoCheckForm";

type Props = {
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  infoCheck: Record<string, any>;
  modalPage: number;
  setPage: (...args: Array<any>) => any;
  businessId?: string;
  personId?: string;
  showMarkAll?: boolean;
};

type State = {
  stage: number;
};

class AreaSearchApplicantInfoCheckModal extends Component<Props, State> {
  form: AreaSearchApplicantInfoCheckFormProps | null | undefined;

  componentDidUpdate(prevProps: Props) {
    if (
      (!prevProps.isOpen && this.props.isOpen) ||
      prevProps.modalPage !== this.props.modalPage
    ) {
      if (this.form) {
        this.form.wrappedInstance.setFocus();
      }
    }
  }

  setRefForForm: (...args: Array<any>) => any = (element: any): void => {
    this.form = element;
  };

  render(): JSX.Element {
    const {
      isOpen,
      onClose,
      onSubmit,
      infoCheck,
      modalPage,
      setPage,
      businessId,
      personId,
      showMarkAll,
    } = this.props;
    let title = "";

    if (infoCheck) {
      if (modalPage === 1) {
        title = "Ulkoinen palvelu / " + infoCheck.kind.label;
      } else if (modalPage === 2) {
        title = infoCheck.kind.label;
      }
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        {infoCheck && modalPage === 1 && (
          <div>
            {infoCheck.kind.external ===
              ApplicantInfoCheckExternalTypes.CREDIT_INQUIRY && (
              <>
                {businessId && (
                  <CreditDecisionTemplate
                    businessId={businessId}
                    contactType={ContactTypes.BUSINESS}
                  />
                )}
                {personId && (
                  <CreditDecisionTemplate
                    nin={personId}
                    contactType={ContactTypes.PERSON}
                  />
                )}
              </>
            )}
            {infoCheck.kind.external ===
              ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY && (
              <>
                {businessId ? (
                  <TradeRegisterTemplate businessId={businessId} />
                ) : (
                  <div className="alert">
                    Kaupparekisteriotetta ei voi hakea henkilöhakijalle.
                  </div>
                )}
              </>
            )}
            {!businessId && !personId && (
              <div className="alert">
                Hakemuksen osiosta ei löytynyt hakijan tunnistetietoa!
              </div>
            )}
            <ModalButtonWrapper>
              <Button onClick={() => setPage(2)} text="Jatka" />
            </ModalButtonWrapper>
          </div>
        )}
        {infoCheck && modalPage === 2 && (
          <div>
            <AreaSearchApplicantInfoCheckForm
              onSubmit={onSubmit}
              onClose={onClose}
              infoCheck={infoCheck}
              showMarkAll={showMarkAll}
              ref={this.setRefForForm}
            />
          </div>
        )}
      </Modal>
    );
  }
}

export default AreaSearchApplicantInfoCheckModal;
