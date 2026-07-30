import React from "react";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import { FieldArray } from "react-final-form-arrays";
import BasisOfRentsEdit from "@/leases/components/leaseSections/rent/basisOfRent/BasisOfRentsEdit";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";

type Props = {
  formApi: FormApi;
};

const BasisOfRentCalculatorForm: React.FC<Props> = ({ formApi }) => {
  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
            )}
          >
            {LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}
          </Title>
          <Divider />
          <FieldArray name="basis_of_rents">
            {(fieldArrayProps) => (
              <BasisOfRentsEdit
                {...fieldArrayProps}
                archived={false}
                addButtonClass="no-bottom-margin"
                basisOfRents={[]}
                showLockedAt={false}
                showPlansInspectedAt={false}
                formApi={formApi}
              />
            )}
          </FieldArray>
        </form>
      )}
    </Form>
  );
};

export default BasisOfRentCalculatorForm;
