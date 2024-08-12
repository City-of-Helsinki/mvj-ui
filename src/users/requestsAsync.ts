import createUrl from "@/api/createUrl";
import callApiAsync from "@/api/callApiAsync";
export const fetchUsers = async (query?: Record<string, any>): Promise<Array<Record<string, any>>> => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('user/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch users');
      return [];
  }
};
export const fetchSingleUser = async (id: number): Promise<Record<string, any> | null> => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl(`user/${id}/`)));

  switch (status) {
    case 200:
      return bodyAsJson;

    default:
      console.error('Failed to fetch the user');
      return null;
  }
};