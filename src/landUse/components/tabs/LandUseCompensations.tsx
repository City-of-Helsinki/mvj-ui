import React from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";

export interface LandUseCompensationsFormValues {
  // Placeholder for future form fields
}

interface LandUseCompensationsProps {
  form: FormApi<LandUseCompensationsFormValues>;
  isEditMode: boolean;
}

export const LandUseCompensations: React.FC<LandUseCompensationsProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUseCompensationsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">KORVAUKSET</h2>
            <p>Korvaukset-lomakkeen sisältö lisätään myöhemmin.</p>
          </div>
        </form>
      )}
    />
  );
};

export default LandUseCompensations;
