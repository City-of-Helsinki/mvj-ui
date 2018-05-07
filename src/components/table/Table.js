// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import kebabCase from 'lodash/kebabCase';

type Props = {
  className?: string,
  data: Array<any>,
  dataKeys: Array<any>,
  displayHeaders: boolean,
  noDataText?: string,
  onRowClick?: Function,
};

class Table extends Component<Props> {
  static defaultProps = {
    displayHeaders: true,
  };

  render() {
    const {className,
      data,
      dataKeys,
      displayHeaders,
      noDataText,
      onRowClick} = this.props;

    return (
      <table className={classnames(className, 'table', {'clickable-row': !!onRowClick})}>
        {displayHeaders &&
        <thead>
          <tr>
            {dataKeys.map(({key, label}, i) => <th key={i} className={classnames(kebabCase(key))}>{label}</th>)}
          </tr>
        </thead>
        }
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row.id)}>
              {dataKeys.map(({key, renderer}, cellIndex) => (
                <td key={cellIndex}>
                  {renderer ?
                    isArray(key) ? key.map(item => renderer(get(row, item))) : renderer(get(row, key)) :
                    isArray(key) ? key.map(item => `${get(row, item)} `) : get(row, key, '-') || ' - '
                  }
                </td>
              ))}
            </tr>
          ))}
          {!data || !data.length &&
            <tr className='no-data'><td colSpan={dataKeys.length}>{noDataText ? noDataText : 'Ei tuloksia'}</td></tr>
          }
        </tbody>
      </table>
    );
  }
}

export default Table;
