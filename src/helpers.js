// @flow
import {store} from '$src/root/startApp';
import {isContactFormDirty} from '$src/contacts/helpers';
import {isInfillDevelopmentFormDirty} from '$src/infillDevelopment/helpers';
import {isAnyLandUseContractFormDirty} from '$src/landUseContract/helpers';
import {isAnyLeaseFormDirty} from '$src/leases/helpers';
import {isRentBasisFormDirty} from '$src/rentbasis/helpers';

/**
 * Test has any page dirty forms
 * @enum {boolean}
 */
export const hasAnyPageDirtyForms = (): boolean => {
  const state = store.getState(),
    isContactDirty = isContactFormDirty(state),
    isInfillDevelopmentDirty = isInfillDevelopmentFormDirty(state),
    isLandUseContractDirty = isAnyLandUseContractFormDirty(state),
    isLeaseDirty = isAnyLeaseFormDirty(state),
    isRentBasisDirty = isRentBasisFormDirty(state);

  return isContactDirty ||
    isInfillDevelopmentDirty ||
    isLandUseContractDirty ||
    isLeaseDirty ||
    isRentBasisDirty;
};
