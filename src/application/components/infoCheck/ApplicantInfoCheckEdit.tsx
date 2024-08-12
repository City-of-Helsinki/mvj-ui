import React, { Component } from "react";
import { Row } from "react-foundation";
import { connect } from "react-redux";
import { change } from "redux-form";
import ApplicantInfoCheckModal from "@/application/components/infoCheck/ApplicantInfoCheckModal";
import { ApplicantInfoCheckFieldPaths, ApplicantInfoCheckFieldTitles, ApplicantTypes } from "@/application/enums";
import ApplicantInfoCheckEditItem from "@/application/components/infoCheck/ApplicantInfoCheckEditItem";
import FormText from "@/components/form/FormText";
import { getApplicantInfoCheckFormName } from "@/application/helpers";
type OwnProps = {
  infoCheckIds: Array<number>;
  answer: Record<string, any>;
  showMarkAll?: boolean;
  submissionErrors: Array<{
    id: number;
    kind: Record<string, any> | null | undefined;
    error: any;
  }>;
};
type Props = OwnProps & {
  change: typeof change;
};
type State = {
  isModalOpen: boolean;
  modalCheckItem: Record<string, any> | null | undefined;
  checkItemForm: string | null | undefined;
  modalPage: number;
};

class ApplicantInfoCheckEdit extends Component<Props, State> {
  state: State = {
    isModalOpen: false,
    modalCheckItem: null,
    checkItemForm: null,
    modalPage: 0
  };
  openModal = (checkItem: Record<string, any>, form: string, skipToForm: boolean): void => {
    this.setState(() => ({
      isModalOpen: true,
      modalCheckItem: checkItem,
      checkItemForm: form,
      modalPage: !skipToForm && checkItem.kind.external ? 1 : 2
    }));
  };
  closeModal = (): void => {
    this.setState(() => ({
      isModalOpen: false,
      modalCheckItem: null,
      checkItemForm: '',
      modalPage: 0
    }));
  };
  setPage = (page: number): void => {
    this.setState(() => ({
      modalPage: page
    }));
  };
  saveInfoCheck = (data: Record<string, any>): void => {
    const {
      change
    } = this.props;
    const {
      checkItemForm
    } = this.state;

    if (checkItemForm) {
      Object.keys(data).forEach(field => {
        change(checkItemForm, `data.${field}`, data[field]);
      });
      this.closeModal();
    }
  };

  renderErrors(): React.ReactNode {
    const {
      submissionErrors
    } = this.props;

    if (submissionErrors.length === 0) {
      return null;
    }

    let content = [];
    submissionErrors.map(infoCheckItem => {
      try {
        if (infoCheckItem.error instanceof Array) {
          content.push(<ul>
            {infoCheckItem.error.map((error, i) => <li key={i}>{error}</li>)}
          </ul>);
        } else if (infoCheckItem.error instanceof Error) {
          content.push(infoCheckItem.error.message);
        } else if (typeof infoCheckItem.error === 'object') {
          const errorObject: Record<string, any> = infoCheckItem.error;
          content.push(<ul>
            {Object.keys(errorObject).map(key => {
              const fieldLabelKey = Object.keys(ApplicantInfoCheckFieldPaths).find(path => ApplicantInfoCheckFieldPaths[path] === key);
              return <li key={key}>
                {infoCheckItem.kind?.label} - {fieldLabelKey ? ApplicantInfoCheckFieldTitles[fieldLabelKey] : key}:{' '}
                {errorObject[key].length !== undefined ? errorObject[key].join(', ') : errorObject[key]}
              </li>;
            })}
          </ul>);
        } else {
          content.push(infoCheckItem.error);
        }
      } catch {
        content.push(JSON.stringify(infoCheckItem.error));
      }
    });
    return <FormText className="alert">
      Tallennus ei onnistunut:{' '}
      {content}
    </FormText>;
  }

  render(): React.ReactNode {
    const {
      isModalOpen,
      modalCheckItem,
      modalPage
    } = this.state;
    const {
      infoCheckIds,
      answer,
      submissionErrors,
      showMarkAll = true
    } = this.props;
    const applicantType = answer?.metadata?.applicantType;
    return <div className="ApplicantInfoCheckEdit">
        <Row>
          {infoCheckIds.map((id, index) => <ApplicantInfoCheckEditItem key={index} formName={getApplicantInfoCheckFormName(id)} openModal={this.openModal} />)}
        </Row>
        <ApplicantInfoCheckModal isOpen={isModalOpen} modalPage={modalPage} setPage={this.setPage} onClose={this.closeModal} onSubmit={data => this.saveInfoCheck(data)} infoCheck={modalCheckItem} businessId={applicantType === ApplicantTypes.COMPANY ? answer.metadata.identifier : undefined} personId={applicantType === ApplicantTypes.PERSON ? answer.metadata.identifier : undefined} showMarkAll={showMarkAll} />
        {submissionErrors && this.renderErrors()}
      </div>;
  }

}

export default (connect(null, {
  change
})(ApplicantInfoCheckEdit) as React.ComponentType<OwnProps>);