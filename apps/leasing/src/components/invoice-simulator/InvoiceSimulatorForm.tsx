import React from "react";
import { Row, Column } from "@/components/grid/Grid";
import { Form } from "react-final-form";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import { ButtonColors } from "@/components/enums";
import { getCurrentYear } from "@/util/date";

type Props = {
  onSubmit: (...args: Array<any>) => any;
  isFetching: boolean;
};

const InvoiceSimulatorForm: React.FC<Props> = ({ onSubmit, isFetching }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ invoice_simulator_year: getCurrentYear() }}
    >
      {({ handleSubmit, valid }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Column small={12} medium={3} large={2}>
              <FormField
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
            <Column small={12} medium={9} large={10}>
              <Button
                className={`${ButtonColors.SUCCESS} no-margin`}
                disabled={isFetching || !valid}
                type="submit"
                text="Näytä laskut"
              />
            </Column>
          </Row>
        </form>
      )}
    </Form>
  );
};

export default InvoiceSimulatorForm;
