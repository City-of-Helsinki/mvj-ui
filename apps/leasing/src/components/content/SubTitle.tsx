import React, { useCallback, useState } from "react";
import classNames from "classnames";
import UIDataTooltip from "@/components/tooltip/UIDataTooltip";

type Props = {
  children?: React.ReactNode;
  enableUiDataEdit?: boolean;
  relativeTo?: any;
  style?: React.CSSProperties;
  uiDataKey?: string | null | undefined;
};

const SubTitle: React.FC<Props> = ({
  children,
  enableUiDataEdit = false,
  relativeTo,
  style,
  uiDataKey,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleTooltipClose = useCallback(() => {
    setIsHovered(false);
  }, []);

  const shouldShowTooltip = !!uiDataKey || enableUiDataEdit;

  return (
    <span
      className={classNames("content__sub-title", {
        "show-add-button": isHovered && shouldShowTooltip,
      })}
      style={style}
      onMouseEnter={shouldShowTooltip ? handleMouseEnter : undefined}
      onMouseLeave={shouldShowTooltip ? handleMouseLeave : undefined}
    >
      <span>{children}</span>
      {shouldShowTooltip && (
        <UIDataTooltip
          enableUiDataEdit={enableUiDataEdit}
          onTooltipClose={handleTooltipClose}
          relativeTo={relativeTo}
          uiDataKey={uiDataKey}
        />
      )}
    </span>
  );
};

export default SubTitle;
