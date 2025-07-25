import React, { Component } from "react";
import { connect } from "react-redux";
import { change, formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import Button from "@/components/button/Button";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { getAttributes } from "@/plotSearch/selectors";
import { PlotSearchFieldTitles } from "@/plotSearch/enums";
import type { Attributes } from "types";
type OwnProps = {
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  ref: any;
};
type Props = OwnProps & {
  attributes: Attributes;
  change: (...args: Array<any>) => any;
  valid: boolean;
  name: string;
};

class CreatePlotSearchForm extends Component<Props> {
  firstField: any;
  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  setFocus = () => {
    if (this.firstField) {
      this.firstField.focus();
    }
  };
  handleCreate = () => {
    const { onSubmit, name } = this.props;
    onSubmit({
      name: name,
    });
  };

  render() {
    const { attributes, onClose, valid } = this.props;
    return (
      <form>
        <Row>
          <Column small={4}>
            <FormFieldLegacy
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, "name")}
              name="name"
              overrideValues={{
                label: PlotSearchFieldTitles.NAME,
              }}
            />
          </Column>
        </Row>
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text="Peruuta"
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!valid}
            onClick={this.handleCreate}
            text="Luo tonttihaku"
          />
        </ModalButtonWrapper>
      </form>
    );
  }
}

const formName = FormNames.PLOT_SEARCH_CREATE;
const selector = formValueSelector(formName);
export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        name: selector(state, "name"),
      };
    },
    {
      change,
    },
    null,
    {
      forwardRef: true,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(CreatePlotSearchForm) as React.ComponentType<OwnProps>;
