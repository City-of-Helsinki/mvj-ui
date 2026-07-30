import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import { FieldArray } from "react-final-form-arrays";
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

type Props = {
  formApi: FormApi;
};

const BasisOfRentsEditMain: React.FC<Props> = ({ formApi }) => {
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  const [editedActiveBasisOfRents, setEditedActiveBasisOfRents] = useState<
    Array<BasisOfRent>
  >(() => formApi.getState().values?.basis_of_rents || []);
  const [editedArchivedBasisOfRents, setEditedArchivedBasisOfRents] = useState<
    Array<BasisOfRent>
  >(() => formApi.getState().values?.basis_of_rents_archived || []);

  useEffect(() => {
    const unsubscribe = formApi.subscribe(
      ({ values }) => {
        setEditedActiveBasisOfRents(values.basis_of_rents || []);
        setEditedArchivedBasisOfRents(values.basis_of_rents_archived || []);
      },
      { values: true },
    );
    return () => unsubscribe();
  }, [formApi]);

  const handleArchive = (index: number, item: BasisOfRent) => {
    formApi.change(
      "basis_of_rents",
      editedActiveBasisOfRents.filter((_, i) => i !== index),
    );
    formApi.change("basis_of_rents_archived", [
      ...editedArchivedBasisOfRents,
      { ...item, archived_at: new Date().toISOString() },
    ]);
  };

  const handleUnarchive = (index: number, item: BasisOfRent) => {
    formApi.change(
      "basis_of_rents_archived",
      editedArchivedBasisOfRents.filter((_, i) => i !== index),
    );
    formApi.change("basis_of_rents", [
      ...editedActiveBasisOfRents,
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
                {(fieldArrayProps) => (
                  <BasisOfRentsEdit
                    {...fieldArrayProps}
                    archived={false}
                    basisOfRents={editedActiveBasisOfRents}
                    formApi={formApi}
                    onArchive={handleArchive}
                  />
                )}
              </FieldArray>
              <FieldArray name="basis_of_rents_archived">
                {(fieldArrayProps) => (
                  <BasisOfRentsEdit
                    {...fieldArrayProps}
                    archived={true}
                    basisOfRents={editedArchivedBasisOfRents}
                    formApi={formApi}
                    onUnarchive={handleUnarchive}
                  />
                )}
              </FieldArray>
            </>
          </Authorization>
        </form>
      )}
    </Form>
  );
};

export default BasisOfRentsEditMain;
