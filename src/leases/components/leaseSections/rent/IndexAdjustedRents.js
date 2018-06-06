// @flow
import React from 'react';
import {connect} from 'react-redux';

import Table from '$components/table/Table';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  indexAdjustedRents: Array<Object>,
}

const IndexAdjustedRents = ({attributes, indexAdjustedRents}: Props) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.index_adjusted_rents.child.children.intended_use');

  return (
    <Table
      data={indexAdjustedRents}
      dataKeys={[
        {key: 'amount', label: 'Indeksitarkastettu vuokra (€)', renderer: (val) => formatNumber(val)},
        {key: 'intended_use', label: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val)},
        {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDate(val)},
        {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDate(val)},
        {key: 'factor', label: 'Laskentakerroin'},
      ]}
      fixedHeader
      tableFixedLayout
    />
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(IndexAdjustedRents);
