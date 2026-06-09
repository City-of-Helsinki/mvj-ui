import React from "react";
import { FieldArray, formValueSelector, reduxForm } from "redux-form";
import BasisOfRentsEdit from "@/leases/components/leaseSections/rent/basisOfRent/BasisOfRentsEdit";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import { FormNames } from "@/enums";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { useSelector } from "react-redux";

const formName = FormNames.BASIS_OF_RENT_CALCULATOR;
const RentsEdit: React.FC = () => {
  const selector = formValueSelector(formName);
  const basisOfRents =
    useSelector((state) => selector(state, "basis_of_rents")) || [];
  return (
    <form>
      <Title
        enableUiDataEdit
        uiDataKey={getUiDataLeaseKey(
          LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
        )}
      >
        {LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}
      </Title>
      <Divider />
      <FieldArray
        archived={false}
        component={BasisOfRentsEdit}
        addButtonClass="no-bottom-margin"
        basisOfRents={basisOfRents}
        formName={formName}
        name="basis_of_rents"
        showLockedAt={false}
        showPlansInspectedAt={false}
      />
    </form>
  );
};

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
})(RentsEdit) as React.ComponentType<any>;
