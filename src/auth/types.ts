import type { Action } from "@/types";
import type { User } from "hds-react";
export type ApiToken = Record<string, any> | null;
export type AuthState = Record<string, any> | null;
export type FetchApiTokenAction = Action<string, string>;
export type ReceiveApiTokenAction = Action<string, Record<string, any>>;
export type ClearApiTokenAction = Action<string, void>;
export type TokenNotFoundAction = Action<string, void>;
export type ReceiveUserAction = Action<string, User | null>;