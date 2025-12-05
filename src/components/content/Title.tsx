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

const Title: React.FC<Props> = ({
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
    <h2
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classNames("content__title", {
        "show-add-button": isHovered,
      })}
      style={style}
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
    </h2>
  );
};

export default Title;
