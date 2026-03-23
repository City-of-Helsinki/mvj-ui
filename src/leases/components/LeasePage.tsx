import React, { useEffect, useMemo, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  change as reduxFormChange,
  destroy,
  getFormValues,
  initialize,
  isDirty,
} from "redux-form";
import { createForm } from "final-form";
import type { FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import CommentPanel from "./leaseSections/comments/CommentPanel";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import Constructability from "./leaseSections/constructability/Constructability";
import ConstructabilityEdit from "./leaseSections/constructability/ConstructabilityEdit";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import DecisionsMain from "./leaseSections/contract/DecisionsMain";
import DecisionsMainEdit from "./leaseSections/contract/DecisionsMainEdit";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import Invoices from "./leaseSections/invoice/Invoices";
import LeaseAreas from "./leaseSections/leaseArea/LeaseAreas";
import LeaseAreasEdit from "./leaseSections/leaseArea/LeaseAreasEdit";
import LeaseAuditLog from "./leaseSections/auditLog/LeaseAuditLog";
import LeaseInfo from "./leaseSections/leaseInfo/LeaseInfo";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import Rents from "./leaseSections/rent/Rents";
import RentsEdit from "./leaseSections/rent/RentsEdit";
import SingleLeaseMap from "./leaseSections/map/SingleLeaseMap";
import Summary from "./leaseSections/summary/Summary";
import SummaryEdit from "./leaseSections/summary/SummaryEdit";
import Tabs from "@/components/tabs/Tabs";
import TabPane from "@/components/tabs/TabPane";
import TabContent from "@/components/tabs/TabContent";
import TenantsEdit from "./leaseSections/tenant/TenantsEdit";
import Tenants from "./leaseSections/tenant/Tenants";
import { fetchCommentsByLease } from "@/comments/actions";
import { fetchInvoicesByLease } from "@/invoices/actions";
import {
  clearFormDirtyFlags,
  clearFormValidFlags,
  deleteLease,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  receiveFormDirtyFlags,
  receiveSingleLease,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  showEditMode,
} from "@/leases/actions";
import { fetchLeaseTypes } from "@/leaseType/actions";
import { clearPreviewInvoices } from "@/previewInvoices/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { fetchVats } from "@/vat/actions";
import {
  ConfirmationModalTexts,
  FormNames,
  Methods,
  PermissionMissingTexts,
} from "@/enums";
import {
  LeaseAreasFieldPaths,
  LeaseBasisOfRentsFieldPaths,
  LeaseContractsFieldPaths,
  LeaseDecisionsFieldPaths,
  LeaseInspectionsFieldPaths,
  LeaseRentsFieldPaths,
  LeaseTenantsFieldPaths,
} from "@/leases/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  clearUnsavedChanges,
  getContentLeaseIdentifier,
} from "@/leases/helpers";
import {
  addAreasFormValuesToPayload,
  addConstructabilityFormValuesToPayload,
  addContractsFormValuesToPayload,
  addDecisionsFormValuesToPayload,
  addInspectionsFormValuesToPayload,
  addRentsFormValuesToPayload,
  addSummaryFormValuesToPayload,
  addTenantsFormValuesToPayload,
  getContentBasisOfRents,
  getContentContracts,
  getContentConstructabilityAreas,
  getContentDecisions,
  getContentInspections,
  getContentLeaseAreas,
  getContentRents,
  getContentLeaseSummary,
  getContentTenants,
  isUserAllowedToDeleteEmptyLease,
} from "@/leases/helpers";
import {
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  isArchived,
  isFieldAllowedToRead,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import { getLoggedInUser } from "@/auth/selectors";
import { getCommentsByLease } from "@/comments/selectors";
import { getInvoicesByLease } from "@/invoices/selectors";
import {
  getCurrentLease,
  getIsEditMode,
  getIsFetching,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsSaveClicked,
  getIsSaving,
} from "@/leases/selectors";
import { getLeaseTypeList } from "@/leaseType/selectors";
import { getVats } from "@/vat/selectors";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "@/util/storage";
import { withLeasePageAttributes } from "@/components/attributes/LeasePageAttributes";
import { withUiDataList } from "@/components/uiData/UiDataListHOC";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { CommentList } from "@/comments/types";
import type { InvoiceList } from "@/invoices/types";
import type { Lease } from "@/leases/types";
import type { LeaseTypeList } from "@/leaseType/types";
import type {
  UsersPermissions as UsersPermissionsType,
  UserServiceUnit,
} from "@/usersPermissions/types";
import type { VatList } from "@/vat/types";
import {
  getOldDwellingsInHousingCompaniesPriceIndex,
  getIsFetching as getIsFetchingOldDwellingsInHousingCompaniesPriceIndex,
} from "@/oldDwellingsInHousingCompaniesPriceIndex/selectors";
import { getIsFetchingReceivableTypes } from "@/leaseCreateCharge/selectors";
import { fetchReceivableTypes } from "@/leaseCreateCharge/actions";
import { fetchOldDwellingsInHousingCompaniesPriceIndex } from "@/oldDwellingsInHousingCompaniesPriceIndex/actions";
import { OldDwellingsInHousingCompaniesPriceIndex } from "@/oldDwellingsInHousingCompaniesPriceIndex/types";
import {
  validateContractForm,
  validateSummaryForm,
  validateTenantForm,
} from "../formValidators";

type Props = {
  areasFormValues: Record<string, any>;
  reduxFormChange: typeof reduxFormChange;
  clearPreviewInvoices: (...args: Array<any>) => any;
  commentMethods: MethodsType;
  // get via withLeasePageAttributes HOC
  contractsFormValues: Record<string, any>;
  constructabilityFormValues: Record<string, any>;
  currentLease: Lease;
  decisionsFormValues: Record<string, any>;
  deleteLease: (...args: Array<any>) => any;
  destroy: (...args: Array<any>) => any;
  fetchCommentsByLease: (...args: Array<any>) => any;
  fetchInvoicesByLease: (...args: Array<any>) => any;
  fetchLeaseTypes: (...args: Array<any>) => any;
  fetchSingleLease: (...args: Array<any>) => any;
  fetchOldDwellingsInHousingCompaniesPriceIndex: (...args: Array<any>) => any;
  fetchReceivableTypes: (...args: Array<any>) => any;
  fetchVats: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  inspectionsFormValues: Record<string, any>;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingLeasePageAttributes: boolean;
  isFetchingReceivableTypes: boolean;
  isFetchingOldDwellingsInHousingCompaniesPriceIndex: boolean;
  // get via withLeasePageAttributes HOC
  isFormValidFlags: Record<string, any>;
  isRentsFormDirty: boolean;
  isRentsFormValid: boolean;
  isSaving: boolean;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  leaseMethods: MethodsType;
  leaseTypeList: LeaseTypeList;
  loggedUser: Record<string, any>;
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndex | null;
  patchLease: (...args: Array<any>) => any;
  receiveSingleLease: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  rentsFormValues: Record<string, any>;
  showEditMode: (...args: Array<any>) => any;
  tenantsFormValues: Record<string, any>;
  userActiveServiceUnit: UserServiceUnit;
  usersPermissions: UsersPermissionsType;
  vats: VatList;
};

const LeasePage: React.FC<Props> = (props) => {
  const {
    areasFormValues,
    reduxFormChange,
    clearPreviewInvoices,
    commentMethods,
    contractsFormValues,
    constructabilityFormValues,
    currentLease,
    decisionsFormValues,
    deleteLease,
    destroy,
    fetchCommentsByLease,
    fetchInvoicesByLease,
    fetchLeaseTypes,
    fetchSingleLease,
    fetchOldDwellingsInHousingCompaniesPriceIndex,
    fetchReceivableTypes,
    fetchVats,
    hideEditMode,
    initialize,
    inspectionsFormValues,
    isEditMode,
    isFetching,
    isFetchingLeasePageAttributes,
    isFetchingReceivableTypes,
    isFetchingOldDwellingsInHousingCompaniesPriceIndex,
    isFormValidFlags,
    isRentsFormDirty,
    isRentsFormValid,
    isSaving,
    isSaveClicked,
    leaseAttributes,
    leaseMethods,
    leaseTypeList,
    loggedUser,
    oldDwellingsInHousingCompaniesPriceIndex,
    patchLease,
    receiveSingleLease,
    receiveIsSaveClicked,
    receiveTopNavigationSettings,
    rentsFormValues,
    showEditMode,
    userActiveServiceUnit,
    usersPermissions,
    vats,
  } = props;

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { search, pathname } = location;
  const { leaseId } = params;
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);
  const [summaryFormState, setSummaryFormState] = useState({
    dirty: false,
    valid: true,
  });
  const [tenantsFormState, setTenantsFormState] = useState({
    dirty: false,
    valid: true,
  });
  const [constructabilityFormState, setConstructabilityFormState] = useState({
    dirty: false,
    valid: true,
  });
  const [contractsFormState, setContractsFormState] = useState({
    dirty: false,
    valid: true,
  });
  const [decisionsFormState, setDecisionsFormState] = useState({
    dirty: false,
    valid: true,
  });
  const [inspectionsFormState, setInspectionsFormState] = useState({
    dirty: false,
    valid: true,
  });
  const [leaseAreasFormState, setLeaseAreasFormState] = useState({
    dirty: false,
    valid: true,
  });

  useEffect(() => {
    dispatch(
      receiveFormDirtyFlags({
        [FormNames.LEASE_CONSTRUCTABILITY]: constructabilityFormState.dirty,
        [FormNames.LEASE_CONTRACTS]: contractsFormState.dirty,
        [FormNames.LEASE_DECISIONS]: decisionsFormState.dirty,
        [FormNames.LEASE_INSPECTIONS]: inspectionsFormState.dirty,
        [FormNames.LEASE_AREAS]: leaseAreasFormState.dirty,
        [FormNames.LEASE_RENTS]: isRentsFormDirty,
        [FormNames.LEASE_SUMMARY]: summaryFormState.dirty,
        [FormNames.LEASE_TENANTS]: tenantsFormState.dirty,
      }),
    );
  }, [
    constructabilityFormState.dirty,
    contractsFormState.dirty,
    decisionsFormState.dirty,
    inspectionsFormState.dirty,
    isRentsFormDirty,
    leaseAreasFormState.dirty,
    summaryFormState.dirty,
    tenantsFormState.dirty,
    dispatch,
  ]);

  const comments: CommentList = useSelector((state) =>
    getCommentsByLease(state, Number(leaseId)),
  );
  const invoices: InvoiceList = useSelector((state) =>
    getInvoicesByLease(state, Number(leaseId)),
  );

  // Preventing stale values for `setInterval` and `saveUnsavedChanges`
  const currentValuesRef = useRef({
    contractsFormValues,
    decisionsFormValues,
    inspectionsFormValues,
    areasFormValues,
    isRentsFormDirty,
    rentsFormValues,
    leaseId,
    isFormValidFlags,
  });
  currentValuesRef.current = {
    contractsFormValues,
    decisionsFormValues,
    inspectionsFormValues,
    areasFormValues,
    isRentsFormDirty,
    rentsFormValues,
    leaseId,
    isFormValidFlags,
  };

  const timerAutoSave = useRef<NodeJS.Timeout>();

  const requestedForLeaseRef = useRef<{
    [leaseId: string]: {
      comments?: boolean;
      invoices?: boolean;
      leaseTypes?: boolean;
      vats?: boolean;
    };
  }>({});
  const prevUsersPermissionsRef = useRef<UsersPermissionsType | null>(null);

  const activeTab = useMemo(() => {
    const query = getUrlParams(search);
    return query.tab ? Number(query.tab) : 0;
  }, [search]);
  const allowToDeleteEmptyLease = useMemo(
    () => isUserAllowedToDeleteEmptyLease(currentLease, comments, loggedUser),
    [currentLease, comments, loggedUser],
  );

  useEffect(() => {
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASES),
      pageTitle: "Vuokraukset",
      showSearch: true,
    });

    if (
      !isFetchingOldDwellingsInHousingCompaniesPriceIndex &&
      !oldDwellingsInHousingCompaniesPriceIndex
    ) {
      fetchOldDwellingsInHousingCompaniesPriceIndex();
    }

    hideEditMode();
    window.addEventListener("beforeunload", handleLeavePage);

    //isEqual is used as a comparator to ensure that dirty state is properly evaluated for field arrays.
    const unsubscribeSummaryForm = summaryFormRef.current.subscribe(
      (formState) => {
        const isDirtyIncludingFieldArrays = !isEqual(
          formState.values,
          formState.initialValues,
        );
        setSummaryFormState({
          dirty: isDirtyIncludingFieldArrays,
          valid: formState.valid,
        });
      },
      { valid: true, values: true, initialValues: true },
    );
    const unsubscribeLeaseTenantForm = leaseTenantFormRef.current.subscribe(
      (formState) => {
        const isDirtyIncludingFieldArrays = !isEqual(
          formState.values,
          formState.initialValues,
        );
        setTenantsFormState({
          dirty: isDirtyIncludingFieldArrays,
          valid: formState.valid,
        });
      },
      { valid: true, values: true, initialValues: true },
    );
    const unsubscribeLeaseConstructabilityForm =
      leaseConstructabilityFormRef.current.subscribe(
        (formState) => {
          const isDirtyIncludingFieldArrays = !isEqual(
            formState.values,
            formState.initialValues,
          );
          setConstructabilityFormState({
            dirty: isDirtyIncludingFieldArrays,
            valid: formState.valid,
          });
        },
        { valid: true, values: true, initialValues: true },
      );
    const unsubscribeLeaseContractsForm =
      leaseContractsFormRef.current.subscribe(
        (formState) => {
          const isDirtyIncludingFieldArrays = !isEqual(
            formState.values,
            formState.initialValues,
          );
          setContractsFormState({
            dirty: isDirtyIncludingFieldArrays,
            valid: formState.valid,
          });
        },
        { valid: true, values: true, initialValues: true },
      );
    const unsubscribeLeaseDecisionsForm =
      leaseDecisionsFormRef.current.subscribe(
        (formState) => {
          const isDirtyIncludingFieldArrays = !isEqual(
            formState.values,
            formState.initialValues,
          );
          setDecisionsFormState({
            dirty: isDirtyIncludingFieldArrays,
            valid: formState.valid,
          });
        },
        { valid: true, values: true, initialValues: true },
      );
    const unsubscribeLeaseInspectionsForm =
      leaseInspectionsFormRef.current.subscribe(
        (formState) => {
          const isDirtyIncludingFieldArrays = !isEqual(
            formState.values,
            formState.initialValues,
          );
          setInspectionsFormState({
            dirty: isDirtyIncludingFieldArrays,
            valid: formState.valid,
          });
        },
        { valid: true, values: true, initialValues: true },
      );
    const unsubscribeLeaseAreasForm = leaseAreasFormRef.current.subscribe(
      (formState) => {
        const isDirtyIncludingFieldArrays = !isEqual(
          formState.values,
          formState.initialValues,
        );
        setLeaseAreasFormState({
          dirty: isDirtyIncludingFieldArrays,
          valid: formState.valid,
        });
      },
      { valid: true, values: true, initialValues: true },
    );

    return () => {
      if (pathname !== `${getRouteById(Routes.LEASES)}/${leaseId}`) {
        clearUnsavedChanges();
      }

      stopAutoSaveTimer();
      clearPreviewInvoices();
      // Clear current lease
      receiveSingleLease({});
      destroy(FormNames.RENT_CALCULATOR);
      hideEditMode();
      window.removeEventListener("beforeunload", handleLeavePage);

      unsubscribeSummaryForm();
      unsubscribeLeaseTenantForm();
      unsubscribeLeaseConstructabilityForm();
      unsubscribeLeaseContractsForm();
      unsubscribeLeaseDecisionsForm();
      unsubscribeLeaseInspectionsForm();
      unsubscribeLeaseAreasForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToTopPage();
  }, [activeTab]);

  useEffect(() => {
    const key = String(leaseId);
    // Reset per-lease tracking so returning to a previously visited lease will re-run
    if (requestedForLeaseRef.current[key]) {
      delete requestedForLeaseRef.current[key];
    }
    prevUsersPermissionsRef.current = null;

    requestedForLeaseRef.current[key] = requestedForLeaseRef.current[key] || {};
    fetchSingleLease(leaseId);
  }, [fetchSingleLease, leaseId]);

  useEffect(() => {
    // Fetch related lease data
    const key = String(leaseId);
    requestedForLeaseRef.current[key] = requestedForLeaseRef.current[key] || {};
    let requested = requestedForLeaseRef.current[key];

    // If usersPermissions changed, allow re-checking resources (some permissions may have been added)
    if (
      prevUsersPermissionsRef.current &&
      prevUsersPermissionsRef.current !== usersPermissions
    ) {
      requestedForLeaseRef.current[key] = {}; // reset for this leaseId
      requested = requestedForLeaseRef.current[key];
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_COMMENT) &&
      (comments === undefined || comments === null) &&
      !requested.comments
    ) {
      requested.comments = true;

      fetchCommentsByLease(leaseId);
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) &&
      (invoices === undefined || invoices === null) &&
      !requested.invoices
    ) {
      fetchInvoicesByLease(leaseId);
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASETYPE) &&
      isEmpty(leaseTypeList) &&
      !requested.leaseTypes
    ) {
      requested.leaseTypes = true;
      fetchLeaseTypes();
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_VAT) &&
      isEmpty(vats) &&
      !requested.vats
    ) {
      requested.vats = true;
      fetchVats();
    }

    prevUsersPermissionsRef.current = usersPermissions;
  }, [
    fetchCommentsByLease,
    fetchInvoicesByLease,
    fetchLeaseTypes,
    fetchVats,
    leaseId,
    usersPermissions,
    comments,
    invoices,
    leaseTypeList,
    vats,
  ]);

  useEffect(() => {
    if (!isEmpty(currentLease)) {
      const pageTitle = getLeasePageTitle(currentLease);
      setPageTitle(pageTitle);

      if (currentLease?.service_unit) {
        fetchReceivableTypes();
      }
    }
  }, [currentLease, fetchReceivableTypes]);

  useEffect(() => {
    if (!isEmpty(currentLease)) {
      const storedLeaseId = getSessionStorageItem("leaseId");
      if (Number(leaseId) === storedLeaseId) {
        setIsRestoreModalOpen(true);
      }
    }
  }, [currentLease, leaseId]);

  const getLeasePageTitle = (lease: Lease) => {
    const identifier = getContentLeaseIdentifier(lease);
    const pageTitle = `${identifier ? `${identifier} | ` : ""}Vuokraus`;
    return pageTitle;
  };

  const startAutoSaveTimer = () => {
    if (timerAutoSave.current) {
      clearInterval(timerAutoSave.current);
    }
    timerAutoSave.current = setInterval(() => saveUnsavedChanges(), 5000);
  };

  const stopAutoSaveTimer = () => {
    if (timerAutoSave.current) {
      clearInterval(timerAutoSave.current);
      timerAutoSave.current = undefined;
    }
  };

  const handleLeavePage = (e) => {
    if (isAnyFormDirty() && isEditMode) {
      const confirmationMessage = "";
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+

      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
  };

  const openEditMode = () => {
    setSummaryFormState({ dirty: false, valid: true });
    setTenantsFormState({ dirty: false, valid: true });
    setConstructabilityFormState({ dirty: false, valid: true });
    setContractsFormState({ dirty: false, valid: true });
    setDecisionsFormState({ dirty: false, valid: true });
    setInspectionsFormState({ dirty: false, valid: true });
    setLeaseAreasFormState({ dirty: false, valid: true });

    receiveIsSaveClicked(false);
    dispatch(clearFormValidFlags());
    dispatch(clearFormDirtyFlags());
    destroyAllForms();
    initializeForms(currentLease);
    showEditMode();
    startAutoSaveTimer();
  };

  const destroyAllForms = () => {
    summaryFormRef.current.restart();
    leaseTenantFormRef.current.restart();
    leaseConstructabilityFormRef.current.restart();
    leaseContractsFormRef.current.restart();
    leaseDecisionsFormRef.current.restart();
    leaseInspectionsFormRef.current.restart();
    leaseAreasFormRef.current.restart();
    destroy(FormNames.LEASE_RENTS);
  };

  const summaryFormRef = useRef(
    createForm({
      onSubmit: () => {},
      validate: validateSummaryForm,
    }),
  );
  const leaseTenantFormRef = useRef(
    createForm({
      onSubmit: () => {},
      validate: validateTenantForm,
      mutators: { ...arrayMutators },
    }),
  );
  const leaseConstructabilityFormRef = useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
    }),
  );
  const leaseContractsFormRef = useRef(
    createForm({
      onSubmit: () => {},
      validate: validateContractForm,
      mutators: { ...arrayMutators },
    }),
  );
  const leaseDecisionsFormRef = useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
    }),
  );
  const leaseInspectionsFormRef = useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
    }),
  );
  const leaseAreasFormRef = useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
    }),
  );

  const initializeForms = (lease: Lease) => {
    const areas = getContentLeaseAreas(lease),
      rents = getContentRents(lease),
      tenants = getContentTenants(lease);
    leaseConstructabilityFormRef.current.initialize({
      lease_areas: getContentConstructabilityAreas(lease),
    });
    leaseContractsFormRef.current.initialize({
      contracts: getContentContracts(lease),
    });
    leaseDecisionsFormRef.current.initialize({
      decisions: getContentDecisions(lease),
    });
    leaseInspectionsFormRef.current.initialize({
      inspections: getContentInspections(lease),
    });
    leaseAreasFormRef.current.initialize({
      lease_areas_active: areas.filter((area) => !area.archived_at),
      lease_areas_archived: areas.filter((area) => area.archived_at),
    });
    initialize(FormNames.LEASE_RENTS, {
      basis_of_rents: getContentBasisOfRents(lease).filter(
        (item) => !item.archived_at,
      ),
      basis_of_rents_archived: getContentBasisOfRents(lease).filter(
        (item) => item.archived_at,
      ),
      rent_info_completed_at: lease.rent_info_completed_at,
      rents: rents.filter((rent) => !isArchived(rent)),
      rentsArchived: rents.filter((rent) => isArchived(rent)),
    });
    summaryFormRef.current.initialize(getContentLeaseSummary(lease));
    leaseTenantFormRef.current.initialize({
      tenants: tenants.filter((tenant) => !isArchived(tenant.tenant)),
      tenantsArchived: tenants.filter((tenant) => isArchived(tenant.tenant)),
    });
  };

  const cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    setIsRestoreModalOpen(false);
  };

  const restoreUnsavedChanges = () => {
    destroyAllForms();
    dispatch(clearFormValidFlags());
    showEditMode();
    initializeForms(currentLease);
    const storedAreasFormValues = getSessionStorageItem(FormNames.LEASE_AREAS);

    if (storedAreasFormValues) {
      bulkChange(leaseAreasFormRef.current, storedAreasFormValues);
    }

    const storedConstructabilityFormValues = getSessionStorageItem(
      FormNames.LEASE_CONSTRUCTABILITY,
    );

    if (storedConstructabilityFormValues) {
      bulkChange(
        leaseConstructabilityFormRef.current,
        storedConstructabilityFormValues,
      );
    }

    const storedContractsFormValues = getSessionStorageItem(
      FormNames.LEASE_CONTRACTS,
    );

    if (storedContractsFormValues) {
      bulkChange(leaseContractsFormRef.current, storedContractsFormValues);
    }

    const storedDecisionsFormValues = getSessionStorageItem(
      FormNames.LEASE_DECISIONS,
    );

    if (storedDecisionsFormValues) {
      bulkChange(leaseDecisionsFormRef.current, storedDecisionsFormValues);
    }

    const storedInspectionsFormValues = getSessionStorageItem(
      FormNames.LEASE_INSPECTIONS,
    );

    if (storedInspectionsFormValues) {
      bulkChange(leaseInspectionsFormRef.current, storedInspectionsFormValues);
    }

    const storedRentsFormValues = getSessionStorageItem(FormNames.LEASE_RENTS);

    if (storedRentsFormValues) {
      bulkChangeReduxForm(FormNames.LEASE_RENTS, storedRentsFormValues);
    }

    const storedSummaryFormValues = getSessionStorageItem(
      FormNames.LEASE_SUMMARY,
    );

    if (storedSummaryFormValues) {
      bulkChange(summaryFormRef.current, storedSummaryFormValues);
    }

    const storedTenantsFormValues = getSessionStorageItem(
      FormNames.LEASE_TENANTS,
    );

    if (storedTenantsFormValues) {
      bulkChange(leaseTenantFormRef.current, storedTenantsFormValues);
    }

    const storedFormValidity = getSessionStorageItem("leaseValidity");

    if (storedFormValidity) {
      dispatch(receiveFormValidFlags(storedFormValidity));
    }

    startAutoSaveTimer();
    setIsRestoreModalOpen(false);
  };

  const bulkChangeReduxForm = (formName: string, obj: Record<string, any>) => {
    const fields = Object.keys(obj);
    fields.forEach((field) => {
      reduxFormChange(formName, field, obj[field]);
    });
  };

  const bulkChange = (form: FormApi, obj: Record<string, any>) => {
    const currentValues = form.getState().values;
    const fields = Object.keys(obj);
    form.batch(() => {
      fields.forEach((field) => {
        const currentValue = currentValues[field];
        const newValue = obj[field];
        if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
          form.change(field, newValue);
        }
      });
    });
  };

  const saveUnsavedChanges = () => {
    // Get values from ref to avoid stale values due to setInterval
    const {
      areasFormValues,
      isRentsFormDirty,
      rentsFormValues,
      leaseId,
      isFormValidFlags,
    } = currentValuesRef.current;

    let isDirty = false;

    if (constructabilityFormState.dirty) {
      setSessionStorageItem(
        FormNames.LEASE_CONSTRUCTABILITY,
        leaseConstructabilityFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_CONSTRUCTABILITY);
    }

    if (contractsFormState.dirty) {
      setSessionStorageItem(
        FormNames.LEASE_CONTRACTS,
        leaseContractsFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_CONTRACTS);
    }

    if (decisionsFormState.dirty) {
      setSessionStorageItem(
        FormNames.LEASE_DECISIONS,
        leaseDecisionsFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_DECISIONS);
    }

    if (inspectionsFormState.dirty) {
      setSessionStorageItem(
        FormNames.LEASE_INSPECTIONS,
        leaseInspectionsFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_INSPECTIONS);
    }

    if (leaseAreasFormRef.current.getState().dirty) {
      setSessionStorageItem(FormNames.LEASE_AREAS, areasFormValues)
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_AREAS);
    }

    if (isRentsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_RENTS, rentsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_RENTS);
    }

    if (summaryFormState.dirty) {
      setSessionStorageItem(
        FormNames.LEASE_SUMMARY,
        summaryFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_SUMMARY);
    }

    if (tenantsFormState.dirty) {
      setSessionStorageItem(
        FormNames.LEASE_TENANTS,
        leaseTenantFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_TENANTS);
    }

    if (isDirty) {
      setSessionStorageItem("leaseId", leaseId);
      setSessionStorageItem("leaseValidity", isFormValidFlags);
    } else {
      removeSessionStorageItem("leaseId");
      removeSessionStorageItem("leaseValidity");
    }
  };
  const cancelChanges = () => {
    hideEditMode();
    stopAutoSaveTimer();
    dispatch(clearFormDirtyFlags());
    clearUnsavedChanges();
  };

  const saveChanges = () => {
    const areFormsValid = validateForms();
    receiveIsSaveClicked(true);

    if (areFormsValid) {
      let payload: Record<string, any> = {
        id: currentLease.id,
      };

      if (contractsFormState.dirty) {
        payload = addContractsFormValuesToPayload(
          payload,
          leaseContractsFormRef.current.getState().values,
        );
      }

      if (decisionsFormState.dirty) {
        payload = addDecisionsFormValuesToPayload(
          payload,
          leaseDecisionsFormRef.current.getState().values,
        );
      }

      if (inspectionsFormState.dirty) {
        payload = addInspectionsFormValuesToPayload(
          payload,
          leaseInspectionsFormRef.current.getState().values,
        );
      }

      if (leaseAreasFormState.dirty) {
        payload = addAreasFormValuesToPayload(
          payload,
          leaseAreasFormRef.current.getState().values,
        );
      }

      // Constructability needs to be added to payload after lease areas as
      // it is a part of lease areas and would be overridden.
      if (constructabilityFormState.dirty) {
        payload = addConstructabilityFormValuesToPayload(
          payload,
          leaseConstructabilityFormRef.current.getState().values,
        );
      }

      if (isRentsFormDirty) {
        payload = addRentsFormValuesToPayload(
          payload,
          rentsFormValues,
          currentLease,
        );
      }

      if (summaryFormState.dirty) {
        payload = addSummaryFormValuesToPayload(
          payload,
          summaryFormRef.current.getState().values,
        );
      }

      if (tenantsFormState.dirty) {
        payload = addTenantsFormValuesToPayload(
          payload,
          leaseTenantFormRef.current.getState().values,
        );
      }

      patchLease(payload);
      cancelChanges();
    }
  };
  const validateForms = () => {
    return (
      constructabilityFormState.valid &&
      contractsFormState.valid &&
      decisionsFormState.valid &&
      inspectionsFormState.valid &&
      leaseAreasFormState.valid &&
      isRentsFormValid &&
      summaryFormState.valid &&
      tenantsFormState.valid
    );
  };
  const handleBack = () => {
    const query = getUrlParams(search);
    // Remove page specific url parameters when moving to lease list page
    delete query.tab;
    delete query.lease_area;
    delete query.plan_unit;
    delete query.plot;
    delete query.opened_invoice;
    return navigate({
      pathname: `${getRouteById(Routes.LEASES)}`,
      search: getSearchQuery(query),
    });
  };

  const handleTabClick = (tabId: string) => {
    const query = getUrlParams(search);
    query.tab = tabId;
    return navigate({ ...location, search: getSearchQuery(query) });
  };

  const toggleCommentPanel = () => {
    setIsCommentPanelOpen(!isCommentPanelOpen);
  };

  const isAnyFormDirty = () => {
    return (
      constructabilityFormState.dirty ||
      contractsFormState.dirty ||
      decisionsFormState.dirty ||
      inspectionsFormState.dirty ||
      leaseAreasFormState.dirty ||
      isRentsFormDirty ||
      summaryFormState.dirty ||
      tenantsFormState.dirty
    );
  };
  const handleDelete = () => {
    deleteLease(leaseId);
  };

  const areFormsValid = validateForms();

  const isServiceUnitSameAsActiveServiceUnit = () => {
    return userActiveServiceUnit?.id === currentLease?.service_unit?.id;
  };

  if (isFetching || isFetchingLeasePageAttributes || isFetchingReceivableTypes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!leaseMethods) return null;
  if (!isMethodAllowed(leaseMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.LEASE} />
      </PageContainer>
    );
  if (isEmpty(currentLease)) return null;
  return (
    <FullWidthContainer>
      <PageNavigationWrapper>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowComments={isMethodAllowed(commentMethods, Methods.GET)}
              allowDelete={
                isMethodAllowed(leaseMethods, Methods.DELETE) &&
                (allowToDeleteEmptyLease ||
                  hasPermissions(
                    usersPermissions,
                    UsersPermissions.DELETE_NONEMPTY_LEASE,
                  )) &&
                isServiceUnitSameAsActiveServiceUnit()
              }
              allowEdit={
                isMethodAllowed(leaseMethods, Methods.PATCH) &&
                isServiceUnitSameAsActiveServiceUnit()
              }
              commentAmount={comments ? comments.length : 0}
              deleteModalTexts={{
                buttonClassName: ButtonColors.ALERT,
                buttonText: ConfirmationModalTexts.DELETE_LEASE.BUTTON,
                label: ConfirmationModalTexts.DELETE_LEASE.LABEL,
                title: ConfirmationModalTexts.DELETE_LEASE.TITLE,
              }}
              isCancelDisabled={activeTab == 6}
              isEditDisabled={activeTab == 6}
              isEditMode={isEditMode}
              isSaveDisabled={
                activeTab == 6 || (isSaveClicked && !areFormsValid)
              }
              onCancel={cancelChanges}
              onComment={toggleCommentPanel}
              onDelete={handleDelete}
              onEdit={openEditMode}
              onSave={saveChanges}
            />
          }
          infoComponent={<LeaseInfo />}
          onBack={handleBack}
        />

        <Tabs
          active={activeTab}
          isEditMode={isEditMode}
          tabs={[
            {
              label: "Yhteenveto",
              allow: true,
              isDirty: summaryFormState.dirty,
              hasError: isSaveClicked && !summaryFormState.valid,
            },
            {
              label: "Vuokra-alue",
              allow: isFieldAllowedToRead(
                leaseAttributes,
                LeaseAreasFieldPaths.LEASE_AREAS,
              ),
              isDirty: leaseAreasFormState.dirty,
              hasError: isSaveClicked && !leaseAreasFormState.valid,
            },
            {
              label: "Vuokralaiset",
              allow: isFieldAllowedToRead(
                leaseAttributes,
                LeaseTenantsFieldPaths.TENANTS,
              ),
              isDirty: tenantsFormState.dirty,
              hasError: isSaveClicked && !tenantsFormState.valid,
            },
            {
              label: "Vuokrat",
              allow:
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseRentsFieldPaths.RENTS,
                ) ||
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
                ),
              isDirty: isRentsFormDirty,
              hasError: isSaveClicked && !isRentsFormValid,
            },
            {
              label: "Päätökset ja sopimukset",
              allow:
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseDecisionsFieldPaths.DECISIONS,
                ) ||
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseContractsFieldPaths.CONTRACTS,
                ) ||
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseInspectionsFieldPaths.INSPECTIONS,
                ),
              isDirty:
                contractsFormState.dirty ||
                decisionsFormState.dirty ||
                inspectionsFormState.dirty,
              hasError:
                isSaveClicked &&
                (!contractsFormState.valid ||
                  !decisionsFormState.valid ||
                  !inspectionsFormState.valid),
            },
            {
              label: "Rakentamiskelpoisuus",
              allow: isFieldAllowedToRead(
                leaseAttributes,
                LeaseAreasFieldPaths.LEASE_AREAS,
              ),
              isDirty: constructabilityFormState.dirty,
              hasError: isSaveClicked && !constructabilityFormState.valid,
            },
            {
              label: "Laskutus",
              allow: hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_INVOICE,
              ),
            },
            {
              label: "Kartta",
              allow: isMethodAllowed(leaseMethods, Methods.GET),
            },
            {
              label: "Muutoshistoria",
              allow: isMethodAllowed(leaseMethods, Methods.GET),
            },
          ]}
          onTabClick={handleTabClick}
        />
      </PageNavigationWrapper>

      <PageContainer className="with-control-bar-and-tabs" hasTabs>
        {isSaving && (
          <LoaderWrapper className="overlay-wrapper">
            <Loader isLoading={isSaving} />
          </LoaderWrapper>
        )}

        <Authorization allow={isMethodAllowed(leaseMethods, Methods.PATCH)}>
          <ConfirmationModal
            confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON}
            isOpen={isRestoreModalOpen}
            label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL}
            onCancel={cancelRestoreUnsavedChanges}
            onClose={cancelRestoreUnsavedChanges}
            onSave={restoreUnsavedChanges}
            title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE}
          />
        </Authorization>

        <CommentPanel
          isOpen={isCommentPanelOpen}
          onClose={toggleCommentPanel}
        />

        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              {isEditMode ? (
                <Authorization
                  allow={isMethodAllowed(leaseMethods, Methods.PATCH)}
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <SummaryEdit formApi={summaryFormRef.current} />
                </Authorization>
              ) : (
                <Summary />
              )}
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode ? (
                <Authorization
                  allow={
                    isMethodAllowed(leaseMethods, Methods.PATCH) &&
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseAreasFieldPaths.LEASE_AREAS,
                    )
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <LeaseAreasEdit formApi={leaseAreasFormRef.current} />
                </Authorization>
              ) : (
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseAreasFieldPaths.LEASE_AREAS,
                  )}
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <LeaseAreas />
                </Authorization>
              )}
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode ? (
                <Authorization
                  allow={
                    isMethodAllowed(leaseMethods, Methods.PATCH) &&
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseTenantsFieldPaths.TENANTS,
                    )
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <TenantsEdit formApi={leaseTenantFormRef.current} />
                </Authorization>
              ) : (
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseTenantsFieldPaths.TENANTS,
                  )}
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <Tenants />
                </Authorization>
              )}
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode ? (
                <Authorization
                  allow={
                    isMethodAllowed(leaseMethods, Methods.PATCH) &&
                    (isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
                    ) ||
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentsFieldPaths.RENTS,
                      ))
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <RentsEdit />
                </Authorization>
              ) : (
                <Authorization
                  allow={
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
                    ) ||
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseRentsFieldPaths.RENTS,
                    )
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <Rents />
                </Authorization>
              )}
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode ? (
                <Authorization
                  allow={
                    (isMethodAllowed(leaseMethods, Methods.PATCH) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseDecisionsFieldPaths.DECISIONS,
                      )) ||
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseContractsFieldPaths.CONTRACTS,
                    ) ||
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseInspectionsFieldPaths.INSPECTIONS,
                    )
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <DecisionsMainEdit
                    decisionsFormApi={leaseDecisionsFormRef.current}
                    contractFormApi={leaseContractsFormRef.current}
                    inspectionsFormApi={leaseInspectionsFormRef.current}
                  />
                </Authorization>
              ) : (
                <Authorization
                  allow={
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseDecisionsFieldPaths.DECISIONS,
                    ) ||
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseContractsFieldPaths.CONTRACTS,
                    ) ||
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseInspectionsFieldPaths.INSPECTIONS,
                    )
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <DecisionsMain />
                </Authorization>
              )}
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode ? (
                <Authorization
                  allow={
                    isMethodAllowed(leaseMethods, Methods.PATCH) &&
                    isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseAreasFieldPaths.LEASE_AREAS,
                    )
                  }
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <ConstructabilityEdit
                    formApi={leaseConstructabilityFormRef.current}
                  />
                </Authorization>
              ) : (
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseAreasFieldPaths.LEASE_AREAS,
                  )}
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <Constructability />
                </Authorization>
              )}
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_INVOICE,
                )}
                errorComponent={
                  <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                }
              >
                <Invoices />
              </Authorization>
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <Authorization allow={isMethodAllowed(leaseMethods, Methods.GET)}>
                <SingleLeaseMap />
              </Authorization>
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <Authorization allow={isMethodAllowed(leaseMethods, Methods.GET)}>
                <LeaseAuditLog leaseId={leaseId} />
              </Authorization>
            </ContentContainer>
          </TabPane>
        </TabContent>
      </PageContainer>
    </FullWidthContainer>
  );
};

