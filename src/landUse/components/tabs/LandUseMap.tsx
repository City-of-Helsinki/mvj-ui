import React from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";

export interface LandUseMapFormValues {
  // Placeholder for future form fields
}

interface LandUseMapProps {
  form: FormApi<LandUseMapFormValues>;
  isEditMode: boolean;
}

export const LandUseMap: React.FC<LandUseMapProps> = ({ form, isEditMode }) => {
  return (
    <Form<LandUseMapFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">KARTTA</h2>
            <p>Kartta-lomakkeen sisältö lisätään myöhemmin.</p>
          </div>
        </form>
      )}
    />
  );
};
