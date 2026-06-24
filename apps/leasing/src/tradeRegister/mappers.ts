import get from "lodash/get";

const BUSINESS_ID_REGEX = /^\d{7}-\d$/;

const ENTRY_TYPES = {
  BUSINESS_LINE: ["TAL"],
  DOMICILE: ["KOTI", "KOTIM"],
  SHARE_CAPITAL: ["OPO"],
  SHARE_COUNT: ["OSLUKU"],
  NOMINAL_VALUE: ["NIMAR"],
  REGISTERED_NAME: ["TMI"],
  PARALLEL_NAME: ["TMIR"],
  AUXILIARY_NAME: ["TMIA"],
  AUXILIARY_LINE_OF_BUSINESS: ["TALA"],
  DISSOLUTION_OR_TERMINATION: ["OIKP"],
  LEGAL_REPRESENTATION: ["NIML", "NIMA", "SELA"],
  NOTICE_FALLBACK: ["SELAS"],
} as const;

type CodeValue = {
  code?: string | null;
};

type ValueWithCode = string | CodeValue | null | undefined;

type Address = {
  coAddress?: string | null;
  streetName?: string | null;
  houseNumber?: string | null;
  postcode?: ValueWithCode;
  city?: string | null;
  countryCode?: ValueWithCode;
};

type ContactDetails = {
  internetAddress?: string | null;
  emailAddress?: string | null;
  telephoneNumber?: string | null;
  mobilePhoneNumber?: string | null;
  faxNumber?: string | null;
  companyAddress?: {
    postalAddress?: Address;
    streetAddress?: Address;
  };
};

type CompanyDetails = {
  businessId?: string | null;
  tradeRegisterNumber?: string | null;
  registerTime?: string | null;
  name?: string | null;
  companyFormCode?: ValueWithCode;
  companyStatusCode?: ValueWithCode;
};

type CompanyNameHistoryItem = {
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

type FinancialStatement = {
  accountingPeriodEndDate?: string | null;
};

type PersonLike = {
  identification?: string | null;
  name?: string | null;
  rolecode?: ValueWithCode;
  dateOfBirth?: string | null;
  representingWayCode?: ValueWithCode;
  groupnumber?: number | null;
};

type JuridicPerson = {
  businessId?: string | null;
  name?: string | null;
  registerCode?: ValueWithCode;
};

type RegistryEntry = {
  "@type"?: string;
  startTime?: string | null;
  endTime?: string | null;
  companyName?: string | null;
  businessLine?: string | null;
  dissolutionDate?: string | null;
  municipalCode?: ValueWithCode;
  amount?: number | string | null;
  count?: number | string | null;
  nominalValue?: number | string | null;
  convertedRegistryEntryText?: string | null;
  registerEntryText?: string | null;
  representingWayCode?: ValueWithCode;
  companyStatus?: string | null;
  matterTypeCode?: ValueWithCode;
  notificationTypeCode?: ValueWithCode;
  personList?: PersonLike[];
  identificationNameList?: PersonLike[];
  groupedPersonList?: PersonLike[];
};

type StructuredExtractQueryResult = {
  companyDetails?: CompanyDetails;
  contactDetails?: ContactDetails;
  companyNameHistoryList?: CompanyNameHistoryItem[];
  financialStatementList?: FinancialStatement[];
  registryEntryList?: RegistryEntry[];
  juridicPersonList?: JuridicPerson[];
};

type NotificationItem = {
  notificationType?: ValueWithCode;
  notificationRecordNumber?: string | null;
  notificationArrivalTimestamp?: string | null;
  notificationClosingTimestamp?: string | null;
  notificationState?: ValueWithCode;
  publicNotificationLastPhase?: ValueWithCode;
};

type NotificationsQueryResult = {
  pendingNotifications?: NotificationItem[];
  handledNotifications?: NotificationItem[];
};

const getCode = (value: CodeValue | null | undefined): string | null =>
  get(value, "code", null);

const splitName = (name: string | null | undefined) => {
  if (!name) {
    return { firstname: null, surname: null };
  }

  const parts = name.trim().split(/\s+/);
  if (!parts.length) {
    return { firstname: null, surname: null };
  }

  return {
    firstname: parts[0] || null,
    surname: parts.slice(1).join(" ") || null,
  };
};

const normalizeBirthDate = (
  identification: string | null | undefined,
): string | null => {
  if (!identification) return null;

  // Most examples in the schema use dd.mm.yyyy for date-of-birth style values.
  const dotDateMatch = identification.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotDateMatch) {
    const [, day, month, year] = dotDateMatch;
    return `${year}-${month}-${day}`;
  }

  return null;
};

