import createUrl from "@/api/createUrl";
import callApiAsync from "@/api/callApiAsync";
import { ContactExistsResponse } from "./types";
export const fetchContacts = async (query?: Record<string, any>) => {
  const {
    response: { status },
    bodyAsJson,
  } = await callApiAsync(new Request(createUrl("contact/", query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error("Failed to fetch contacts");
      return [];
  }
};
export const contactExists = async ({
  identifier,
  serviceUnitId,
}: {
  identifier: string;
  serviceUnitId?: number;
}): Promise<boolean | Array<any>> => {
  const {
    response: { status },
    bodyAsJson,
  } = await callApiAsync<ContactExistsResponse>(
    new Request(
      createUrl(
        `contact_exists/?identifier=${identifier}&service_unit=${serviceUnitId || ""}`,
      ),
    ),
  );

  switch (status) {
    case 200:
      return bodyAsJson.exists;

    default:
      console.error("Failed to check does contact exist");
      return [];
  }
};
