import type { Action } from "@/types";
import type { User } from "hds-react";
export type ApiToken = string | null;
export type AuthState = string | null;
export type ReceiveApiTokenAction = Action<string, Record<string, any>>;
export type ClearApiTokenAction = Action<string, void>;
export type ReceiveUserAction = Action<string, User | null>;
