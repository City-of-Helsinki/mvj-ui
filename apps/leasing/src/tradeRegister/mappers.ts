import get from "lodash/get";

const BUSINESS_ID_REGEX = /^\d{7}-\d$/;

const getCode = (
  value: Record<string, any> | null | undefined,
): string | null => get(value, "code", null);

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

const toCodeOrValue = (value: any): string | null => {
  if (typeof value === "string") return value;
  return getCode(value);
};

const getEntriesByType = (
  queryResult: Record<string, any>,
  types: string[],
): Array<Record<string, any>> => {
  const entries = get(queryResult, "registryEntryList", []);
  return entries.filter((entry: Record<string, any>) =>
    types.includes(entry?.["@type"]),
  );
};

const getLatestEntry = (
  queryResult: Record<string, any>,
  types: string[],
): Record<string, any> | null => {
  const entries = getEntriesByType(queryResult, types);
  if (!entries.length) return null;

  return entries.slice().sort((a, b) => {
    const aTime = new Date(get(a, "startTime", 0)).getTime();
    const bTime = new Date(get(b, "startTime", 0)).getTime();
    return bTime - aTime;
  })[0];
};

const mapRyytiPersonToNatural = (
  person: Record<string, any>,
  roleOverride: string | null = null,
) => {
  const name = get(person, "name");
  const { firstname, surname } = splitName(name);

  return {
    role: roleOverride || toCodeOrValue(get(person, "rolecode")) || null,
    firstname,
    surname,
    dateOfBirth:
      normalizeBirthDate(get(person, "identification")) ||
      get(person, "dateOfBirth") ||
      null,
  };
};

const mapRyytiPersonToJuristic = (
  person: Record<string, any>,
  juridicPeople: Array<Record<string, any>>,
  roleOverride: string | null = null,
) => {
  const identification = get(person, "identification", "");
  const name = get(person, "name", null);

  const matchByBusinessId = juridicPeople.find(
    (item) => get(item, "businessId") === identification,
  );
  const matchByName = juridicPeople.find((item) => get(item, "name") === name);
  const match = matchByBusinessId || matchByName;

  return {
    role: roleOverride || toCodeOrValue(get(person, "rolecode")) || null,
    name: name || get(match, "name") || null,
    businessId:
      get(match, "businessId") ||
      (BUSINESS_ID_REGEX.test(identification) ? identification : null),
    register: toCodeOrValue(get(match, "registerCode")) || null,
    registrationNumber: null,
  };
};

const mapNameHistory = (item: Record<string, any>) => ({
  name: get(item, "name") || null,
  registrationDate: get(item, "startDate") || null,
  expidationDate: get(item, "endDate") || null,
});

const mapAddress = (address: Record<string, any> | null | undefined) => ({
  co: get(address, "coAddress") || null,
  streetAddress:
    [get(address, "streetName"), get(address, "houseNumber")]
      .filter(Boolean)
      .join(" ") || null,
  zipCode: toCodeOrValue(get(address, "postcode")) || null,
  city: get(address, "city") || null,
  country: toCodeOrValue(get(address, "countryCode")) || null,
});

