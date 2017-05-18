// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

type Props = {
  className?: string,
  onRowClick?: Function,
  data: Array<any>,
  dataKeys: Array<any>,
  headers: Array<any>,
};

class Table extends Component {
  props: Props;

  static defaultProps = {
    headers: [],
  };

  render() {
    const {className, data, dataKeys, headers, onRowClick} = this.props;

    return (
      <table className={classnames(className)}>
        {!!headers.length &&
        <thead>
        <tr>
          {headers.map((header, i) => <th key={i} className={classnames(kebabCase(header))}>{header}</th>)}
        </tr>
        </thead>
        }
        <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row.id)}>
            {dataKeys.map((key, cellIndex) => (
              <td key={cellIndex}>{get(row, key)}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
