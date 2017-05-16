// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import kebabCase from 'lodash/kebabCase';

type Props = {
  className?: string,
  onRowClick?: Function,
  data: Array<any>,
  headers: Array<any>,
};

class Table extends Component {
  props: Props;

  static defaultProps = {
    headers: [],
  };

  render() {
    const {className, data, headers, onRowClick} = this.props;

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
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick && onRowClick(row.id)}>
            {Object.keys(row.data).map((tr, cellIndex) => (
              <td key={cellIndex}>{row.data[tr]}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