const toCodeOrValue = (value: ValueWithCode): string | null => {
  if (typeof value === "string") return value;
  return getCode(value);
};

const getEntriesByType = (
  queryResult: StructuredExtractQueryResult,
  types: readonly string[],
): RegistryEntry[] => {
  const entries = queryResult.registryEntryList || [];
  return entries.filter((entry) => types.includes(entry["@type"] || ""));
};

const getLatestByDate = <T extends object>(
  items: T[] | null | undefined,
  dateField: string,
): T | null => {
  if (!items || !items.length) return null;

  return items.slice().sort((a, b) => {
    const aValue = get(a, dateField, 0) as string | number | Date;
    const bValue = get(b, dateField, 0) as string | number | Date;
    const aTime = new Date(aValue).getTime();
    const bTime = new Date(bValue).getTime();
    return bTime - aTime;
  })[0];
};

const getLatestEntry = (
  queryResult: StructuredExtractQueryResult,
  types: readonly string[],
): RegistryEntry | null => {
  const entries = getEntriesByType(queryResult, types);
  return getLatestByDate(entries, "startTime");
};

const mapNameHistory = (item: CompanyNameHistoryItem) => ({
  name: item.name || null,
  registrationDate: item.startDate || null,
  expirationDate: item.endDate || null,
});

const mapAddress = (address: Address | null | undefined) => ({
  co: address?.coAddress || null,
  streetAddress:
    [address?.streetName, address?.houseNumber].filter(Boolean).join(" ") ||
    null,
  zipCode: toCodeOrValue(address?.postcode) || null,
  city: address?.city || null,
  country: toCodeOrValue(address?.countryCode) || null,
});

const mapCompanyNameSection = (
  companyDetails: CompanyDetails,
  latestBusinessLine: RegistryEntry | null,
  latestNameHistory: CompanyNameHistoryItem | null,
  parallelCompanyNames: RegistryEntry[],
  nameHistory: CompanyNameHistoryItem[],
) => ({
  name: companyDetails.name || null,
  lineOfBusiness: {
    value: latestBusinessLine?.businessLine || null,
  },
  registrationDate: companyDetails.registerTime || null,
  expirationDate: latestNameHistory?.endDate || null,
  parallelCompanyName: parallelCompanyNames.map((entry) => ({
    name: entry.companyName || null,
    lineOfBusiness: null,
    expirationDate: entry.endTime || null,
    registrationDate: entry.startTime || null,
  })),
  historicalNames: nameHistory.map(mapNameHistory),
});

const mapAuxiliaryCompanyNamesSection = (
  auxiliaryCompanyName: RegistryEntry | null,
  auxiliaryCompanyLineOfBusiness: RegistryEntry | null,
) => {
  if (!auxiliaryCompanyName?.companyName) {
    return [];
  }

  return [
    {
      name: auxiliaryCompanyName.companyName || null,
      lineOfBusiness: auxiliaryCompanyLineOfBusiness?.businessLine || null,
      expirationDate: auxiliaryCompanyName.endTime || null,
      registrationDate: auxiliaryCompanyName.startTime || null,
    },
  ];
};

const mapContactInformationSection = (contactDetails: ContactDetails) => ({
  homepage: contactDetails.internetAddress || null,
  email: contactDetails.emailAddress || null,
  phone: {
    number: [
      contactDetails.telephoneNumber,
      contactDetails.mobilePhoneNumber,
    ].filter(Boolean),
  },
  fax: {
    number: [contactDetails.faxNumber].filter(Boolean),
  },
  postal: mapAddress(contactDetails.companyAddress?.postalAddress),
  visitation: mapAddress(contactDetails.companyAddress?.streetAddress),
});

