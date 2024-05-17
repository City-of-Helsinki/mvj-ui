import createUrl from "src/api/createUrl";
import callApiAsync from "src/api/callApiAsync";
export const fetchContacts = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('contact/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch contacts');
      return [];
  }
};
export const contactExists = async (identifier: string) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl(`contact_exists/?identifier=${identifier}`)));

  switch (status) {
    case 200:
      return bodyAsJson.exists;

    default:
      console.error('Failed to check does contact exist');
      return [];
  }
};