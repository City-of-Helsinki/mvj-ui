import React from "react";
type Props = {
  children: any;
  onSubmit: (...args: Array<any>) => any;
};

const SearchContainer = ({
  children,
  onSubmit,
}: Props): JSX.Element => ( // TODO: determine which components actually have an use for onSubmit and consider
  //  making it optional. Several search components seem to provide a function that
  //  they themselves take as props, but then that prop is never defined itself.
  <form onSubmit={onSubmit} className="search__container">
    {children}
  </form>
);

export default SearchContainer;
