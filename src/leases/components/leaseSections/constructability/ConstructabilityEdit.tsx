import React, { useState, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import ConstructabilityItemEdit from "./ConstructabilityItemEdit";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import SendEmail from "./SendEmail";
import Title from "@/components/content/Title";
import { FormNames } from "@/enums";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "@/leases/enums";
import { getContentConstructabilityAreas } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldOptions } from "@/util/helpers";
import {
  getAttributes,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { getUsersPermissions } from "@/usersPermissions/selectors";

type AreaProps = {
  attributes: Attributes;
  constructabilityStateOptions: Array<Record<string, any>>;
  currentLease: Lease;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  locationOptions: Array<Record<string, any>>;
  savedAreas: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
};

const renderAreas = ({
  attributes,
  constructabilityStateOptions,
  currentLease,
  errors,
  fields,
  isSaveClicked,
  locationOptions,
  savedAreas,
  typeOptions,
  usersPermissions,
}: AreaProps): ReactElement => {
  return (
    <>
      {!fields ||
        (!fields.length && (
          <FormText className="no-margin">Ei vuokra-alueita</FormText>
        ))}
      {savedAreas &&
        !!savedAreas.length &&
        fields &&
        !!fields.length &&
        fields.map((area, index) => {
          return (
            <ConstructabilityItemEdit
              key={index}
              field={area}
              attributes={attributes}
              constructabilityStateOptions={constructabilityStateOptions}
              currentLease={currentLease}
              errors={errors}
              isSaveClicked={isSaveClicked}
              locationOptions={locationOptions}
              savedArea={savedAreas[index]}
              typeOptions={typeOptions}
              usersPermissions={usersPermissions}
            />
          );
        })}
    </>
  );
};

type Props = {
  formApi: FormApi;
};

const ConstructabilityEdit: React.FC<Props> = ({ formApi }) => {
  const attributes: Attributes = useSelector(getAttributes);
  const currentLease: Lease = useSelector(getCurrentLease);
  const errors = useSelector((state) => getErrorsByFormName(state, formName));
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);

  const [constructabilityStateOptions, setConstructabilityStateOptions] =
    useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [savedAreas, setSavedAreas] = useState([]);

  useEffect(() => {
    setSavedAreas(getContentConstructabilityAreas(currentLease));
  }, [currentLease]);

  useEffect(() => {
    setConstructabilityStateOptions(
      getFieldOptions(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE),
    );
    setLocationOptions(
      getFieldOptions(attributes, LeaseAreasFieldPaths.LOCATION),
    );
    setTypeOptions(getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE));
  }, [attributes]);

  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY)}
          >
            {LeaseAreasFieldTitles.CONSTRUCTABILITY}
          </Title>
          <Divider />
          <SendEmail />

          <FieldArray name="lease_areas">
            {(fieldArrayProps) =>
              renderAreas({
                ...fieldArrayProps,
                attributes: attributes,
                constructabilityStateOptions: constructabilityStateOptions,
                currentLease: currentLease,
                errors: errors,
                isSaveClicked: isSaveClicked,
                locationOptions: locationOptions,
                savedAreas: savedAreas,
                typeOptions: typeOptions,
                usersPermissions: usersPermissions,
              })
            }
          </FieldArray>
        </form>
      )}
    </Form>
  );
};

const formName = FormNames.LEASE_CONSTRUCTABILITY;
export default ConstructabilityEdit;
