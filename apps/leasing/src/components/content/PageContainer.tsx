import React, { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";

type Props = {
  children?: React.ReactNode;
  className?: string;
  hasTabs?: boolean;
};

const PageContainer: React.FC<Props> = ({ children, className, hasTabs }) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handleResize = useCallback(() => {
    const pageNavigation = document.getElementsByClassName(
      "content__page-navigator-wrapper",
    );

    if (pageNavigation.length && componentRef.current) {
      const { height } = pageNavigation[0].getClientRects()[0];
      componentRef.current.style.marginTop = height + "px";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div
      ref={componentRef}
      className={classNames("content__page-container", className)}
      style={{
        paddingTop: hasTabs ? 0 : null,
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
