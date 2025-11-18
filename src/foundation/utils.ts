import classNames from "classnames";
import { Breakpoints, FloatTypes } from "./enums";
import type { ComponentType } from "react";

type Breakpoint = (typeof Breakpoints)[keyof typeof Breakpoints];
type FloatValue = (typeof FloatTypes)[keyof typeof FloatTypes];
export type GeneralProps = {
  float?: FloatValue;
  isClearfix?: boolean;
  isHidden?: boolean;
  isInvisible?: boolean;
  hideFor?: Breakpoint;
  hideOnlyFor?: Breakpoint;
  showFor?: Breakpoint;
  showForLandscape?: boolean;
  showForPortrait?: boolean;
  showForSr?: boolean;
  showOnFocus?: boolean;
  showOnlyFor?: Breakpoint;
};

/**
 * Creates class names from the given arguments.
 */
export function createClassName(...args: Array<any>): string {
  return classNames(...args);
}

/**
 * Parses the general class names from the given properties.
 */
export function generalClassNames({
  float,
  isClearfix,
  isHidden,
  isInvisible,
  hideFor,
  hideOnlyFor,
  showFor,
  showForLandscape,
  showForPortrait,
  showForSr,
  showOnFocus,
  showOnlyFor,
}: GeneralProps): Record<string, boolean> {
  return {
    "show-for-medium": showFor === Breakpoints.MEDIUM,
    "show-for-large": showFor === Breakpoints.LARGE,
    "show-for-small-only": showOnlyFor === Breakpoints.SMALL,
    "show-for-medium-only": showOnlyFor === Breakpoints.MEDIUM,
    "show-for-large-only": showOnlyFor === Breakpoints.LARGE,
    "hide-for-medium": hideFor === Breakpoints.MEDIUM,
    "hide-for-large": hideFor === Breakpoints.LARGE,
    "hide-for-small-only": hideOnlyFor === Breakpoints.SMALL,
    "hide-for-medium-only": hideOnlyFor === Breakpoints.MEDIUM,
    "hide-for-large-only": hideOnlyFor === Breakpoints.LARGE,
    hide: isHidden,
    invisible: isInvisible,
    "show-for-landscape": showForLandscape,
    "show-for-portrait": showForPortrait,
    "show-for-sr": showForSr,
    "show-on-focus": showOnFocus,
    clearfix: isClearfix,
    "float-left": float === FloatTypes.LEFT,
    "float-center": float === FloatTypes.CENTER,
    "float-right": float === FloatTypes.RIGHT,
  };
}

/**
 * Returns the display name for the given component.
 */
export function getComponentDisplayName(component: ComponentType<any>): string {
  return component.displayName || component.name || "Component";
}
