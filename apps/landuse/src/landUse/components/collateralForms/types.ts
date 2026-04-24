import type { LandUseGuaranteeType } from "../../options";

/**
 * Union of all possible fields across collateral types.
 * Which fields apply depends on `tyyppi`.
 */
export interface Guarantee {
  // TODO for the actual data model, include mandatory fields from automatically available data,
  // such as party details, and contract number.
  tyyppi?: LandUseGuaranteeType;
  vakuusasiakirjanLaji?: string;
  kiinteistoVaiLaitos?: string;
  kiinteistotunnukset?: string[];
  laitostunnus?: string;
  vierasvelkapanttaus?: string;
  antajanNimi?: string;
  antajanYTunnus?: string;
  antajanHenkilotunnus?: string;
  panttikirjanNumero?: string;
  panttikirjanPaivays?: string;
  takausnumero?: string;
  tilinumero?: string;
  alkupvm?: string;
  loppupvm?: string;
  maara?: string;
  maksettuPvm?: string;
  palautettuPvm?: string;
  lisatiedot?: string;
}

export interface CollateralFormProps {
  namePrefix: string;
  isEditMode: boolean;
}
