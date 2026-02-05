export interface MockLandUseData {
  id: number;
  identifier: string;
  kohteet: Array<{
    kohteenTunnus: string;
    maankayttosopimusType: string;
    edistamisalue: string;
    tila: string;
  }>;
  osoitteet: Array<{
    katuosoite: string;
    postinumero: string;
    kaupunki: string;
  }>;
  valmistelijat: Array<{
    firstName: string;
    lastName: string;
  }>;
  arvioituEsittelyvuosi: string;
  arvioituMaksuvuosi: string;
  toimivaltainenPaattaja: string;
  sisaltaaAmVelvoitteita: string;
  velvotteidenMaaraAika: string;
  asemakaavanNumero: string;
  asemakaavanKayttotarkoitusyhmä: string;
  kasittelyvaiheenViimeisinPvm: string;
  asemakaavanHyvaksyjä: string;
  asemakaavanDiaarinumero: string;
  party: string;
  zoningPlanNumber: string;
  target: string;
  projectArea: string;
  negotiationPhase: string;
}

export const mockLandUseStore: Record<string, MockLandUseData> = {
  "MA113-1": {
    id: 1,
    identifier: "MA113-1",
    kohteet: [
      {
        kohteenTunnus: "01-49-920-6",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Kalasatama",
        tila: "Vireillä",
      },
    ],
    osoitteet: [
      {
        katuosoite: "Tyynenmerenkatu 10",
        postinumero: "00220",
        kaupunki: "Helsinki",
      },
    ],
    valmistelijat: [
      { firstName: "Matti", lastName: "Meikäläinen" },
      { firstName: "Liisa", lastName: "Virtanen" },
    ],
    arvioituEsittelyvuosi: "2026",
    arvioituMaksuvuosi: "2027",
    toimivaltainenPaattaja: "Kaupunkiympäristölautakunta",
    sisaltaaAmVelvoitteita: "kyllä",
    velvotteidenMaaraAika: "11.2030",
    asemakaavanNumero: "12345",
    asemakaavanKayttotarkoitusyhmä: "Asuminen",
    kasittelyvaiheenViimeisinPvm: "11.2025",
    asemakaavanHyvaksyjä: "Kaupunginvaltuusto",
    asemakaavanDiaarinumero: "HEL 2024-012345",
    party: "Helsingin kaupunki",
    zoningPlanNumber: "12345",
    target: "Kalasatama",
    projectArea: "Kalasatama",
    negotiationPhase: "Vireillä",
  },
  "MA112-1": {
    id: 2,
    identifier: "MA112-1",
    kohteet: [
      {
        kohteenTunnus: "02-18-450-3",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Jätkäsaari",
        tila: "Neuvotteluilla",
      },
    ],
    osoitteet: [
      {
        katuosoite: "Välimerenkatu 5",
        postinumero: "00220",
        kaupunki: "Helsinki",
      },
    ],
    valmistelijat: [
      { firstName: "Pekka", lastName: "Puutarhuri" },
      { firstName: "Anna", lastName: "Arkkitehti" },
    ],
    arvioituEsittelyvuosi: "2025",
    arvioituMaksuvuosi: "2026",
    toimivaltainenPaattaja: "Kaupunginhallitus",
    sisaltaaAmVelvoitteita: "ei",
    velvotteidenMaaraAika: "",
    asemakaavanNumero: "11987",
    asemakaavanKayttotarkoitusyhmä:
      "Liike- ja toimistorakennusten korttelialue",
    kasittelyvaiheenViimeisinPvm: "06.2024",
    asemakaavanHyvaksyjä: "Kaupunginvaltuusto",
    asemakaavanDiaarinumero: "HEL 2023-009876",
    party: "ABC Oy",
    zoningPlanNumber: "11987",
    target: "Jätkäsaari",
    projectArea: "Jätkäsaari",
    negotiationPhase: "Neuvotteilla",
  },
  "MA101-1": {
    id: 3,
    identifier: "MA101-1",
    kohteet: [
      {
        kohteenTunnus: "03-27-780-1",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Östersundom",
        tila: "Päättös",
      },
    ],
    osoitteet: [
      {
        katuosoite: "Kantokatu 7",
        postinumero: "00890",
        kaupunki: "Helsinki",
      },
    ],
    valmistelijat: [{ firstName: "Tuula", lastName: "Tontti" }],
    arvioituEsittelyvuosi: "2024",
    arvioituMaksuvuosi: "2025",
    toimivaltainenPaattaja: "Kaupunkiympäristölautakunta",
    sisaltaaAmVelvoitteita: "kyllä",
    velvotteidenMaaraAika: "12.2028",
    asemakaavanNumero: "13456",
    asemakaavanKayttotarkoitusyhmä: "Pientalojen korttelialue",
    kasittelyvaiheenViimeisinPvm: "03.2024",
    asemakaavanHyvaksyjä: "Kaupunginvaltuusto",
    asemakaavanDiaarinumero: "HEL 2022-015678",
    party: "123 Oy",
    zoningPlanNumber: "13456",
    target: "Östersundom",
    projectArea: "Östersundom",
    negotiationPhase: "Päätös",
  },
  "MA104-2": {
    id: 4,
    identifier: "MA104-2",
    kohteet: [
      {
        kohteenTunnus: "",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Pasila",
        tila: "Vireillä",
      },
    ],
    osoitteet: [],
    valmistelijat: [],
    arvioituEsittelyvuosi: "",
    arvioituMaksuvuosi: "",
    toimivaltainenPaattaja: "",
    sisaltaaAmVelvoitteita: "",
    velvotteidenMaaraAika: "",
    asemakaavanNumero: "1020",
    asemakaavanKayttotarkoitusyhmä: "",
    kasittelyvaiheenViimeisinPvm: "",
    asemakaavanHyvaksyjä: "",
    asemakaavanDiaarinumero: "",
    party: "Rakennusliike 1 Oy",
    zoningPlanNumber: "1020",
    target: "Pasila",
    projectArea: "Keski-Pasila",
    negotiationPhase: "Vireillä",
  },
  "MA098-5": {
    id: 5,
    identifier: "MA098-5",
    kohteet: [
      {
        kohteenTunnus: "",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Kruunuvuorenranta",
        tila: "Neuvotteluilla",
      },
    ],
    osoitteet: [],
    valmistelijat: [],
    arvioituEsittelyvuosi: "",
    arvioituMaksuvuosi: "",
    toimivaltainenPaattaja: "",
    sisaltaaAmVelvoitteita: "",
    velvotteidenMaaraAika: "",
    asemakaavanNumero: "10567",
    asemakaavanKayttotarkoitusyhmä: "",
    kasittelyvaiheenViimeisinPvm: "",
    asemakaavanHyvaksyjä: "",
    asemakaavanDiaarinumero: "",
    party: "Rakennusyhtymä X",
    zoningPlanNumber: "10567",
    target: "Kruunuvuorenranta",
    projectArea: "Kruunuvuorenranta",
    negotiationPhase: "Neuvotteilla",
  },
  "MA089-3": {
    id: 6,
    identifier: "MA089-3",
    kohteet: [
      {
        kohteenTunnus: "",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Kuninkaantammi",
        tila: "Päätös",
      },
    ],
    osoitteet: [],
    valmistelijat: [],
    arvioituEsittelyvuosi: "",
    arvioituMaksuvuosi: "",
    toimivaltainenPaattaja: "",
    sisaltaaAmVelvoitteita: "",
    velvotteidenMaaraAika: "",
    asemakaavanNumero: "9876",
    asemakaavanKayttotarkoitusyhmä: "",
    kasittelyvaiheenViimeisinPvm: "",
    asemakaavanHyvaksyjä: "",
    asemakaavanDiaarinumero: "",
    party: "Suomi Oy Ab",
    zoningPlanNumber: "9876",
    target: "Kuninkaantammi",
    projectArea: "Kuninkaantammi",
    negotiationPhase: "Päätös",
  },
  "MA077-1": {
    id: 7,
    identifier: "MA077-1",
    kohteet: [
      {
        kohteenTunnus: "",
        maankayttosopimusType: "Maankäyttösopimus",
        edistamisalue: "Honkasuo",
        tila: "Neuvotteluilla",
      },
    ],
    osoitteet: [],
    valmistelijat: [],
    arvioituEsittelyvuosi: "",
    arvioituMaksuvuosi: "",
    toimivaltainenPaattaja: "",
    sisaltaaAmVelvoitteita: "",
    velvotteidenMaaraAika: "",
    asemakaavanNumero: "8765",
    asemakaavanKayttotarkoitusyhmä: "",
    kasittelyvaiheenViimeisinPvm: "",
    asemakaavanHyvaksyjä: "",
    asemakaavanDiaarinumero: "",
    party: "Hotel Kilo India Oy",
    zoningPlanNumber: "8765",
    target: "Honkasuo",
    projectArea: "Honkasuo",
    negotiationPhase: "Neuvotteilla",
  },
};

export const mockLandUseList = Object.values(mockLandUseStore).map((item) => ({
  id: item.id,
  identifier: item.identifier,
  party: item.party,
  zoningPlanNumber: item.zoningPlanNumber,
  target: item.kohteet[0]?.edistamisalue ?? "",
  projectArea: item.projectArea,
  negotiationPhase: item.kohteet[0]?.tila ?? item.negotiationPhase,
}));
