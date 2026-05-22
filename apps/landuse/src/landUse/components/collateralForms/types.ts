import type { LandUseGuaranteeType } from "../../options";

/**
 * Union of all possible fields across collateral types.
 * Which fields apply depends on `tyyppi`.
 */
export interface Guarantee {
  tyyppi?: LandUseGuaranteeType;
  osapuolet?: string[];
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
  partyOptions: { label: string; value: string }[];
}
