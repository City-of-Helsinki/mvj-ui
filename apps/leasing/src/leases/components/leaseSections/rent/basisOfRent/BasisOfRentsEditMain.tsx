import React from "react";
import { change, formValueSelector, FieldArray, reduxForm } from "redux-form";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRentsEdit from "./BasisOfRentsEdit";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
import type { BasisOfRent } from "@/leases/types";
import { useDispatch, useSelector } from "react-redux";
import { FormNames } from "@/enums";
import { validateRentBasisForm } from "@/rentbasis/formValidators";

const formName = FormNames.LEASE_BASIS_OF_RENTS;

type Props = {};

const BasisOfRentsEditMain: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const selector = formValueSelector(formName);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const editedActiveBasisOfRents: Array<BasisOfRent> = useSelector(
    (state) => selector(state, "basis_of_rents") || [],
  );
  const editedArchivedBasisOfRents: Array<BasisOfRent> = useSelector(
    (state) => selector(state, "basis_of_rents_archived") || [],
  );
  const handleArchive = (index: number, item: BasisOfRent) => {
    dispatch(
      change(
        formName,
        "basis_of_rents",
        editedActiveBasisOfRents.filter((_, i) => i !== index),
      ),
    );
    dispatch(
      change(formName, "basis_of_rents_archived", [
        ...editedArchivedBasisOfRents,
        { ...item, archived_at: new Date().toISOString() },
      ]),
    );
  };

  const handleUnarchive = (index: number, item: BasisOfRent) => {
    dispatch(
      change(
        formName,
        "basis_of_rents_archived",
        editedArchivedBasisOfRents.filter((_, i) => i !== index),
      ),
    );
    dispatch(
      change(formName, "basis_of_rents", [
        ...editedActiveBasisOfRents,
        { ...item, archived_at: null },
      ]),
    );
  };

  return (
    <form>
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
        )}
      >
        <>
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
            basisOfRents={editedActiveBasisOfRents}
            component={BasisOfRentsEdit}
            formName={formName}
            name="basis_of_rents"
            onArchive={handleArchive}
          />

          <FieldArray
            archived={true}
            basisOfRents={editedArchivedBasisOfRents}
            component={BasisOfRentsEdit}
            formName={formName}
            name="basis_of_rents_archived"
            onUnarchive={handleUnarchive}
          />
        </>
      </Authorization>
    </form>
  );
};

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  validate: validateRentBasisForm,
})(BasisOfRentsEditMain) as React.ComponentType;
