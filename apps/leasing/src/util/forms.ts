import { isContactFormDirty } from "@/contacts/helpers";
import { isInfillDevelopmentFormDirty } from "@/infillDevelopment/helpers";
import { isAnyLeaseFormDirty } from "@/leases/helpers";
import { isRentBasisFormDirty } from "@/rentbasis/helpers";
import { store } from "@/index";

/**
 * Test has any page dirty forms
 * @enum {boolean}
 */
export const hasAnyPageDirtyForms = (): boolean => {
  const state = store.getState(),
    isContactDirty = isContactFormDirty(state),
    isInfillDevelopmentDirty = isInfillDevelopmentFormDirty(state),
    isLeaseDirty = isAnyLeaseFormDirty(state),
    isRentBasisDirty = isRentBasisFormDirty(state);
  return (
    isContactDirty ||
    isInfillDevelopmentDirty ||
    isLeaseDirty ||
    isRentBasisDirty
  );
};
