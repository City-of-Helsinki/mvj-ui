// @flow
import React from 'react';
import classNames from 'classnames';

import {NextIcon} from './Icons';

type PaginationPreviousProps = {
  ariaLabel: string,
  disabled?: boolean,
  onClick: Function,
  page: number,
}

const PaginationPrevious = ({
  ariaLabel,
  disabled = false,
  onClick,
  page,
}: PaginationPreviousProps) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(page);
  };

  return (
    <li className={classNames('pagination__item pagination__previous', {'disabled': disabled})}>
      <a aria-label={ariaLabel} href={disabled ? null : ''} onClick={handleClick}><div><NextIcon /></div></a>
    </li>
  );
};

type PaginationNextProps = {
  ariaLabel: string,
  disabled?: boolean,
  onClick: Function,
  page: number,
}

const PaginationNext = ({
  ariaLabel,
  disabled = false,
  onClick,
  page,
}: PaginationNextProps) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(page);
  };

  return (
    <li className={classNames('pagination__item pagination__next', {'disabled': disabled})}>
      <a aria-label={ariaLabel} href={disabled ? null : ''} onClick={handleClick}><div><NextIcon /></div></a>
    </li>
  );
};

const PaginationEllipsis = () =>
  <li className='pagination__item disabled'>
    <a>...</a>
  </li>;

type PaginationItemProps = {
  active?: boolean,
  ariaLabel: string,
  className?: string,
  disabled?: boolean,
  onClick: Function,
  page: number,
}

const PaginationItem = ({
  active = false,
  ariaLabel,
  disabled = false,
  onClick,
  page,
}: PaginationItemProps) => {
  const handlePageClick = (e) => {
    e.preventDefault();
    onClick(page);
  };

  return (
    <li className={classNames('pagination__item', {'active': active}, {'disabled': disabled})}>
      <a aria-label={ariaLabel} href={disabled ? null : ''} onClick={handlePageClick}>{page}</a>
    </li>
  );
};

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
      <PaginationPrevious
        key='previous'
        ariaLabel='Edellinen sivu'
        disabled={activePage === 1}
        onClick={onPageClick}
        page={activePage - 1}
      />
    );
    pages.push(
      <PaginationItem
        key={1}
        active={activePage === 1}
        ariaLabel='Sivu 1'
        disabled={activePage === 1}
        onClick={onPageClick}
        page={1}
      />
    );

    // Add first ...
    if(!(activePage <= (maxShownPages + 1)) && activePage <= maxPage) {
      pages.push(<PaginationEllipsis key='ellipsis_1' />);
    }

    if(activePage > maxPage) {
      console.error('Pagination active page is greater than max page');
    } else if(activePage <= (maxShownPages + 1)) {
      for(let i = 2; i <= (maxShownPages + 1); i++) {
        if(i > maxPage - 1) {
          break;
        }
        pages.push(
          <PaginationItem
            key={i}
            active={activePage === i}
            ariaLabel={`Sivu ${i}`}
            disabled={activePage === i}
            onClick={onPageClick}
            page={i}
          />
        );
      }
    } else if (activePage > maxPage - maxShownPages) {
      for(let i = activePage - 1; i <= maxPage - 1; i++) {
        pages.push(
          <PaginationItem
            key={i}
            active={activePage === i}
            ariaLabel={`Sivu ${i}`}
            disabled={activePage === i}
            onClick={onPageClick}
            page={i}
          />
        );
      }
    } else {
      for(let i = activePage - 1; i <= activePage + 1; i++) {
        pages.push(
          <PaginationItem
            key={i}
            active={activePage === i}
            ariaLabel={`Sivu ${i}`}
            disabled={activePage === i}
            onClick={onPageClick}
            page={i}
          />
        );
      }
    }

    // Add second ...
    if(((activePage + 2 < maxPage) || !((maxPage - activePage) < maxShownPages)) && activePage <= maxPage) {
      pages.push(<PaginationEllipsis key='ellipsis_2' />);
    }

    // Add last page and next button
    pages.push(
      <PaginationItem
        key={maxPage}
        active={activePage === maxPage}
        ariaLabel={`Sivu ${maxPage}`}
        disabled={activePage === maxPage}
        onClick={onPageClick}
        page={maxPage}
      />
    );
    pages.push(
      <PaginationNext
        key='next'
        ariaLabel='Seuraava sivu'
        disabled={activePage === maxPage}
        onClick={onPageClick}
        page={activePage + 1}
      />
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
