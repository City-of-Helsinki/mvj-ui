// @flow
import React, {PureComponent} from 'react';
import {Column, Row} from 'react-foundation';
import {connect} from 'react-redux';
import {change, getFormValues, reduxForm} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';

import {getFieldOptions, getLabelOfOption} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import type {Attributes} from '$src/types';
import {getApplicantInfoCheckFormName} from '$src/plotApplications/helpers';
import PlotApplicationApplicantInfoCheckModal from '$src/plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheckModal';
import PlotApplicationInfoCheckCollapse from '$src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse';
import {
  getApplicantInfoCheckAttributes,
  getApplicantInfoCheckSubmissionErrors, getApplicationApplicantInfoCheckData,
} from '$src/plotApplications/selectors';
import {
  ApplicantTypes,
  PlotApplicationApplicantInfoCheckFieldPaths,
  PlotApplicationApplicantInfoCheckFieldTitles,
} from '$src/plotApplications/enums';
import FormText from '$components/form/FormText';

type ItemProps = {
  infoCheckId: number,
  dirty: boolean,
  infoCheckAttributes: Attributes,
  openModal: Function,
  formValues: Object,
};

const PlotApplicationApplicantInfoCheckItem = flowRight(connect((state, props) => {
  const formValues = getFormValues(getApplicantInfoCheckFormName(props.infoCheckId))(state);

  return {
    formValues,
    form: getApplicantInfoCheckFormName(props.infoCheckId),
    infoCheckAttributes: getApplicantInfoCheckAttributes(state),
  };
}), reduxForm({
  destroyOnUnmount: false,
}))(({formValues, dirty, openModal, infoCheckId, infoCheckAttributes}: ItemProps) => {
  const infoCheckStatusOptions = getFieldOptions(infoCheckAttributes, 'state');
  const statusText = getLabelOfOption(infoCheckStatusOptions, formValues.data.state);

  return <Column small={6} key={formValues.kind.type} className={classNames('PlotApplicationApplicantInfoCheckEdit__item', {
    'PlotApplicationApplicantInfoCheckEdit__item--dirty': dirty,
  })}>
    <Row>
      <Column small={8}>
        {formValues.kind.external &&
          <a onClick={() => openModal(formValues, getApplicantInfoCheckFormName(infoCheckId), false)}>
            {formValues.kind.label}
          </a>}
        {!formValues.kind.external && <span>{formValues.kind.label}</span>}
      </Column>
      <Column small={4}>
        {formValues.kind.external && !formValues.data.preparer && <span>{statusText}</span>}
        {(!formValues.kind.external || formValues.data.preparer) &&
          <a onClick={() => openModal(formValues, getApplicantInfoCheckFormName(infoCheckId), true)}>
            {statusText}
            {formValues.data.preparer && <>, {getUserFullName(formValues.data.preparer)}</>}
          </a>}
      </Column>
    </Row>
  </Column>;
});

type OwnProps = {
  section: Object,
  identifier: string,
  answer: Object
};

type Props = {
  ...OwnProps,
  infoCheckAttributes: Attributes,
  infoCheckIds: Array<number>,
  change: typeof change,
  submissionErrors: Array<{
    id: number,
    kind: ?Object,
    error: ?Object | ?Array<Object>,
  }>,
};

type State = {
  isModalOpen: boolean,
  modalCheckItem: ?Object,
  checkItemForm: ?string,
  modalPage: number
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props, State> {
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
              const fieldLabelKey = Object.keys(PlotApplicationApplicantInfoCheckFieldPaths).find(
                (path) => PlotApplicationApplicantInfoCheckFieldPaths[path] === key);

              return <li key={key}>
                {infoCheckItem.kind?.label} - {fieldLabelKey ? PlotApplicationApplicantInfoCheckFieldTitles[fieldLabelKey] : key}:{' '}
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
      <PlotApplicationInfoCheckCollapse className="PlotApplicationApplicantInfoCheckEdit" headerTitle="Hakijan käsittelytiedot">
        <h4>Tarkistettavat dokumentit</h4>
        <Row>
          {infoCheckIds.map((id, index) => <PlotApplicationApplicantInfoCheckItem
            key={index} infoCheckId={id} openModal={this.openModal} />)}
        </Row>
        <PlotApplicationApplicantInfoCheckModal
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
      </PlotApplicationInfoCheckCollapse>
    );
  }
}

export default (connect((state, props) => {
  const formName = getApplicantInfoCheckFormName(props.identifier);
  //const infoCheckIds = getFormValues(getApplicantInfoCheckFormName(props.identifier))(state);
  const infoCheckIds = getApplicationApplicantInfoCheckData(state).filter((item) => item.entry === props.identifier).map((item) => item.id);

  return {
    infoCheckAttributes: getApplicantInfoCheckAttributes(state),
    infoCheckIds,
    formName,
    submissionErrors: getApplicantInfoCheckSubmissionErrors(state, infoCheckIds),
  };
}, {
  change,
})(PlotApplicationApplicantInfoCheck): React$ComponentType<OwnProps>);
