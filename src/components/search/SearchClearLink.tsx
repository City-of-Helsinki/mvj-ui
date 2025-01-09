import React from "react";
type Props = {
  children: any;
  onClick: (...args: Array<any>) => any;
};

const SearchClearLink = ({ children, onClick }: Props) => {
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <a
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className="search__clear-link"
    >
      {children}
    </a>
  );
};

export default SearchClearLink;
