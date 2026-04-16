import React, { useEffect, useState } from "react";
import { FieldArray } from "react-final-form-arrays";
import type { FormApi } from "final-form";
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
import { useSelector } from "react-redux";
import { Form } from "react-final-form";

type Props = {
  formApi: FormApi;
};

const BasisOfRentsEditMain: React.FC<Props> = ({ formApi }) => {
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const [editedActiveBasisOfRents, setEditedActiveBasisOfRents] = useState<
    Array<BasisOfRent>
  >(() => formApi.getState().values.basis_of_rents || []);
  const [editedArchivedBasisOfRents, setEditedArchivedBasisOfRents] = useState<
    Array<BasisOfRent>
  >(() => formApi.getState().values.basis_of_rents_archived || []);

  useEffect(() => {
    const unsubcribeActive = formApi.registerField(
      "basis_of_rents",
      (field) => setEditedActiveBasisOfRents(field.value || []),
      { value: true },
    );
    const unsubcribeArchived = formApi.registerField(
      "basis_of_rents_archived",
      (field) => setEditedArchivedBasisOfRents(field.value || []),
      { value: true },
    );
    return () => {
      unsubcribeActive();
      unsubcribeArchived();
    };
  }, [formApi]);

  const handleArchive = (index: number, item: BasisOfRent) => {
    const currentActive: Array<BasisOfRent> =
      formApi.getState().values.basis_of_rents || [];
    const currentArchived: Array<BasisOfRent> =
      formApi.getState().values.basis_of_rents_archived || [];
    formApi.change(
      "basis_of_rents",
      currentActive.filter((_, i) => i !== index),
    );
    formApi.change("basis_of_rents_archived", [
      ...currentArchived,
      { ...item, archived_at: new Date().toISOString() },
    ]);
  };

  const handleUnarchive = (index: number, item: BasisOfRent) => {
    const currentActive: Array<BasisOfRent> =
      formApi.getState().values.basis_of_rents || [];
    const currentArchived: Array<BasisOfRent> =
      formApi.getState().values.basis_of_rents_archived || [];
    formApi.change(
      "basis_of_rents_archived",
      currentArchived.filter((_, i) => i !== index),
    );
    formApi.change("basis_of_rents", [
      ...currentActive,
      { ...item, archived_at: null },
    ]);
  };

  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {() => (
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
              <FieldArray name="basis_of_rents">
                {(fieldArrayProps) =>
                  BasisOfRentsEdit({
                    ...fieldArrayProps,
                    archived: false,
                    basisOfRents: editedActiveBasisOfRents,
                    onArchive: handleArchive,
                  })
                }
              </FieldArray>

              <FieldArray name="basis_of_rents_archived">
                {(fieldArrayProps) =>
                  BasisOfRentsEdit({
                    ...fieldArrayProps,
                    archived: true,
                    basisOfRents: editedArchivedBasisOfRents,
                    onUnarchive: handleUnarchive,
                  })
                }
              </FieldArray>
            </>
          </Authorization>
        </form>
      )}
    </Form>
  );
};

export default BasisOfRentsEditMain;
