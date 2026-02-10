import React from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";

export interface LandUseInvoicingFormValues {
  // Placeholder for future form fields
}

interface LandUseInvoicingProps {
  form: FormApi<LandUseInvoicingFormValues>;
  isEditMode: boolean;
}

export const LandUseInvoicing: React.FC<LandUseInvoicingProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUseInvoicingFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">LASKUTUS</h2>
            <p>Laskutus-lomakkeen sisältö lisätään myöhemmin.</p>
          </div>
        </form>
      )}
    />
  );
};
