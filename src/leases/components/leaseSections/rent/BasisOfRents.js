// @flow
import React from 'react';
import {connect} from 'react-redux';

import SortableTable from '$components/table/SortableTable';
import {getContentBasisOfRents} from '$src/leases/helpers';
import {
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  sortByOptionsAsc,
  sortByOptionsDesc,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const BasisOfRents = ({attributes, currentLease}: Props) => {
  const basisOfRents = getContentBasisOfRents(currentLease);
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'basis_of_rents.child.children.intended_use');

  return (
    <div>
      <SortableTable
        columns={[
          {key: 'intended_use', text: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val) || '-', ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions), descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions)},
          {key: 'floor_m2', text: 'Pinta-ala', renderer: (val) => val ? `${formatNumber(val)} k-m²` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'index', text: 'Indeksi', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'amount_per_floor_m2_index_100', text: 'Yksikköhinta (ind 100)', renderer: (val) => val ? `${formatNumber(val)} €/k-m²` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'amount_per_floor_m2_index', text: 'Yksikköhinta (ind)', renderer: (val) => val ? `${formatNumber(val)} €/k-m²` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'percent', text: 'Prosenttia', renderer: (val) => val ? `${formatNumber(val)} %` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'year_rent_index_100', text: 'Perusvuosivuokra (ind 100)', renderer: (val) => val ? `${formatNumber(val)} €/v` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'year_rent_index', text: 'Alkuvuosivuokra (ind)', renderer: (val) => val ? `${formatNumber(val)} €/v` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        ]}
        data={basisOfRents}
        fixedHeader={true}
        noDataText='Ei vuokranperusteita'
        sortable={true}
      />
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(BasisOfRents);
