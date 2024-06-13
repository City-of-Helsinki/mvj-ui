import createUrl from "api/createUrl";
import callApiAsync from "api/callApiAsync";
import type { IntendedUse } from "./types";
export const fetchLeases = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('lease/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch leases');
      return [];
  }
};
export const fetchAreaSearches = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('area_search/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch area searches');
      return [];
  }
};
export const fetchPlotSearches = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('plot_search/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch target statuses');
      return [];
  }
};
export const fetchTargetStatuses = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('target_status/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch target statuses');
      return [];
  }
};
export const fetchDecisions = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('decision/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch decisions');
      return [];
  }
};
export const fetchIntendedUses = async (query?: Record<string, any>): Promise<Array<IntendedUse>> => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('intended_use/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch intended uses');
      return [];
  }
};