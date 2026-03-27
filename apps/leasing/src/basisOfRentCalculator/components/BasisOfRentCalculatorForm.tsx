import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import BasisOfRentsEdit from "@/leases/components/leaseSections/rent/BasisOfRentsEdit";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import { FormNames } from "@/enums";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
type Props = {
  basisOfRents: Array<Record<string, any>>;
};

class RentsEdit extends PureComponent<Props> {
  render() {
    const { basisOfRents } = this.props;
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
          isSaveClicked={false}
          name="basis_of_rents"
          showLockedAt={false}
          showPlansInspectedAt={false}
          forwardRef
        />
      </form>
    );
  }
}

const formName = FormNames.BASIS_OF_RENT_CALCULATOR;
const selector = formValueSelector(formName);
export default flowRight(
  connect((state) => {
    return {
      basisOfRents: selector(state, "basis_of_rents") || [],
    };
  }),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RentsEdit) as React.ComponentType<any>;
