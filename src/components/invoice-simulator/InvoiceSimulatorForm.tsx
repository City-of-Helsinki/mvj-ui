import React from "react";
import { reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { FormNames } from "@/enums";
import { getCurrentYear } from "@/util/date";
type Props = {
  onSubmit: (...args: Array<any>) => any;
};

const InvoiceSimulatorForm: React.FC<Props> = ({ onSubmit }) => {
  const handleSubmit = (e: any) => {
    onSubmit();
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Column small={12}>
          <FormFieldLegacy
            fieldAttributes={{
              type: "integer",
              required: false,
              read_only: false,
            }}
            name="invoice_simulator_year"
            disableDirty
            overrideValues={{
              label: "Vuosi",
            }}
          />
        </Column>
      </Row>
    </form>
  );
};

const formName = FormNames.INVOICE_SIMULATOR;
export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  initialValues: {
    invoice_simulator_year: getCurrentYear(),
  },
})(InvoiceSimulatorForm) as React.ComponentType<any>;
