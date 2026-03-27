import React, { useCallback, useState } from "react";
import classNames from "classnames";
import UIDataTooltip from "@/components/tooltip/UIDataTooltip";

type Props = {
  children?: any;
  enableUiDataEdit?: boolean;
  relativeTo?: any;
  style?: Record<string, any>;
  uiDataKey?: string | null | undefined;
};
type State = {
  showAddButton: boolean;
};

const TitleH3: React.FC<Props> = ({
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
    <h3
      onMouseEnter={shouldShowTooltip ? handleMouseEnter : undefined}
      onMouseLeave={shouldShowTooltip ? handleMouseLeave : undefined}
      className={classNames("content__title-h3", {
        "show-add-button": isHovered && shouldShowTooltip,
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
    </h3>
  );
};

export default TitleH3;