export default flowRight(
  withLeasePageAttributes,
  withUiDataList,
  connect(
    (state, props: Props) => {
      return {
        areasFormValues: getFormValues(FormNames.LEASE_AREAS)(state),
        constructabilityFormValues: getFormValues(
          FormNames.LEASE_CONSTRUCTABILITY,
        )(state),
        contractsFormValues: getFormValues(FormNames.LEASE_CONTRACTS)(state),
        currentLease: getCurrentLease(state),
        decisionsFormValues: getFormValues(FormNames.LEASE_DECISIONS)(state),
        inspectionsFormValues: getFormValues(FormNames.LEASE_INSPECTIONS)(
          state,
        ),
        isEditMode: getIsEditMode(state),
        isFormValidFlags: getIsFormValidFlags(state),
        isFetchingOldDwellingsInHousingCompaniesPriceIndex:
          getIsFetchingOldDwellingsInHousingCompaniesPriceIndex(state),
        isFetchingReceivableTypes: getIsFetchingReceivableTypes(state),
        isRentsFormDirty: isDirty(FormNames.LEASE_RENTS)(state),
        isRentsFormValid: getIsFormValidById(state, FormNames.LEASE_RENTS),
        isSaving: getIsSaving(state),
        isFetching: getIsFetching(state),
        isSaveClicked: getIsSaveClicked(state),
        leaseTypeList: getLeaseTypeList(state),
        loggedUser: getLoggedInUser(state),
        oldDwellingsInHousingCompaniesPriceIndex:
          getOldDwellingsInHousingCompaniesPriceIndex(state),
        rentsFormValues: getFormValues(FormNames.LEASE_RENTS)(state),
        tenantsFormValues: getFormValues(FormNames.LEASE_TENANTS)(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
        vats: getVats(state),
      };
    },
    {
      reduxFormChange,
      clearPreviewInvoices,
      deleteLease,
      destroy,
      fetchCommentsByLease,
      fetchInvoicesByLease,
      fetchLeaseTypes,
      fetchOldDwellingsInHousingCompaniesPriceIndex,
      fetchSingleLease,
      fetchReceivableTypes,
      fetchVats,
      hideEditMode,
      initialize,
      patchLease,
      receiveIsSaveClicked,
      receiveSingleLease,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(LeasePage);
