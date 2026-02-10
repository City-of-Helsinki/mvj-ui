import React from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";

export interface LandUsePartiesFormValues {
  // Placeholder for future form fields
}

interface LandUsePartiesProps {
  form: FormApi<LandUsePartiesFormValues>;
  isEditMode: boolean;
}

export const LandUseParties: React.FC<LandUsePartiesProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUsePartiesFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">OSAPUOLET</h2>
            <p>Osapuolet-lomakkeen sisältö lisätään myöhemmin.</p>
          </div>
        </form>
      )}
    />
  );
};
