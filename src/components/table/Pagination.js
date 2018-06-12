// @flow
import React from 'react';
import classNames from 'classnames';

import {NextIcon} from './Icons';

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
  if(!maxPage || maxPage === 1) {
    return null;
  }

  const getPages = () => {
    const pages = [];
    const maxShownPages = 4;
    // Add first page and previous button
    pages.push(
      <li key='previous' className={classNames('pagination__page-item', {'disabled': activePage === 1})}>
        <a onClick={() => onPageClick(activePage - 1)}><div className='pagination__previous-icon'><NextIcon /></div></a>
      </li>
    );
    pages.push(
      <li key={1} className={classNames('pagination__page-item', {'active': activePage === 1})}>
        <a onClick={() => onPageClick(1)}>{1}</a>
      </li>
    );

    // Add first ...
    if(!(activePage <= (maxShownPages + 1)) && activePage <= maxPage) {
      pages.push(
        <li key='...1' className={'pagination__page-item disabled'}>
          <a>...</a>
        </li>
      );
    }

    if(activePage > maxPage) {
      console.error('Pagination active page is greater than max page');
    } else if(activePage <= (maxShownPages + 1)) {
      for(let i = 2; i <= (maxShownPages + 1); i++) {
        if(i > maxPage - 1) {
          break;
        }
        pages.push(
          <li key={i} className={classNames('pagination__page-item', {'active': i === activePage})}>
            <a onClick={() => onPageClick(i)}>{i}</a>
          </li>
        );
      }
    } else if (activePage > maxPage - maxShownPages) {
      for(let i = activePage - 1; i <= maxPage - 1; i++) {
        pages.push(
          <li key={i} className={classNames('pagination__page-item', {'active': i === activePage})}>
            <a onClick={() => onPageClick(i)}>{i}</a>
          </li>
        );
      }
    } else {
      for(let i = activePage - 1; i <= activePage + 1; i++) {
        pages.push(
          <li key={i} className={classNames('pagination__page-item', {'active': i === activePage})}>
            <a onClick={() => onPageClick(i)}>{i}</a>
          </li>
        );
      }
    }

    // Add second ...
    if(((activePage + 2 < maxPage) || !((maxPage - activePage) < maxShownPages)) && activePage <= maxPage) {
      pages.push(
        <li key='...2' className={'pagination__page-item disabled'}>
          <a>...</a>
        </li>
      );
    }

    // Add last page and next button
    pages.push(
      <li key={maxPage} className={classNames('pagination__page-item', {'active': activePage === maxPage})}>
        <a onClick={() => onPageClick(maxPage)}>{maxPage}</a>
      </li>
    );
    pages.push(
      <li key='next' className={classNames('pagination__page-item', {'disabled': activePage === maxPage})}>
        <a onClick={() => onPageClick(activePage + 1)}><div className='pagination__next-icon'><NextIcon /></div></a>
      </li>
    );
    return pages;
  };

  return (
    <ul className='pagination'>
      {getPages()}
    </ul>
  );
};

export default Pagination;
