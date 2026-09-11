import React from "react";
import {
  LAND_USE_GUARANTEE_TYPES,
  type LandUseGuaranteeType,
} from "@/landUse/options";
import { PanttikirjaForm } from "@/landUse/components/collateralForms/PanttikirjaForm";
import { RahavakuusForm } from "@/landUse/components/collateralForms/RahavakuusForm";
import { OmavelkainenTakausForm } from "@/landUse/components/collateralForms/OmavelkainenTakausForm";
import { TilivarojenPanttausForm } from "@/landUse/components/collateralForms/TilivarojenPanttausForm";
import { MuuVakuusForm } from "@/landUse/components/collateralForms/MuuVakuusForm";
import type { CollateralFormProps } from "@/landUse/components/collateralForms/types";

export { PanttikirjaForm } from "@/landUse/components/collateralForms/PanttikirjaForm";
export { RahavakuusForm } from "@/landUse/components/collateralForms/RahavakuusForm";
export { OmavelkainenTakausForm } from "@/landUse/components/collateralForms/OmavelkainenTakausForm";
export { TilivarojenPanttausForm } from "@/landUse/components/collateralForms/TilivarojenPanttausForm";
export { MuuVakuusForm } from "@/landUse/components/collateralForms/MuuVakuusForm";
export { SharedCollateralFields } from "@/landUse/components/collateralForms/SharedCollateralFields";
export type {
  Guarantee,
  CollateralFormProps,
} from "@/landUse/components/collateralForms/types";

interface CollateralFormByTypeProps extends CollateralFormProps {
  type: LandUseGuaranteeType | undefined;
}

export const CollateralFormByType: React.FC<CollateralFormByTypeProps> = ({
  type,
  namePrefix,
  isEditMode,
  partyOptions,
}) => {
  switch (type) {
    case LAND_USE_GUARANTEE_TYPES.PANTTIKIRJA:
      return (
        <PanttikirjaForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
          partyOptions={partyOptions}
        />
      );
    case LAND_USE_GUARANTEE_TYPES.RAHAVAKUUS:
      return (
        <RahavakuusForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
          partyOptions={partyOptions}
        />
      );
    case LAND_USE_GUARANTEE_TYPES.OMAVELKAINEN_TAKAUS:
      return (
        <OmavelkainenTakausForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
          partyOptions={partyOptions}
        />
      );
    case LAND_USE_GUARANTEE_TYPES.TILIVAROJEN_PANTTAUS:
      return (
        <TilivarojenPanttausForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
          partyOptions={partyOptions}
        />
      );
    case LAND_USE_GUARANTEE_TYPES.MUU_VAKUUS:
      return (
        <MuuVakuusForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
          partyOptions={partyOptions}
        />
      );
    default:
      return null;
  }
};
