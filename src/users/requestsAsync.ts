import createUrl from "@/api/createUrl";
import callApiAsync from "@/api/callApiAsync";
import { User } from "hds-react";
export const fetchUsers = async (query?: User): Promise<Array<User>> => {
  const {
    response: { status },
    bodyAsJson,
  } = await callApiAsync(new Request(createUrl("user/", query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error("Failed to fetch users with status %s", status);
      return [];
  }
};
export const fetchOfficers = async (query?: User): Promise<Array<User>> => {
  const {
    response: { status },
    bodyAsJson,
  } = await callApiAsync(new Request(createUrl("officer/", query)));

  switch (status) {
    // case 200:
    //   return bodyAsJson.results;

    default:
      console.error("Failed to fetch officers with status %s", status);
      return [];
  }
};
export const fetchSingleUser = async (
  id: number,
): Promise<Record<string, any> | null> => {
  const {
    response: { status },
    bodyAsJson,
  } = await callApiAsync(new Request(createUrl(`user/${id}/`)));

  switch (status) {
    case 200:
      return bodyAsJson;

    default:
      console.error("Failed to fetch the user");
      return null;
  }
};
