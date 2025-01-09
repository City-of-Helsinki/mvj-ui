import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import { getSearchQuery } from "@/util/helpers";
import type { FetchPreviewInvoicesPayload } from "./types";
export const fetchPreviewInvoices = ({
  lease,
  year,
}: FetchPreviewInvoicesPayload): Generator<any, any, any> => {
  return callApi(
    new Request(
      createUrl(
        `lease_preview_invoices_for_year/${getSearchQuery({
          year: year,
          lease: lease,
        })}`,
      ),
    ),
  );
};