const mapDomicileSection = (latestDomicile: RegistryEntry | null) => ({
  code: toCodeOrValue(latestDomicile?.municipalCode) || null,
  registrationDate: latestDomicile?.startTime || null,
  expirationDate: latestDomicile?.endTime || null,
});

const mapFormSection = (
  companyDetails: CompanyDetails,
  latestBusinessLine: RegistryEntry | null,
) => ({
  type: toCodeOrValue(companyDetails.companyFormCode) || null,
  registrationDate: latestBusinessLine?.startTime || null,
  expirationDate: latestBusinessLine?.endTime || null,
});

const mapShareCapitalSection = (
  latestShareCount: RegistryEntry | null,
  latestShareCapital: RegistryEntry | null,
  latestNominalValue: RegistryEntry | null,
) => ({
  amountOfShares: latestShareCount?.count || null,
  currency: null,
  value: latestShareCapital?.amount || null,
  paidValue: null,
  nominalValue: latestNominalValue?.nominalValue || null,
  registrationDate: latestShareCapital?.startTime || null,
  expirationDate: latestShareCapital?.endTime || null,
});

const mapStateSection = (
  companyDetails: CompanyDetails,
  registeredInfoName: RegistryEntry | null,
) => ({
  type: toCodeOrValue(companyDetails.companyStatusCode) || null,
  registrationDate: registeredInfoName?.startTime || null,
  expirationDate: registeredInfoName?.endTime || null,
});

const isJuristicPerson = (
  person: PersonLike,
  juridicPeople: JuridicPerson[],
) => {
  const identification = person.identification || "";
  return (
    BUSINESS_ID_REGEX.test(identification) ||
    juridicPeople.some(
      (juridic) =>
        juridic.businessId === identification || juridic.name === person.name,
    )
  );
};

const getEntryPersons = (entry: RegistryEntry): PersonLike[] => [
  ...(entry.personList || []),
  ...(entry.identificationNameList || []),
];

