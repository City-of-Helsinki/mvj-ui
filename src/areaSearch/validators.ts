export const nonEmptyGeometry: (arg0: any) => string | null | undefined = value => {
  if (!value?.coordinates || value.coordinates.length === 0) {
    return 'Pakollinen kenttä';
  }
};