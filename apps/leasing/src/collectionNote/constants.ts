import type { CollectionStageOption } from "./types";
import { CollectionStageOptions } from "./enums";

/**
 * Collection note stages that utilize sent date field
 */
export const stagesWithSentDate: CollectionStageOption[] = [
  CollectionStageOptions.RISK_OF_DEMOLITION,
  CollectionStageOptions.RISK_OF_DEMOLITION_AND_LITIGATION,
  CollectionStageOptions.RISK_OF_LITIGATION,
  CollectionStageOptions.RISK_OF_TERMINATION_AND_LITIGATION,
  CollectionStageOptions.SIMPLE_PAYMENT_REMINDER,
  CollectionStageOptions.PAYMENT_DEMAND,
  CollectionStageOptions.BANKRUPTCY_OR_REORGANIZATION,
];
