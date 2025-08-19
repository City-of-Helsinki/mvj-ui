import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  change as reduxFormChange,
  destroy,
  getFormValues,
  initialize,
  isDirty,
} from "redux-form";
import { createForm } from "final-form";
import type { FormApi } from "final-form";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
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
  clearFormValidFlags,
  deleteLease,
  fetchSingleLease,
  hideEditMode,
  patchLease,
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
  addLeaseAreaDraftFormValuesToPayload,
  clearUnsavedChanges,
  getContentLeaseAreaDraft,
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
import type {
  Attributes,
  LeafletFeatureGeometry,
  Methods as MethodsType,
} from "types";
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
import { validateSummaryForm } from "../formValidators";

type Props = {
  areasFormValues: Record<string, any>;
  reduxFormChange: typeof reduxFormChange;
  clearFormValidFlags: (...args: Array<any>) => any;
  clearPreviewInvoices: (...args: Array<any>) => any;
  comments: CommentList;
  commentMethods: MethodsType;
  // get via withLeasePageAttributes HOC
  contractsFormValues: Record<string, any>;
  constructabilityFormValues: Record<string, any>;
  currentLease: Lease;
  decisionsFormValues: Record<string, any>;
  deleteLease: (...args: Array<any>) => any;
  destroy: (...args: Array<any>) => any;
  leaseAreaDraftFormValues: LeafletFeatureGeometry | null | undefined;
  fetchCommentsByLease: (...args: Array<any>) => any;
  fetchInvoicesByLease: (...args: Array<any>) => any;
  fetchLeaseTypes: (...args: Array<any>) => any;
  fetchSingleLease: (...args: Array<any>) => any;
  fetchOldDwellingsInHousingCompaniesPriceIndex: (...args: Array<any>) => any;
  fetchReceivableTypes: (...args: Array<any>) => any;
  fetchVats: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  inspectionsFormValues: Record<string, any>;
  invoices: InvoiceList;
  isLeaseAreaDraftFormDirty: boolean;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingLeasePageAttributes: boolean;
  isFetchingReceivableTypes: boolean;
  isFetchingOldDwellingsInHousingCompaniesPriceIndex: boolean;
  // get via withLeasePageAttributes HOC
  isFormValidFlags: Record<string, any>;
  isConstructabilityFormDirty: boolean;
  isConstructabilityFormValid: boolean;
  isContractsFormDirty: boolean;
  isContractsFormValid: boolean;
  isDecisionsFormDirty: boolean;
  isDecisionsFormValid: boolean;
  isInspectionsFormDirty: boolean;
  isInspectionsFormValid: boolean;
  isLeaseAreasFormDirty: boolean;
  isLeaseAreasFormValid: boolean;
  isRentsFormDirty: boolean;
  isRentsFormValid: boolean;
  isSaving: boolean;
  isTenantsFormDirty: boolean;
  isTenantsFormValid: boolean;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  leaseMethods: MethodsType;
  leaseTypeList: LeaseTypeList;
  location: Record<string, any>;
  loggedUser: Record<string, any>;
  match: {
    params: Record<string, any>;
  };
  oldDwellingsInHousingCompaniesPriceIndex: OldDwellingsInHousingCompaniesPriceIndex | null;
  patchLease: (...args: Array<any>) => any;
  receiveSingleLease: (...args: Array<any>) => any;
  receiveFormValidFlags: (...args: Array<any>) => any;
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
    clearFormValidFlags,
    clearPreviewInvoices,
    comments,
    commentMethods,
    contractsFormValues,
    constructabilityFormValues,
    currentLease,
    decisionsFormValues,
    deleteLease,
    destroy,
    leaseAreaDraftFormValues,
    fetchCommentsByLease,
    fetchInvoicesByLease,
    fetchLeaseTypes,
    fetchSingleLease,
    fetchOldDwellingsInHousingCompaniesPriceIndex,
    fetchReceivableTypes,
    fetchVats,
    hideEditMode,
    history,
    initialize,
    inspectionsFormValues,
    invoices,
    isLeaseAreaDraftFormDirty,
    isEditMode,
    isFetching,
    isFetchingLeasePageAttributes,
    isFetchingReceivableTypes,
    isFetchingOldDwellingsInHousingCompaniesPriceIndex,
    isFormValidFlags,
    isConstructabilityFormDirty,
    isConstructabilityFormValid,
    isContractsFormDirty,
    isContractsFormValid,
    isDecisionsFormDirty,
    isDecisionsFormValid,
    isInspectionsFormDirty,
    isInspectionsFormValid,
    isLeaseAreasFormDirty,
    isLeaseAreasFormValid,
    isRentsFormDirty,
    isRentsFormValid,
    isSaving,
    isTenantsFormDirty,
    isTenantsFormValid,
    isSaveClicked,
    leaseAttributes,
    leaseMethods,
    leaseTypeList,
    location: { search, pathname },
    loggedUser,
    match: {
      params: { leaseId },
    },
    oldDwellingsInHousingCompaniesPriceIndex,
    patchLease,
    receiveSingleLease,
    receiveFormValidFlags,
    receiveIsSaveClicked,
    receiveTopNavigationSettings,
    rentsFormValues,
    showEditMode,
    tenantsFormValues,
    userActiveServiceUnit,
    usersPermissions,
    vats,
  } = props;

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);
  const [summaryFormState, setSummaryFormState] = useState({
    dirty: false,
    valid: true,
  });

  const contextTypes = {
    router: PropTypes.object,
  };

  const timerAutoSave = useRef<NodeJS.Timeout>();

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

    const unsubscribeSummaryForm = summaryFormRef.current.subscribe(
      (formState) => {
        setSummaryFormState({
          dirty: formState.dirty,
          valid: formState.valid,
        });
      },
      { dirty: true, errors: true, valid: true },
    );

    return () => {
      if (pathname !== `${getRouteById(Routes.LEASES)}/${leaseId}`) {
        clearUnsavedChanges();
      }

      stopAutoSaveTimer();
      clearPreviewInvoices();
      // Clear current lease
      receiveSingleLease({});
      destroy(FormNames.INVOICE_SIMULATOR);
      destroy(FormNames.RENT_CALCULATOR);
      hideEditMode();
      window.removeEventListener("beforeunload", handleLeavePage);

      unsubscribeSummaryForm();
    };
  }, []);

  useEffect(() => {
    scrollToTopPage();
  }, [activeTab]);

  useEffect(() => {
    fetchCurrentLeaseData();
    fetchLeaseRelatedData();
  }, [leaseId, usersPermissions]);

  useEffect(() => {
    if (!isEmpty(currentLease)) {
      const pageTitle = getLeasePageTitle(currentLease);
      setPageTitle(pageTitle);

      if (currentLease?.service_unit) {
        fetchReceivableTypes();
      }
    }
  }, [currentLease]);

  useEffect(() => {
    if (!isEmpty(currentLease)) {
      const storedLeaseId = getSessionStorageItem("leaseId");
      if (Number(leaseId) === storedLeaseId) {
        setIsRestoreModalOpen(true);
      }
    }
  }, [currentLease, leaseId]);

  const fetchCurrentLeaseData = () => {
    fetchSingleLease(leaseId);
  };

  const fetchLeaseRelatedData = () => {
    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_COMMENT) &&
      !comments
    ) {
      fetchCommentsByLease(leaseId);
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) &&
      !invoices
    ) {
      fetchInvoicesByLease(leaseId);
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASETYPE) &&
      isEmpty(leaseTypeList)
    ) {
      fetchLeaseTypes();
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_VAT) &&
      isEmpty(vats)
    ) {
      fetchVats();
    }
  };

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
    receiveIsSaveClicked(false);
    clearFormValidFlags();
    destroyAllForms();
    initializeForms(currentLease);
    showEditMode();
    startAutoSaveTimer();
  };

  const destroyAllForms = () => {
    destroy(FormNames.LEASE_CONSTRUCTABILITY);
    destroy(FormNames.LEASE_CONTRACTS);
    destroy(FormNames.LEASE_DECISIONS);
    destroy(FormNames.LEASE_INSPECTIONS);
    destroy(FormNames.LEASE_AREAS);
    destroy(FormNames.LEASE_RENTS);
    destroy(FormNames.LEASE_SUMMARY);
    destroy(FormNames.LEASE_TENANTS);
    destroy(FormNames.LEASE_AREA_DRAFT);
  };

  const summaryFormRef = useRef(
    createForm({
      onSubmit: () => {},
      validate: validateSummaryForm,
    }),
  );

  const initializeForms = (lease: Lease) => {
    const areas = getContentLeaseAreas(lease),
      rents = getContentRents(lease),
      tenants = getContentTenants(lease);
    initialize(FormNames.LEASE_CONSTRUCTABILITY, {
      lease_areas: getContentConstructabilityAreas(lease),
    });
    initialize(FormNames.LEASE_CONTRACTS, {
      contracts: getContentContracts(lease),
    });
    initialize(FormNames.LEASE_DECISIONS, {
      decisions: getContentDecisions(lease),
    });
    initialize(FormNames.LEASE_INSPECTIONS, {
      inspections: getContentInspections(lease),
    });
    initialize(FormNames.LEASE_AREAS, {
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
    initialize(FormNames.LEASE_TENANTS, {
      tenants: tenants.filter((tenant) => !isArchived(tenant.tenant)),
      tenantsArchived: tenants.filter((tenant) => isArchived(tenant.tenant)),
    });
    initialize(FormNames.LEASE_AREA_DRAFT, {
      lease_area_draft: getContentLeaseAreaDraft(lease),
    });
  };

  const cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    setIsRestoreModalOpen(false);
  };

  const restoreUnsavedChanges = () => {
    destroyAllForms();
    clearFormValidFlags();
    showEditMode();
    initializeForms(currentLease);
    const storedAreasFormValues = getSessionStorageItem(FormNames.LEASE_AREAS);

    if (storedAreasFormValues) {
      bulkChangeReduxForm(FormNames.LEASE_AREAS, storedAreasFormValues);
    }

    const storedConstructabilityFormValues = getSessionStorageItem(
      FormNames.LEASE_CONSTRUCTABILITY,
    );

    if (storedConstructabilityFormValues) {
      bulkChangeReduxForm(
        FormNames.LEASE_CONSTRUCTABILITY,
        storedConstructabilityFormValues,
      );
    }

    const storedContractsFormValues = getSessionStorageItem(
      FormNames.LEASE_CONTRACTS,
    );

    if (storedContractsFormValues) {
      bulkChangeReduxForm(FormNames.LEASE_CONTRACTS, storedContractsFormValues);
    }

    const storedDecisionsFormValues = getSessionStorageItem(
      FormNames.LEASE_DECISIONS,
    );

    if (storedDecisionsFormValues) {
      bulkChangeReduxForm(FormNames.LEASE_DECISIONS, storedDecisionsFormValues);
    }

    const storedInspectionsFormValues = getSessionStorageItem(
      FormNames.LEASE_INSPECTIONS,
    );

    if (storedInspectionsFormValues) {
      bulkChangeReduxForm(
        FormNames.LEASE_INSPECTIONS,
        storedInspectionsFormValues,
      );
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
      bulkChangeReduxForm(FormNames.LEASE_TENANTS, storedTenantsFormValues);
    }

    const storedFormValidity = getSessionStorageItem("leaseValidity");

    if (storedFormValidity) {
      receiveFormValidFlags(storedFormValidity);
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
    let isDirty = false;

    if (isConstructabilityFormDirty) {
      setSessionStorageItem(
        FormNames.LEASE_CONSTRUCTABILITY,
        constructabilityFormValues,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_CONSTRUCTABILITY);
    }

    if (isContractsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_CONTRACTS, contractsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_CONTRACTS);
    }

    if (isDecisionsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_DECISIONS, decisionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_DECISIONS);
    }

    if (isInspectionsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_INSPECTIONS, inspectionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_INSPECTIONS);
    }

    if (isLeaseAreasFormDirty) {
      setSessionStorageItem(FormNames.LEASE_AREAS, areasFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_AREAS);
    }

    if (isLeaseAreaDraftFormDirty) {
      setSessionStorageItem(
        FormNames.LEASE_AREA_DRAFT,
        leaseAreaDraftFormValues,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_AREA_DRAFT);
    }

    if (isRentsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_RENTS, rentsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_RENTS);
    }
    if (summaryFormRef.current.getState().dirty) {
      setSessionStorageItem(
        FormNames.LEASE_SUMMARY,
        summaryFormRef.current.getState().values,
      );
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_SUMMARY);
    }

    if (isTenantsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_TENANTS, tenantsFormValues);
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
    clearUnsavedChanges();
  };

  const saveChanges = () => {
    const areFormsValid = validateForms();
    receiveIsSaveClicked(true);

    if (areFormsValid) {
      let payload: Record<string, any> = {
        id: currentLease.id,
      };

      if (isConstructabilityFormDirty) {
        payload = addConstructabilityFormValuesToPayload(
          payload,
          constructabilityFormValues,
        );
      }

      if (isContractsFormDirty) {
        payload = addContractsFormValuesToPayload(payload, contractsFormValues);
      }

      if (isDecisionsFormDirty) {
        payload = addDecisionsFormValuesToPayload(payload, decisionsFormValues);
      }

      if (isLeaseAreaDraftFormDirty) {
        payload = addLeaseAreaDraftFormValuesToPayload(
          payload,
          leaseAreaDraftFormValues,
        );
      }

      if (isInspectionsFormDirty) {
        payload = addInspectionsFormValuesToPayload(
          payload,
          inspectionsFormValues,
        );
      }

      if (isLeaseAreasFormDirty) {
        payload = addAreasFormValuesToPayload(payload, areasFormValues);
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

      if (isTenantsFormDirty) {
        payload = addTenantsFormValuesToPayload(payload, tenantsFormValues);
      }

      patchLease(payload);
      cancelChanges();
    }
  };
  const validateForms = () => {
    return (
      isConstructabilityFormValid &&
      isContractsFormValid &&
      isDecisionsFormValid &&
      isInspectionsFormValid &&
      isLeaseAreasFormValid &&
      isRentsFormValid &&
      summaryFormState.valid &&
      isTenantsFormValid
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
    return history.push({
      pathname: `${getRouteById(Routes.LEASES)}`,
      search: getSearchQuery(query),
    });
  };

  const handleTabClick = (tabId: string) => {
    const query = getUrlParams(search);
    query.tab = tabId;
    return history.push({ ...location, search: getSearchQuery(query) });
  };

  const toggleCommentPanel = () => {
    setIsCommentPanelOpen(!isCommentPanelOpen);
  };

  const isAnyFormDirty = () => {
    return (
      isConstructabilityFormDirty ||
      isContractsFormDirty ||
      isDecisionsFormDirty ||
      isLeaseAreaDraftFormDirty ||
      isInspectionsFormDirty ||
      isLeaseAreasFormDirty ||
      isRentsFormDirty ||
      summaryFormState.dirty ||
      isTenantsFormDirty
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
              isDirty: isLeaseAreasFormDirty,
              hasError: isSaveClicked && !isLeaseAreasFormValid,
            },
            {
              label: "Vuokralaiset",
              allow: isFieldAllowedToRead(
                leaseAttributes,
                LeaseTenantsFieldPaths.TENANTS,
              ),
              isDirty: isTenantsFormDirty,
              hasError: isSaveClicked && !isTenantsFormValid,
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
                isContractsFormDirty ||
                isDecisionsFormDirty ||
                isInspectionsFormDirty,
              hasError:
                isSaveClicked &&
                (!isContractsFormValid ||
                  !isDecisionsFormValid ||
                  !isInspectionsFormValid),
            },
            {
              label: "Rakentamiskelpoisuus",
              allow: isFieldAllowedToRead(
                leaseAttributes,
                LeaseAreasFieldPaths.LEASE_AREAS,
              ),
              isDirty: isConstructabilityFormDirty,
              hasError: isSaveClicked && !isConstructabilityFormValid,
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
              isDirty: isLeaseAreaDraftFormDirty,
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
                  <LeaseAreasEdit />
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
                  <TenantsEdit />
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
                  <DecisionsMainEdit />
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
                  <ConstructabilityEdit />
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
  withRouter,
  connect(
    (state, props: Props) => {
      const currentLease = getCurrentLease(state);
      return {
        areasFormValues: getFormValues(FormNames.LEASE_AREAS)(state),
        comments: getCommentsByLease(state, props.match.params.leaseId),
        constructabilityFormValues: getFormValues(
          FormNames.LEASE_CONSTRUCTABILITY,
        )(state),
        contractsFormValues: getFormValues(FormNames.LEASE_CONTRACTS)(state),
        currentLease: currentLease,
        decisionsFormValues: getFormValues(FormNames.LEASE_DECISIONS)(state),
        inspectionsFormValues: getFormValues(FormNames.LEASE_INSPECTIONS)(
          state,
        ),
        invoices: getInvoicesByLease(state, props.match.params.leaseId),
        isEditMode: getIsEditMode(state),
        isFormValidFlags: getIsFormValidFlags(state),
        isConstructabilityFormDirty: isDirty(FormNames.LEASE_CONSTRUCTABILITY)(
          state,
        ),
        isConstructabilityFormValid: getIsFormValidById(
          state,
          FormNames.LEASE_CONSTRUCTABILITY,
        ),
        isContractsFormDirty: isDirty(FormNames.LEASE_CONTRACTS)(state),
        isContractsFormValid: getIsFormValidById(
          state,
          FormNames.LEASE_CONTRACTS,
        ),
        isDecisionsFormDirty: isDirty(FormNames.LEASE_DECISIONS)(state),
        isDecisionsFormValid: getIsFormValidById(
          state,
          FormNames.LEASE_DECISIONS,
        ),
        isFetchingOldDwellingsInHousingCompaniesPriceIndex:
          getIsFetchingOldDwellingsInHousingCompaniesPriceIndex(state),
        isFetchingReceivableTypes: getIsFetchingReceivableTypes(state),
        isInspectionsFormDirty: isDirty(FormNames.LEASE_INSPECTIONS)(state),
        isInspectionsFormValid: getIsFormValidById(
          state,
          FormNames.LEASE_INSPECTIONS,
        ),
        isLeaseAreasFormDirty: isDirty(FormNames.LEASE_AREAS)(state),
        isLeaseAreasFormValid: getIsFormValidById(state, FormNames.LEASE_AREAS),
        isRentsFormDirty: isDirty(FormNames.LEASE_RENTS)(state),
        isRentsFormValid: getIsFormValidById(state, FormNames.LEASE_RENTS),
        isSaving: getIsSaving(state),
        isTenantsFormDirty: isDirty(FormNames.LEASE_TENANTS)(state),
        isTenantsFormValid: getIsFormValidById(state, FormNames.LEASE_TENANTS),
        isLeaseAreaDraftFormDirty: isDirty(FormNames.LEASE_AREA_DRAFT)(state),
        isFetching: getIsFetching(state),
        isSaveClicked: getIsSaveClicked(state),
        leaseAreaDraftFormValues: getFormValues(FormNames.LEASE_AREA_DRAFT)(
          state,
        ),
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
      clearFormValidFlags,
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
      receiveFormValidFlags,
      receiveIsSaveClicked,
      receiveSingleLease,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(LeasePage);
