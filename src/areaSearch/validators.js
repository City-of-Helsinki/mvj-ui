// @flow

export const nonEmptyGeometry: (any) => ?string = (value) => {
  if (!value?.coordinates || value.coordinates.length === 0) {
    return 'Pakollinen kenttä';
  }
};
