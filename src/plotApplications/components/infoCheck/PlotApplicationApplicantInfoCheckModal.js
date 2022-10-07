// @flow
import React, {Component} from 'react';

import Modal from '$components/modal/Modal';
import PlotApplicationInfoCheckForm from "./PlotApplicationInfoCheckForm";
import Button from "../../../components/button/Button";


type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
  infoCheck: Object
}

type State = {
  stage: number
};

class PlotApplicationApplicantInfoCheckModal extends Component<Props, State> {
  form: any;

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen || prevProps.modalPage !== this.props.modalPage) {
      if (this.form) {
        this.form.wrappedInstance.setFocus();
      }
    }
  }

  setRefForForm = (element: any): void => {
    this.form = element;
  }

  render (): React$Node {
    const {
      isOpen,
      onClose,
      onSubmit,
      infoCheck,
      modalPage,
      setPage
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
            {/* TODO */}
            <p>Ei vielä toteutettu</p>
            <Button onClick={() => setPage(2)} text="Ohita" />
          </div>
        }
        {
          infoCheck && modalPage === 2 && <div>
            <PlotApplicationInfoCheckForm
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
