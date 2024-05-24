import React, { Component, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import { ActionTypes, AppConsumer } from "src/app/AppContext";
import AddButtonThird from "src/components/form/AddButtonThird";
import FieldAndRemoveButtonWrapper from "src/components/form/FieldAndRemoveButtonWrapper";
import FormField from "src/components/form/FormField";
import FormTextTitle from "src/components/form/FormTextTitle";
import GreenBox from "src/components/content/GreenBox";
import RemoveButton from "../../../components/form/RemoveButton";
import { receiveFormValidFlags } from "src/landUseContract/actions";
import { ConfirmationModalTexts, FormNames } from "src/enums";
import { ButtonColors } from "src/components/enums";
import { getAttributes, getIsSaveClicked } from "src/landUseContract/selectors";
import type { Attributes } from "src/types";
type InvoicesProps = {
  attributes: Attributes;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
};

const renderInvoices = ({
  attributes,
  fields,
  isSaveClicked
}: InvoicesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <div>
            {!fields || !fields.length && <p>Ei laskuja</p>}
            {fields && !!fields.length && <div>
                <Row>
                  <Column small={3} large={2}><FormTextTitle title='Määrä' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Eräpäivä' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Lähetetty pvm' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Maksettu pvm' /></Column>
                </Row>
                {fields.map((invoice, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_INVOICE.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_INVOICE.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_INVOICE.TITLE
              });
            };

            return <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'invoices.child.children.amount')} invisibleLabel name={`${invoice}.amount`} unit='€' />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'invoices.child.children.due_date')} invisibleLabel name={`${invoice}.due_date`} />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'invoices.child.children.sent_date')} invisibleLabel name={`${invoice}.sent_date`} />
                      </Column>
                      <Column small={3} large={2}>
                        <FieldAndRemoveButtonWrapper field={<FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'invoices.child.children.paid_date')} invisibleLabel name={`${invoice}.paid_date`} />} removeButton={<RemoveButton className='third-level' onClick={handleRemove} title="Poista sopimus" />} />
                      </Column>
                    </Row>;
          })}
              </div>}

            <Row>
              <Column>
                <AddButtonThird label='Lisää lasku' onClick={handleAdd} />
              </Column>
            </Row>
          </div>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  isSaveClicked: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
};

class InvoicesEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LAND_USE_CONTRACT_CONTRACTS]: this.props.valid
      });
    }
  }

  render() {
    const {
      attributes,
      isSaveClicked
    } = this.props;
    return <form>
        <GreenBox>
          <FieldArray attributes={attributes} component={renderInvoices} isSaveClicked={isSaveClicked} name="invoices" />
        </GreenBox>
      </form>;
  }

}

const formName = FormNames.LAND_USE_CONTRACT_INVOICES;
export default flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    isSaveClicked: getIsSaveClicked(state)
  };
}, {
  receiveFormValidFlags
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(InvoicesEdit);