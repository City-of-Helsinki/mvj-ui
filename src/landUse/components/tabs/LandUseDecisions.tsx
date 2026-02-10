import React from "react";
import { Form } from "react-final-form";
import { FormApi } from "final-form";

export interface LandUseDecisionsFormValues {
  // Placeholder for future form fields
}

interface LandUseDecisionsProps {
  form: FormApi<LandUseDecisionsFormValues>;
  isEditMode: boolean;
}

export const LandUseDecisions: React.FC<LandUseDecisionsProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUseDecisionsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">
              PÄÄTÖKSET JA SOPIMUKSET
            </h2>
            <p>
              Päätökset ja sopimukset -lomakkeen sisältö lisätään myöhemmin.
            </p>
          </div>
        </form>
      )}
    />
  );
};