const groupByGroupNumber = (groupedPersons: PersonLike[]) =>
  groupedPersons.reduce<Record<string, PersonLike[]>>((acc, item) => {
    const key = String(item.groupnumber || 1);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

const mapRyytiPersonToNatural = (
  person: PersonLike,
  roleOverride: string | null = null,
) => {
  const name = person.name;
  const { firstname, surname } = splitName(name);

  return {
    role: roleOverride || toCodeOrValue(person.rolecode) || null,
    firstname,
    surname,
    dateOfBirth:
      normalizeBirthDate(person.identification) || person.dateOfBirth || null,
  };
};

const mapRyytiPersonToJuristic = (
  person: PersonLike,
  juridicPeople: JuridicPerson[],
  roleOverride: string | null = null,
) => {
  const identification = person.identification || "";
  const name = person.name || null;

  const matchByBusinessId = juridicPeople.find(
    (item) => item.businessId === identification,
  );
  const matchByName = juridicPeople.find((item) => item.name === name);
  const match = matchByBusinessId || matchByName;

  return {
    role: roleOverride || toCodeOrValue(person.rolecode) || null,
    name: name || match?.name || null,
    businessId:
      match?.businessId ||
      (BUSINESS_ID_REGEX.test(identification) ? identification : null),
    register: toCodeOrValue(match?.registerCode) || null,
    registrationNumber: null,
  };
};

const mapBodyEntry = (
  entry: RegistryEntry,
  juridicPeople: JuridicPerson[],
) => ({
  type: entry["@type"] || "-",
  _value_1: getEntryPersons(entry).map((person) => {
    if (isJuristicPerson(person, juridicPeople)) {
      return {
        juristicPerson: mapRyytiPersonToJuristic(person, juridicPeople),
      };
    }

    return {
      naturalPerson: mapRyytiPersonToNatural(person),
    };
  }),
});

const mapGroupedPersons = (
  items: PersonLike[],
  juridicPeople: JuridicPerson[],
) => {
  const naturalPerson: Array<Record<string, unknown>> = [];
  const juristicPerson: Array<Record<string, unknown>> = [];

  items.forEach((item) => {
    const identification = item.identification || "";
    const role = toCodeOrValue(item.representingWayCode);
    const personWithRole: PersonLike = {
      ...item,
      rolecode: role ? { code: role } : null,
    };

    if (BUSINESS_ID_REGEX.test(identification)) {
      juristicPerson.push(
        mapRyytiPersonToJuristic(personWithRole, juridicPeople, role),
      );
      return;
    }

    naturalPerson.push(mapRyytiPersonToNatural(personWithRole, role));
  });

  return {
    naturalPerson,
    juristicPerson,
  };
};

const mapRepresentationEntry = (
  entry: RegistryEntry,
  juridicPeople: JuridicPerson[],
) => {
  const groupedPersons = entry.groupedPersonList || [];
  const byGroupNumber = groupByGroupNumber(groupedPersons);
  const groupNumbers = Object.keys(byGroupNumber)
    .map((value) => Number(value))
    .sort((a, b) => a - b);

  const primaryGroup = byGroupNumber[String(groupNumbers[0])] || [];
  const additionalGroup = byGroupNumber[String(groupNumbers[1])] || [];
  const mappedPrimary = mapGroupedPersons(primaryGroup, juridicPeople);
  const mappedAdditional = mapGroupedPersons(additionalGroup, juridicPeople);

  return {
    rule:
      toCodeOrValue(primaryGroup[0]?.representingWayCode) ||
      entry.convertedRegistryEntryText ||
      entry.registerEntryText ||
      entry["@type"] ||
      "-",
    group: mappedPrimary,
    additionalGroup:
      mappedAdditional.naturalPerson.length ||
      mappedAdditional.juristicPerson.length
        ? mappedAdditional
        : null,
  };
};

const mapLegalRepresentation = (entries: RegistryEntry[]) =>
  entries
    .filter((entry) =>
      ENTRY_TYPES.LEGAL_REPRESENTATION.includes(
        (entry["@type"] ||
          "") as (typeof ENTRY_TYPES.LEGAL_REPRESENTATION)[number],
      ),
    )
    .map((entry) => ({
      header: entry["@type"] || null,
      text: entry.convertedRegistryEntryText || entry.registerEntryText || null,
      signingCode: toCodeOrValue(entry.representingWayCode) || null,
      registrationDate: entry.startTime || null,
      expireDate: entry.endTime || null,
    }));

export const mapRyytiStructuredExtractToCompanyExtended = (
  queryResult: StructuredExtractQueryResult | null | undefined,
): Record<string, any> | null => {
  if (!queryResult) return null;

  const companyDetails = queryResult.companyDetails || {};
  const contactDetails = queryResult.contactDetails || {};

  const nameHistory = queryResult.companyNameHistoryList || [];
  const latestNameHistory = getLatestByDate(nameHistory, "startDate");

  const latestBusinessLine = getLatestEntry(
    queryResult,
    ENTRY_TYPES.BUSINESS_LINE,
  );
  const latestDomicile = getLatestEntry(queryResult, ENTRY_TYPES.DOMICILE);
  const latestShareCapital = getLatestEntry(
    queryResult,
    ENTRY_TYPES.SHARE_CAPITAL,
  );
  const latestShareCount = getLatestEntry(queryResult, ENTRY_TYPES.SHARE_COUNT);
  const latestNominalValue = getLatestEntry(
    queryResult,
    ENTRY_TYPES.NOMINAL_VALUE,
  );
  const registeredInfoName = getLatestEntry(
    queryResult,
    ENTRY_TYPES.REGISTERED_NAME,
  );
  const parallelCompanyNames = getEntriesByType(
    queryResult,
    ENTRY_TYPES.PARALLEL_NAME,
  );
  const auxiliaryCompanyName = getLatestEntry(
    queryResult,
    ENTRY_TYPES.AUXILIARY_NAME,
  );
  const auxiliaryCompanyLineOfBusiness = getLatestEntry(
    queryResult,
    ENTRY_TYPES.AUXILIARY_LINE_OF_BUSINESS,
  );
  const dissolutionOrTermination = getLatestEntry(
    queryResult,
    ENTRY_TYPES.DISSOLUTION_OR_TERMINATION,
  );

  const financialStatements = queryResult.financialStatementList || [];
  const latestFinancialStatement = getLatestByDate(
    financialStatements,
    "accountingPeriodEndDate",
  );

  return {
    businessId: get(companyDetails, "businessId") || null,
    registrationNumber: get(companyDetails, "tradeRegisterNumber") || null,
    registrationDate: get(companyDetails, "registerTime") || null,
    dissolutionDate: get(dissolutionOrTermination, "dissolutionDate") || null,
    deliveryDateOfLastFinancialStatement:
      get(latestFinancialStatement, "accountingPeriodEndDate") || null,
    companyName: mapCompanyNameSection(
      companyDetails,
      latestBusinessLine,
      latestNameHistory,
      parallelCompanyNames,
      nameHistory,
    ),
    auxiliaryCompanyName: mapAuxiliaryCompanyNamesSection(
      auxiliaryCompanyName,
      auxiliaryCompanyLineOfBusiness,
    ),
    contactInformation: mapContactInformationSection(contactDetails),
    domicile: mapDomicileSection(latestDomicile),
    form: mapFormSection(companyDetails, latestBusinessLine),
    shareCapital: mapShareCapitalSection(
      latestShareCount,
      latestShareCapital,
      latestNominalValue,
    ),
    state: mapStateSection(companyDetails, registeredInfoName),
  };
};

export const mapRyytiStructuredExtractToCompanyRepresent = (
  queryResult: StructuredExtractQueryResult | null | undefined,
): Record<string, any> | null => {
  if (!queryResult) return null;

  const entries = queryResult.registryEntryList || [];
  const juridicPeople = queryResult.juridicPersonList || [];

  const body = entries
    .filter(
      (entry) =>
        Array.isArray(entry.personList) ||
        Array.isArray(entry.identificationNameList),
    )
    .map((entry) => mapBodyEntry(entry, juridicPeople));

  const representation = entries
    .filter((entry) => Array.isArray(entry.groupedPersonList))
    .map((entry) => mapRepresentationEntry(entry, juridicPeople));

  const legalRepresentation = mapLegalRepresentation(entries);

  return {
    body,
    representation,
    legalRepresentation,
  };
};

export const mapRyytiNotificationsToCompanyNotice = (
  queryResult: NotificationsQueryResult | null | undefined,
): Record<string, any> => {
  if (!queryResult) {
    return {
      notice: [],
    };
  }

  const pending = queryResult.pendingNotifications || [];
  const handled = queryResult.handledNotifications || [];

  const mapItem = (item: NotificationItem) => ({
    type: toCodeOrValue(item.notificationType) || null,
    recordNumber: item.notificationRecordNumber || null,
    arrivalDate: item.notificationArrivalTimestamp || null,
    latestPhaseArrivalDate:
      item.notificationClosingTimestamp ||
      item.notificationArrivalTimestamp ||
      null,
    latestPhaseName:
      toCodeOrValue(item.notificationState) ||
      toCodeOrValue(item.publicNotificationLastPhase) ||
      null,
  });

  const notices = [...pending, ...handled]
    .map(mapItem)
    .sort(
      (a, b) =>
        new Date(b.arrivalDate || 0).getTime() -
        new Date(a.arrivalDate || 0).getTime(),
    );

  return {
    notice: notices,
  };
};

export const mapRyytiStructuredExtractToCompanyNoticeFallback = (
  queryResult: StructuredExtractQueryResult | null | undefined,
): Record<string, any> => {
  if (!queryResult) {
    return {
      notice: [],
    };
  }

  const entries = getEntriesByType(queryResult, ENTRY_TYPES.NOTICE_FALLBACK);

  const notices = entries.map((item) => ({
    type: toCodeOrValue(item.notificationTypeCode) || null,
    recordNumber: null,
    arrivalDate: item.startTime || null,
    latestPhaseArrivalDate: item.endTime || item.startTime || null,
    latestPhaseName:
      item.companyStatus || toCodeOrValue(item.matterTypeCode) || null,
  }));

  return {
    notice: notices,
  };
};
