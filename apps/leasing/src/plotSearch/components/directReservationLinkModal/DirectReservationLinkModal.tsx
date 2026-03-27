import React, { Component, Fragment } from "react";
import { flowRight } from "lodash/util";
import { connect } from "react-redux";
import {
  FieldArray,
  getFormValues,
  reduxForm,
  change,
  initialize,
} from "redux-form";
import { Row, Column } from "react-foundation";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import Button from "@/components/button/Button";
import { ButtonColors } from "@/components/enums";
import { FormNames } from "@/enums";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { FieldTypes } from "@/enums";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Loader from "@/components/loader/Loader";
import { getIsCreatingDirectReservationLink } from "@/plotSearch/selectors";
import { createDirectReservationLink } from "@/plotSearch/actions";
type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  targets: Record<string, any>[] | null;
};
type Props = OwnProps & {
  change: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  reset: () => void;
  formValues: Record<string, any>;
  isCreatingDirectReservationLink: boolean;
  createDirectReservationLink: (...args: Array<any>) => any;
};
type RenderTargetProps = {
  fields: any;
  targets: Array<Record<string, any>>;
  change: (...args: Array<any>) => any;
  formValues: Record<string, any>;
};

const renderTargets = ({
  targets,
  change,
  formValues,
}: RenderTargetProps): JSX.Element => (
  <Fragment>
    {!!targets &&
      targets.map((target) => {
        const targetIdentifier =
          (target.plan_unit && target.plan_unit.identifier) ||
          (target.custom_detailed_plan &&
            target.custom_detailed_plan.identifier);
        let isChecked = false;

        if (formValues) {
          isChecked = formValues.targets.includes(target.id);
        }

        const handleChange = () => {
          if (isChecked) {
            change(
              "targets",
              formValues["targets"].filter((id) => id !== target.id),
            );
          } else {
            change("targets", [...formValues["targets"], target.id]);
          }
        };

        return (
          <Column lg={4} sm={4} key={target.id}>
            <FormFieldLabel>Kohteen tunnus</FormFieldLabel>
            <label className="option-label">
              <input
                type="checkbox"
                checked={isChecked}
                name={`${target.id}-selected`}
                onChange={handleChange}
                value={target.id}
              />
              <span>{targetIdentifier}</span>
            </label>
          </Column>
        );
      })}
  </Fragment>
);

class DirectReservationLinkModal extends Component<Props> {
  componentDidUpdate(prevProps: Props): void {
    const { isOpen, reset } = this.props;

    if (isOpen && !prevProps.isOpen) {
      reset();
    }
  }

  componentDidMount() {
    const { initialize, targets } = this.props;

    if (targets) {
      initialize({
        language: "",
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        covering_note: "",
        targets: targets.map((target) => target.id),
        send_copy: false,
        send_mail: true,
      });
    }
  }

  handleSubmit = () => {
    const { onClose, createDirectReservationLink, formValues } = this.props;
    createDirectReservationLink({
      data: formValues,
      callBack: onClose,
    });
  };

  render(): JSX.Element {
    const {
      isOpen,
      onClose,
      targets,
      change,
      formValues,
      isCreatingDirectReservationLink,
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Lähetä henkilökohtainen hakemuslinkki"
        className="DirectReservationLinkModal"
      >
        <p>
          Tällä lomakkeella voit luoda uniikin hakemuslinkin vastaanottajalle
        </p>
        <Row>
          <FieldArray
            component={renderTargets}
            disabled={false}
            formName={FormNames.PLOT_SEARCH_DIRECT_RESERVATION_LINK}
            name={"targets"}
            targets={targets}
            change={change}
            formValues={formValues}
          />
        </Row>
        <Row>
          <Column small={6} large={3}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.CHOICE,
                read_only: false,
                label: "Kieli",
                choices: [
                  {
                    value: "FI",
                    display_name: "Suomi",
                  },
                  {
                    value: "SE",
                    display_name: "Ruotsi",
                  },
                  {
                    value: "EN",
                    display_name: "Englanti",
                  },
                ],
              }}
              name="language"
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} large={3}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.STRING,
                read_only: false,
                label: "Vastaanottajan etunimi",
              }}
              name="first_name"
            />
          </Column>
          <Column small={6} large={3}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.STRING,
                read_only: false,
                label: "Vastaanottajan sukunimi",
              }}
              name="last_name"
            />
          </Column>
          <Column small={6} large={3}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.STRING,
                read_only: false,
                required: true,
                label: "Vastaanottajan sähköpostiosoite",
              }}
              name="email"
            />
          </Column>
          <Column small={6} large={3}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.STRING,
                read_only: false,
                label: "Yrityksen nimi",
              }}
              name="company"
            />
          </Column>
        </Row>
        <Row>
          <Column large={12}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.TEXTAREA,
                read_only: false,
                label: "Saateteksti",
              }}
              name="covering_note"
            />
          </Column>
        </Row>
        <Row>
          <Column large={12}>
            <FormFieldLegacy
              disableDirty
              fieldAttributes={{
                type: FieldTypes.CHECKBOX,
                read_only: false,
                label: "Lähetä kopio viestistä omaan sähköpostiin",
              }}
              overrideValues={{
                options: [
                  {
                    value: true,
                    label: "Kyllä",
                  },
                ],
              }}
              name="send_copy"
            />
          </Column>
        </Row>
        <ModalButtonWrapper>
          <LoaderWrapper className="small-inline-wrapper">
            <Loader
              isLoading={isCreatingDirectReservationLink}
              className="small"
            />
          </LoaderWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text="Peruuta"
          />
          <Button
            disabled={isCreatingDirectReservationLink}
            text="Lähetä"
            onClick={this.handleSubmit}
          />
        </ModalButtonWrapper>
      </Modal>
    );
  }
}

const formName = FormNames.PLOT_SEARCH_DIRECT_RESERVATION_LINK;
export default flowRight(
  connect(
    (state) => ({
      formValues: getFormValues(formName)(state),
      isCreatingDirectReservationLink:
        getIsCreatingDirectReservationLink(state),
    }),
    {
      change,
      initialize,
      createDirectReservationLink,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(DirectReservationLinkModal) as React.ComponentType<OwnProps>;
