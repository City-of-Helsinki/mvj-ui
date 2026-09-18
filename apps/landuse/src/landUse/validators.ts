export const validatePykala = (value?: string): string | undefined => {
  if (value && !/^\d+$/.test(value)) {
    return "Pykälän tulee sisältää vain numeroita ilman §-merkkiä";
  }
  return undefined;
};
