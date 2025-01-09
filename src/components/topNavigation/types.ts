import type { Action } from "types";
export type TopNavigationState = Record<string, any>;
export type TopNavigationSettings = {
  linkUrl: string;
  pageTitle: string;
  showSearch: boolean;
};
export type ReceiveTopNavigationSettingsAction = Action<
  string,
  TopNavigationSettings
>;
