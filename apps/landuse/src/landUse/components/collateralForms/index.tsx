import React from "react";
import {
  LAND_USE_GUARANTEE_TYPES,
  type LandUseGuaranteeType,
} from "../../options";
import { PanttikirjaForm } from "./PanttikirjaForm";
import { RahavakuusForm } from "./RahavakuusForm";
import { OmavelkainenTakausForm } from "./OmavelkainenTakausForm";
import { TilivarojenPanttausForm } from "./TilivarojenPanttausForm";
import { MuuVakuusForm } from "./MuuVakuusForm";
import type { CollateralFormProps } from "./types";

export { PanttikirjaForm } from "./PanttikirjaForm";
export { RahavakuusForm } from "./RahavakuusForm";
export { OmavelkainenTakausForm } from "./OmavelkainenTakausForm";
export { TilivarojenPanttausForm } from "./TilivarojenPanttausForm";
export { MuuVakuusForm } from "./MuuVakuusForm";
export { SharedCollateralFields } from "./SharedCollateralFields";
export type { Guarantee, CollateralFormProps } from "./types";

interface CollateralFormByTypeProps extends CollateralFormProps {
  type: LandUseGuaranteeType | undefined;
}

export const CollateralFormByType: React.FC<CollateralFormByTypeProps> = ({
  type,
  namePrefix,
  isEditMode,
}) => {
  switch (type) {
    case LAND_USE_GUARANTEE_TYPES.PANTTIKIRJA:
      return (
        <PanttikirjaForm namePrefix={namePrefix} isEditMode={isEditMode} />
      );
    case LAND_USE_GUARANTEE_TYPES.RAHAVAKUUS:
      return <RahavakuusForm namePrefix={namePrefix} isEditMode={isEditMode} />;
    case LAND_USE_GUARANTEE_TYPES.OMAVELKAINEN_TAKAUS:
      return (
        <OmavelkainenTakausForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
        />
      );
    case LAND_USE_GUARANTEE_TYPES.TILIVAROJEN_PANTTAUS:
      return (
        <TilivarojenPanttausForm
          namePrefix={namePrefix}
          isEditMode={isEditMode}
        />
      );
    case LAND_USE_GUARANTEE_TYPES.MUU_VAKUUS:
      return <MuuVakuusForm namePrefix={namePrefix} isEditMode={isEditMode} />;
    default:
      return null;
  }
};
