import React from "react";
import classNames from "classnames";
import QuestionIcon from "src/components/icons/QuestionIcon";
import SuccessIcon from "src/components/icons/SuccessIcon";
import CancelIcon from "src/components/icons/CancelIcon";
import { CreditDecisionStatus, CreditDecisionStatusLabels } from "src/creditDecision/enums";
type Props = {
  status: String;
  className?: String;
};

const StatusText = ({
  status,
  className
}: Props) => {
  const renderStatusIcon = status => {
    let icon = <span />;

    switch (status) {
      case CreditDecisionStatus.NO:
        icon = <CancelIcon className="icon-small credit-decision-cancel-icon" />;
        break;

      case CreditDecisionStatus.YES:
        icon = <SuccessIcon className="icon-small credit-decision-success-icon" />;
        break;

      case CreditDecisionStatus.CONSIDERATION:
        icon = <QuestionIcon className="icon-small credit-decision-consideration-icon" />;
        break;
    }

    ;
    return icon;
  };

  const renderStatusLabel = status => {
    let text = '';

    switch (status) {
      case CreditDecisionStatus.NO:
        text = CreditDecisionStatusLabels.NO;
        break;

      case CreditDecisionStatus.YES:
        text = CreditDecisionStatusLabels.YES;
        break;

      case CreditDecisionStatus.CONSIDERATION:
        text = CreditDecisionStatusLabels.CONSIDERATION;
        break;
    }

    ;
    return text;
  };

  return <span className={classNames('credit-decision-status-text', className)}>
      {renderStatusIcon(status)} <strong>{renderStatusLabel(status)}</strong>
    </span>;
};

export default StatusText;