import { TableSortOrder } from "@/enums";
import { TenantContactType } from "@/leases/enums";

/**
 * Default sort key of contact list page
 */
export const DEFAULT_SORT_KEY: string = "names";

/**
 * Default sort order of contact list page
 */
export const DEFAULT_SORT_ORDER: string = TableSortOrder.ASCENDING;
export const TENANT_CONTACT_TYPE_LABELS: Record<string, string> = {
  [TenantContactType.TENANT]: "Vuokralainen",
  [TenantContactType.BILLING]: "Laskunsaaja",
  [TenantContactType.CONTACT]: "Yhteyshenkilö",
};