export const mapRyytiStructuredExtractToCompanyExtended = (
  queryResult: Record<string, any> | null | undefined,
): Record<string, any> | null => {
  if (!queryResult) return null;

  const companyDetails = get(queryResult, "companyDetails", {});
  const contactDetails = get(queryResult, "contactDetails", {});

  const nameHistory = get(queryResult, "companyNameHistoryList", []);
  const latestNameHistory = nameHistory
    .slice()
    .sort(
      (a: Record<string, any>, b: Record<string, any>) =>
        new Date(get(b, "startDate", 0)).getTime() -
        new Date(get(a, "startDate", 0)).getTime(),
    )[0];

  const latestBusinessLine = getLatestEntry(queryResult, ["TAL"]);
  const latestDomicile = getLatestEntry(queryResult, ["KOTI", "KOTIM"]);
  const latestShareCapital = getLatestEntry(queryResult, ["OPO"]);
  const latestShareCount = getLatestEntry(queryResult, ["OSLUKU"]);
  const latestNominalValue = getLatestEntry(queryResult, ["NIMAR"]);
  const registeredInfoName = getLatestEntry(queryResult, ["TMI"]);
  const parallelCompanyNames = getEntriesByType(queryResult, ["TMIR"]);
  const auxiliaryCompanyName = getLatestEntry(queryResult, ["TMIA"]);
  const auxiliaryCompanyLineOfBusiness = getLatestEntry(queryResult, ["TALA"]);
  const dissolutionOrTermination = getLatestEntry(queryResult, ["OIKP"]);

  const latestFinancialStatement = get(
    queryResult,
    "financialStatementList",
    [],
  )
    .slice()
    .sort(
      (a: Record<string, any>, b: Record<string, any>) =>
        new Date(get(b, "accountingPeriodEndDate", 0)).getTime() -
        new Date(get(a, "accountingPeriodEndDate", 0)).getTime(),
    )[0];

  return {
    businessId: get(companyDetails, "businessId") || null,
    registrationNumber: get(companyDetails, "tradeRegisterNumber") || null,
    registrationDate: get(companyDetails, "registerTime") || null,
    dissolutionDate: get(dissolutionOrTermination, "dissolutionDate") || null,
    deliveryDateOfLastFinancialStatement:
      get(latestFinancialStatement, "accountingPeriodEndDate") || null,
    companyName: {
      name: get(companyDetails, "name") || null,
      lineOfBusiness: {
        value: get(latestBusinessLine, "businessLine") || null,
      },
      registrationDate: get(companyDetails, "registerTime") || null,
      expidationDate: get(latestNameHistory, "endDate") || null,
      parallelCompanyName: [
        {
          name: get(parallelCompanyNames, "companyName") || null,
          lineOfBusiness: null,
          expirationDate: null,
          registrationDate: null,
        },
      ],
      historicalNames: nameHistory.map(mapNameHistory),
    },
    auxiliaryCompanyName: [
      {
        name: get(auxiliaryCompanyName, "companyName") || null,
        lineOfBusiness:
          get(auxiliaryCompanyLineOfBusiness, "businessLine") || null,
        expirationDate: null,
        registrationDate: null,
      },
    ],
    contactInformation: {
      homepage: get(contactDetails, "internetAddress") || null,
      email: get(contactDetails, "emailAddress") || null,
      phone: {
        number: [
          get(contactDetails, "telephoneNumber"),
          get(contactDetails, "mobilePhoneNumber"),
        ].filter(Boolean),
      },
      fax: {
        number: [get(contactDetails, "faxNumber")].filter(Boolean),
      },
      postal: mapAddress(get(contactDetails, "companyAddress.postalAddress")),
      visitation: mapAddress(
        get(contactDetails, "companyAddress.streetAddress"),
      ),
    },
    domicile: {
      code: toCodeOrValue(get(latestDomicile, "municipalCode")) || null,
      registrationDate: get(latestDomicile, "startTime") || null,
      expidationDate: get(latestDomicile, "endTime") || null,
    },
    form: {
      type: toCodeOrValue(get(companyDetails, "companyFormCode")) || null,
      registrationDate: get(latestBusinessLine, "startTime") || null,
      expirationDate: get(latestBusinessLine, "endTime") || null,
    },
    shareCapital: {
      amountOfShares: get(latestShareCount, "count") || null,
      currency: null,
      value: get(latestShareCapital, "amount") || null,
      paidValue: null,
      nominalValue: get(latestNominalValue, "nominalValue") || null,
      registrationDate: get(latestShareCapital, "startTime") || null,
      expirationDate: get(latestShareCapital, "endTime") || null,
    },
    state: {
      type: toCodeOrValue(get(companyDetails, "companyStatusCode")) || null,
      registrationDate: get(registeredInfoName, "startTime") || null,
      expirationDate: get(registeredInfoName, "endTime") || null,
    },
  };
};

