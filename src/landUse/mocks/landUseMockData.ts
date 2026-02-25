export interface MockLandUseData {
  id: number;
  identifier: string;
  maankayttosopimusType: string;
  edistamisalue: string;
  tila: string;
  kohteet: Array<{
    kohteenTunnus: string;
    kayttotarkoitus: string;
    hallintamuoto: string;
    suojeltu: string;
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
  site: string;
  projectArea: string;
  negotiationPhase: string;
}

export const landUseCompensationSelectOptions = {
  kayttotarkoitus: [
    "Asuinkerrostalojen korttelialue",
    "Asuinkerrostalojen, liike- ja toimistorakennusten korttelialue",
    "Toimitilat",
  ],
  hallintamuoto: ["Vapaarahoitteinen omistus", "ARA-Vuokra", "ASO"],
  suojeltu: ["-", "SR1", "SR2"],
};

export const mockLandUseStore: Record<string, MockLandUseData> = {
  "MA113-1": {
    id: 1,
    identifier: "MA113-1",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Kalasatama",
    tila: "Vireillä",
    kohteet: [
      {
        kohteenTunnus: "01-49-920-6",
        kayttotarkoitus: "Asuinkerrostalojen korttelialue",
        hallintamuoto: "Vapaarahoitteinen omistus",
        suojeltu: "SR1",
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
    site: "Kalasatama",
    projectArea: "Kalasatama",
    negotiationPhase: "Vireillä",
  },
  "MA112-1": {
    id: 2,
    identifier: "MA112-1",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Jätkäsaari",
    tila: "Neuvotteilla",
    kohteet: [
      {
        kohteenTunnus: "02-18-450-3",
        kayttotarkoitus:
          "Asuinkerrostalojen, liike- ja toimistorakennusten korttelialue",
        hallintamuoto: "ARA-Vuokra",
        suojeltu: "-",
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
    site: "Jätkäsaari",
    projectArea: "Jätkäsaari",
    negotiationPhase: "Neuvotteilla",
  },
  "MA101-1": {
    id: 3,
    identifier: "MA101-1",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Östersundom",
    tila: "Päätös",
    kohteet: [
      {
        kohteenTunnus: "03-27-780-1",
        kayttotarkoitus: "Asuinkerrostalojen korttelialue",
        hallintamuoto: "ASO",
        suojeltu: "SR2",
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
    site: "Östersundom",
    projectArea: "Östersundom",
    negotiationPhase: "Päätös",
  },
  "MA104-2": {
    id: 4,
    identifier: "MA104-2",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Pasila",
    tila: "Vireillä",
    kohteet: [
      {
        kohteenTunnus: "",
        kayttotarkoitus: "Toimitilat",
        hallintamuoto: "Vapaarahoitteinen omistus",
        suojeltu: "-",
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
    site: "Pasila",
    projectArea: "Keski-Pasila",
    negotiationPhase: "Vireillä",
  },
  "MA098-5": {
    id: 5,
    identifier: "MA098-5",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Kruunuvuorenranta",
    tila: "Neuvotteilla",
    kohteet: [
      {
        kohteenTunnus: "",
        kayttotarkoitus: "Asuinkerrostalojen korttelialue",
        hallintamuoto: "ARA-Vuokra",
        suojeltu: "SR1",
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
    site: "Kruunuvuorenranta",
    projectArea: "Kruunuvuorenranta",
    negotiationPhase: "Neuvotteilla",
  },
  "MA089-3": {
    id: 6,
    identifier: "MA089-3",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Kuninkaantammi",
    tila: "Päätös",
    kohteet: [
      {
        kohteenTunnus: "",
        kayttotarkoitus: "Asuinkerrostalojen korttelialue",
        hallintamuoto: "ASO",
        suojeltu: "-",
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
    site: "Kuninkaantammi",
    projectArea: "Kuninkaantammi",
    negotiationPhase: "Päätös",
  },
  "MA077-1": {
    id: 7,
    identifier: "MA077-1",
    maankayttosopimusType: "Maankäyttösopimus",
    edistamisalue: "Honkasuo",
    tila: "Neuvotteilla",
    kohteet: [
      {
        kohteenTunnus: "",
        kayttotarkoitus: "Asuinkerrostalojen korttelialue",
        hallintamuoto: "Vapaarahoitteinen omistus",
        suojeltu: "SR2",
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
    site: "Honkasuo",
    projectArea: "Honkasuo",
    negotiationPhase: "Neuvotteilla",
  },
};

export const mockLandUseList = Object.values(mockLandUseStore).map((item) => ({
  id: item.id,
  identifier: item.identifier,
  party: item.party,
  zoningPlanNumber: item.zoningPlanNumber,
  site: item.edistamisalue,
  projectArea: item.projectArea,
  negotiationPhase: item.tila,
}));
