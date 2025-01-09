/**
 * Breakpoints enumerable.
 *
 * @type {{SMALL: string, MEDIUM: string, LARGE: string, XLARGE: string, XXLARGE: string}}
 */
export const Breakpoints = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  XLARGE: "xlarge",
  XXLARGE: "xxlarge",
};

/**
 * Badge color enumerable.
 *
 * @type {{PRIMARY: string: SECONDARY: string, SUCCESS: string, WARNING: string, ALERT: string}}
 */
export const BadgeColors = {
  INFO: "info",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

/**
 * Button color enumerable.
 *
 * @type {{PRIMARY: string: SECONDARY: string, SUCCESS: string, WARNING: string, ALERT: string}}
 */
export const ButtonColors = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

/**
 * Button group color enumerable.
 *
 * @type {{PRIMARY: string: SECONDARY: string, SUCCESS: string, WARNING: string, ALERT: string}}
 */
export const ButtonGroupColors = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

/**
 * Callout color enumerable.
 *
 * @type {{PRIMARY: string: SECONDARY: string, SUCCESS: string, WARNING: string, ALERT: string}}
 */
export const CalloutColors = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

/**
 * Label color enumerable.
 *
 * @type {{INFO: string, SECONDARY: string, SUCCESS: string, WARNING: string, ALERT: string}}
 */
export const LabelColors = {
  INFO: "info",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

/**
 * Progress colors enumerable.
 *
 * @type {{SECONDARY: string, SUCCESS: string, WARNING: string, ALERT: string}}
 */
export const ProgressColors = {
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ALERT: "alert",
};

/**
 * Color meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
export const Colors = {
  ...BadgeColors,
  ...ButtonColors,
  ...ButtonGroupColors,
  ...CalloutColors,
  ...LabelColors,
  ...ProgressColors,
};

/**
 * Button size enumerable.
 *
 * @type {{TINY: string, SMALL: string, LARGE: string}}
 */
export const ButtonSizes = {
  TINY: "tiny",
  SMALL: "small",
  LARGE: "large",
};

/**
 * Button group size enumerable.
 *
 * @type {{TINY: string, SMALL: string, LARGE: string}}
 */
export const ButtonGroupSizes = {
  TINY: "tiny",
  SMALL: "small",
  LARGE: "large",
};

/**
 * Callout size enumerable.
 *
 * @type {{SMALL: string, LARGE: string}}
 */
export const CalloutSizes = {
  SMALL: "small",
  LARGE: "large",
};

/**
 * Reveal size enumerable.
 * @type {{TINY: string, SMALL: string, LARGE: string, FULL: string}}
 */
export const RevealSizes = {
  TINY: "tiny",
  SMALL: "small",
  LARGE: "large",
  FULL: "full",
};

/**
 * Switch size enumerable.
 *
 * @type {{TINY: string, SMALL: string, LARGE: string}}
 */
export const SwitchSizes = {
  TINY: "tiny",
  SMALL: "small",
  LARGE: "large",
};

/**
 * Size meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
export const Sizes = {
  ...ButtonSizes,
  ...ButtonGroupSizes,
  ...CalloutSizes,
  ...RevealSizes,
  ...SwitchSizes,
};

/**
 * Horizontal alignment enumerable.
 *
 * @type {{CENTER: string, RIGHT: string, JUSTIFY: string, SPACED: string}}
 */
export const HorizontalAlignments = {
  CENTER: "center",
  RIGHT: "right",
  JUSTIFY: "justify",
  SPACED: "spaced",
};

/**
 * Vertical alignment enumerable.
 *
 * @type {{TOP: string, MIDDLE: string, BOTTOM: string, STRETCH: string}}
 */
export const VerticalAlignments = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
  STRETCH: "stretch",
};

/**
 * Menu alignment enumerable.
 *
 * @type {{RIGHT: string, CENTER: string}}
 */
export const MenuAlignments = {
  RIGHT: "right",
  CENTER: "center",
};

/**
 * Alignments meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
export const Alignments = {
  ...HorizontalAlignments,
  ...VerticalAlignments,
  ...MenuAlignments,
};

/**
 * Float types enumerable.
 *
 * @type {{LEFT: string, CENTER: string, RIGHT: string}}
 */
export const FloatTypes = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

/**
 * Switch type enumerable.
 *
 * @type {{CHECKBOX: string, RADIO: string}}
 */
export const SwitchInputTypes = {
  CHECKBOX: "checkbox",
  RADIO: "radio",
};

/**
 * Input type meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
export const InputTypes = { ...SwitchInputTypes };
