import React from "react";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import BasisOfRentsEdit from "@/leases/components/leaseSections/rent/basisOfRent/BasisOfRentsEdit";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import { Form } from "react-final-form";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";

const RentsEdit: React.FC = () => {
  return (
    <Form onSubmit={() => {}} mutators={{ ...arrayMutators }}>
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
            {(fieldArrayProps) =>
              BasisOfRentsEdit({
                ...fieldArrayProps,
                archived: false,
                basisOfRents: [],
              })
            }
          </FieldArray>
        </form>
      )}
    </Form>
  );
};

export default RentsEdit;