export const mapRyytiStructuredExtractToCompanyRepresent = (
  queryResult: Record<string, any> | null | undefined,
): Record<string, any> | null => {
  if (!queryResult) return null;

  const entries = get(queryResult, "registryEntryList", []);
  const juridicPeople = get(queryResult, "juridicPersonList", []);

  const body = entries
    .filter(
      (entry: Record<string, any>) =>
        Array.isArray(entry?.personList) ||
        Array.isArray(entry?.identificationNameList),
    )
    .map((entry: Record<string, any>) => {
      const persons = [
        ...(get(entry, "personList", []) || []),
        ...(get(entry, "identificationNameList", []) || []),
      ];

      return {
        type: entry["@type"] || "-",
        _value_1: persons.map((person: Record<string, any>) => {
          const identification = get(person, "identification", "");
          const isJuristic =
            BUSINESS_ID_REGEX.test(identification) ||
            !!juridicPeople.find(
              (juridic: Record<string, any>) =>
                get(juridic, "businessId") === identification ||
                get(juridic, "name") === get(person, "name"),
            );

          if (isJuristic) {
            return {
              juristicPerson: mapRyytiPersonToJuristic(person, juridicPeople),
            };
          }

          return {
            naturalPerson: mapRyytiPersonToNatural(person),
          };
        }),
      };
    });

  const representation = entries
    .filter((entry: Record<string, any>) =>
      Array.isArray(entry?.groupedPersonList),
    )
    .map((entry: Record<string, any>) => {
      const groupedPersons = get(entry, "groupedPersonList", []);
      const byGroupNumber = groupedPersons.reduce(
        (
          acc: Record<string, Array<Record<string, any>>>,
          item: Record<string, any>,
        ) => {
          const key = String(get(item, "groupnumber", 1));
          acc[key] = acc[key] || [];
          acc[key].push(item);
          return acc;
        },
        {},
      );

      const groupNumbers = Object.keys(byGroupNumber)
        .map((value) => Number(value))
        .sort((a, b) => a - b);
      const primaryGroup = byGroupNumber[String(groupNumbers[0])] || [];
      const additionalGroup = byGroupNumber[String(groupNumbers[1])] || [];

      const mapGrouped = (items: Array<Record<string, any>>) => {
        const naturalPerson: Array<Record<string, any>> = [];
        const juristicPerson: Array<Record<string, any>> = [];

        items.forEach((item: Record<string, any>) => {
          const identification = get(item, "identification", "");
          const role = toCodeOrValue(get(item, "representingWayCode"));

          if (BUSINESS_ID_REGEX.test(identification)) {
            juristicPerson.push(
              mapRyytiPersonToJuristic(
                {
                  ...item,
                  rolecode: role ? { code: role } : null,
                },
                juridicPeople,
                role,
              ),
            );
          } else {
            naturalPerson.push(
              mapRyytiPersonToNatural(
                {
                  ...item,
                  rolecode: role ? { code: role } : null,
                },
                role,
              ),
            );
          }
        });

        return {
          naturalPerson,
          juristicPerson,
        };
      };

      const mappedPrimary = mapGrouped(primaryGroup);
      const mappedAdditional = mapGrouped(additionalGroup);

      return {
        rule:
          toCodeOrValue(get(primaryGroup, "0.representingWayCode")) ||
          get(entry, "convertedRegistryEntryText") ||
          get(entry, "registerEntryText") ||
          get(entry, "@type") ||
          "-",
        group: mappedPrimary,
        additionalGroup:
          mappedAdditional.naturalPerson.length ||
          mappedAdditional.juristicPerson.length
            ? mappedAdditional
            : null,
      };
    });

  const legalRepresentation = entries
    .filter((entry: Record<string, any>) =>
      ["NIML", "NIMA", "SELA"].includes(entry?.["@type"]),
    )
    .map((entry: Record<string, any>) => ({
      header: get(entry, "@type") || null,
      text:
        get(entry, "convertedRegistryEntryText") ||
        get(entry, "registerEntryText") ||
        null,
      signingCode: toCodeOrValue(get(entry, "representingWayCode")) || null,
      registrationDate: get(entry, "startTime") || null,
      expireDate: get(entry, "endTime") || null,
    }));

  return {
    body,
    representation,
    legalRepresentation,
  };
};

export const mapRyytiNotificationsToCompanyNotice = (
  queryResult: Record<string, any> | null | undefined,
): Record<string, any> => {
  if (!queryResult) {
    return {
      notice: [],
    };
  }

  const pending = get(queryResult, "pendingNotifications", []) || [];
  const handled = get(queryResult, "handledNotifications", []) || [];

  const mapItem = (item: Record<string, any>) => ({
    type: toCodeOrValue(get(item, "notificationType")) || null,
    recordNumber: get(item, "notificationRecordNumber") || null,
    arrivalDate: get(item, "notificationArrivalTimestamp") || null,
    latestPhaseArrivalDate:
      get(item, "notificationClosingTimestamp") ||
      get(item, "notificationArrivalTimestamp") ||
      null,
    latestPhaseName:
      toCodeOrValue(get(item, "notificationState")) ||
      toCodeOrValue(get(item, "publicNotificationLastPhase")) ||
      null,
  });

  const notices = [...pending, ...handled]
    .map(mapItem)
    .sort(
      (a: Record<string, any>, b: Record<string, any>) =>
        new Date(b.arrivalDate || 0).getTime() -
        new Date(a.arrivalDate || 0).getTime(),
    );

  return {
    notice: notices,
  };
};

export const mapRyytiStructuredExtractToCompanyNoticeFallback = (
  queryResult: Record<string, any> | null | undefined,
): Record<string, any> => {
  if (!queryResult) {
    return {
      notice: [],
    };
  }

  const entries = getEntriesByType(queryResult, ["SELAS"]);

  const notices = entries.map((item: Record<string, any>) => ({
    type: toCodeOrValue(get(item, "notificationTypeCode")) || null,
    recordNumber: null,
    arrivalDate: get(item, "startTime") || null,
    latestPhaseArrivalDate:
      get(item, "endTime") || get(item, "startTime") || null,
    latestPhaseName:
      get(item, "companyStatus") ||
      toCodeOrValue(get(item, "matterTypeCode")) ||
      null,
  }));

  return {
    notice: notices,
  };
};
