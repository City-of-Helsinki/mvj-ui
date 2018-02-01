// @flow
import React from 'react';

type Props = {
  body: any,
  headers: Array<string>,
}

const TableFixedHeader = ({body, headers}: Props) => {
  return (
    <div className="table-fixed-header">
      <div className="table-fixed-header__container">
        <div className="table-fixed-header__header-border" />
        <table>
          <thead>
            {headers && headers.length > 0 &&
              <tr>
                {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
              </tr>
            }
          </thead>
          {body}
        </table>
      </div>
    </div>
  );
};

export default TableFixedHeader;
