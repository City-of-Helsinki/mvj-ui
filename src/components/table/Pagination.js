// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  activePage: number,
  maxPage: number,
  onPageClick: Function,
}

const Pagination = ({
  activePage,
  maxPage,
  onPageClick,
}: Props) => {
  const getPages = () => {
    const pages = [];
    for(let i = 1; i <= maxPage; i++) {
      pages.push(
        <li key={i} className={classNames('page-item', {'active': i === activePage})}>
          <a className='page-link' onClick={() => onPageClick(i)}>{i}</a>
        </li>
      );
    }
    return pages;
  };
  if(!maxPage || maxPage === 1) {
    return null;
  }

  return (
    <ul className='pagination'>
      {getPages()}
    </ul>
  );
};

export default Pagination;
