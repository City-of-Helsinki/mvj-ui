import React from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";

export interface LandUseMonitoringFormValues {
  // Placeholder for future form fields
}

interface LandUseMonitoringProps {
  form: FormApi<LandUseMonitoringFormValues>;
  isEditMode: boolean;
}

export const LandUseMonitoring: React.FC<LandUseMonitoringProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUseMonitoringFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">VALVONTA</h2>
            <p>Valvonta-lomakkeen sisältö lisätään myöhemmin.</p>
          </div>
        </form>
      )}
    />
  );
};
