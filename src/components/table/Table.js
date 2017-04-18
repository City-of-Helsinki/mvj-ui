// @flow
import React, {Component} from 'react';

type Props = {
  onRowClick: Function,
  data: Array<any>,
  headers: Array<any>,
};

class Table extends Component {
  props: Props;

  static defaultProps = {
    headers: [],
  };

  render() {
    const {data, headers, onRowClick} = this.props;

    return (
      <table>
        {!!headers.length &&
        <thead>
        <tr>
          {headers.map((header, i) => <th key={i}>{header}</th>)}
        </tr>
        </thead>
        }
        <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick(row.id)}>
            {Object.keys(row.data).map((tr, cellIndex) => (
              <td key={cellIndex}>{row.data[tr]} {cellIndex}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
