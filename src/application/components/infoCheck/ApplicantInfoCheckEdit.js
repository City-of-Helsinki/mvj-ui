// @flow
import React, {Component} from 'react';
import {Row} from 'react-foundation';
import {connect} from 'react-redux';
import {change} from 'redux-form';

import ApplicantInfoCheckModal from '$src/application/components/infoCheck/ApplicantInfoCheckModal';
import {ApplicantInfoCheckFieldPaths, ApplicantInfoCheckFieldTitles, ApplicantTypes} from '$src/application/enums';
import ApplicantInfoCheckEditItem from '$src/application/components/infoCheck/ApplicantInfoCheckEditItem';
import FormText from '$components/form/FormText';
import {getApplicantInfoCheckFormName} from '$src/application/helpers';

type OwnProps = {
  infoCheckIds: Array<number>,
  answer: Object,
  submissionErrors: Array<{
    id: number,
    kind: ?Object,
    error: ?Object | ?Array<Object>,
  }>,
};

type Props = {
  ...OwnProps,
  change: typeof change,
};

type State = {
  isModalOpen: boolean,
  modalCheckItem: ?Object,
  checkItemForm: ?string,
  modalPage: number,
};

class ApplicantInfoCheckEdit extends Component<Props, State> {
  state: State = {
    isModalOpen: false,
    modalCheckItem: null,
    checkItemForm: null,
    modalPage: 0,
  };

  openModal = (checkItem: Object, form: string, skipToForm: boolean): void => {
    this.setState(() => ({
      isModalOpen: true,
      modalCheckItem: checkItem,
      checkItemForm: form,
      modalPage: (!skipToForm && checkItem.kind.external) ? 1 : 2,
    }));
  };

  closeModal = (): void => {
    this.setState(() => ({
      isModalOpen: false,
      modalCheckItem: null,
      checkItemForm: '',
      modalPage: 0,
    }));
  };

  setPage = (page: number): void => {
    this.setState(() => ({
      modalPage: page,
    }));
  }

  saveInfoCheck = (data: Object): void => {
    const {change} = this.props;
    const {checkItemForm} = this.state;

    if (checkItemForm) {
      Object.keys(data).forEach((field) => {
        change(checkItemForm, `data.${field}`, data[field]);
      });

      this.closeModal();
    }
  }

  renderErrors(): React$Node {
    const {submissionErrors} = this.props;

    if (submissionErrors.length === 0) {
      return null;
    }

    let content = [];
    submissionErrors.map((infoCheckItem) => {
      try {
        if (infoCheckItem.error instanceof Array) {
          content.push(<ul>
            {infoCheckItem.error.map((error, i) => <li key={i}>{error}</li>)}
          </ul>);
        } else if (infoCheckItem.error instanceof Error) {
          content.push(infoCheckItem.error.message);
        } else if (typeof infoCheckItem.error === 'object') {
          const errorObject: Object = infoCheckItem.error;
          content.push(<ul>
            {Object.keys(errorObject).map((key) => {
              const fieldLabelKey = Object.keys(ApplicantInfoCheckFieldPaths).find(
                (path) => ApplicantInfoCheckFieldPaths[path] === key);

              return <li key={key}>
                {infoCheckItem.kind?.label} - {fieldLabelKey ? ApplicantInfoCheckFieldTitles[fieldLabelKey] : key}:{' '}
                {errorObject[key].length !== undefined
                  ? errorObject[key].join(', ')
                  : errorObject[key]}
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

  render(): React$Node {
    const {
      isModalOpen,
      modalCheckItem,
      modalPage,
    } = this.state;

    const {
      infoCheckIds,
      answer,
      submissionErrors,
    } = this.props;

    const applicantType = answer?.metadata?.applicantType;

    return (
      <div className="ApplicantInfoCheckEdit">
        <Row>
          {infoCheckIds.map((id, index) => <ApplicantInfoCheckEditItem
            key={index} formName={getApplicantInfoCheckFormName(id)} openModal={this.openModal} />)}
        </Row>
        <ApplicantInfoCheckModal
          isOpen={isModalOpen}
          modalPage={modalPage}
          setPage={this.setPage}
          onClose={this.closeModal}
          onSubmit={(data) => this.saveInfoCheck(data)}
          infoCheck={modalCheckItem}
          businessId={applicantType === ApplicantTypes.COMPANY ? answer.metadata.identifier : undefined}
          personId={applicantType === ApplicantTypes.PERSON ? answer.metadata.identifier : undefined}
        />
        {submissionErrors && this.renderErrors()}
      </div>
    );
  }
}

export default (connect(null, {
  change,
})(ApplicantInfoCheckEdit): React$ComponentType<OwnProps>);
