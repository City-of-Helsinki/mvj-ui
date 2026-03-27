import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const EditIcon = ({ className }: Props) => (
  <svg
    className={classNames("icons", className)}
    focusable="false"
    viewBox="0 0 30 30"
  >
    <title>Muokkaa</title>
    <path
      stroke="none"
      d="M1.54,6H16.37L14.12,8.25H3.79v18h18V15.91L24,13.66V28.5H1.54ZM25.16,1.5a3.18,3.18,0,0,1,2.36,1,3.34,3.34,0,0,1,.94,2.4,3.4,3.4,0,0,1-.91,2.39L16.44,18.38l-.28.28h-.35l-3.94.84-1.62.28.29-1.62.84-3.93v-.35l.28-.29L22.77,2.48A3.28,3.28,0,0,1,25.16,1.5Zm0,2.25a1.08,1.08,0,0,0-.77.35L13.49,15l-.42,2,2-.42L25.93,5.65a1,1,0,0,0,0-1.55A1.08,1.08,0,0,0,25.16,3.75Z"
    />
  </svg>
);

export default EditIcon;
