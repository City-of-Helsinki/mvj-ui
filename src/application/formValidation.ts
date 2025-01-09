import { parseISO } from "date-fns";
import { get, set } from "lodash/object";
import { CONTROL_SHARE_FIELD_IDENTIFIER } from "@/application/constants";
const PERSONAL_IDENTIFIER_CHECK_CHAR_LIST = "0123456789ABCDEFHJKLMNPRSTUVWXY";
// from the rightmost digit to the leftmost
const COMPANY_IDENTIFIER_CHECKSUM_MULTIPLIERS = [2, 4, 8, 5, 10, 9, 7];
export const personalIdentifierValidator = (
  value: any,
  error?: string,
): string | null | undefined => {
  if (value === "") {
    return;
  }

  if (typeof value !== "string") {
    return error || "Virheellinen henkilötunnus";
  }

  const result =
    /^(\d{6})([-+ABCDEFUVWXY])(\d{3})([0-9ABCDEFHJKLMNPRSTUVWXY])$/.exec(
      value.toUpperCase(),
    );

  if (!result) {
    return error || "Virheellinen henkilötunnus";
  }

  const datePart = result[1];
  const separator = result[2];
  const runningNumber = result[3];
  const checkChar = result[4];
  let century = "19";

  switch (separator) {
    case "+":
      century = "18";
      break;

    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "F":
      century = "20";
      break;

    default:
      // U-Y, -
      break;
  }

  try {
    const year = `${century}${datePart.slice(4, 6)}`;
    const month = datePart.slice(2, 4);
    const day = datePart.slice(0, 2);
    const date = parseISO(`${year}-${month}-${day}T12:00:00`);

    if (
      date.getDate() !== parseInt(day) ||
      date.getMonth() !== parseInt(month) - 1 ||
      date.getFullYear() !== parseInt(year)
    ) {
      return error || "Virheellinen henkilötunnus";
    }
  } catch (e) {
    return error || "Virheellinen henkilötunnus";
  }

  const calculatedCheckChar =
    PERSONAL_IDENTIFIER_CHECK_CHAR_LIST[
      parseInt(datePart + runningNumber) % 31
    ];

  if (checkChar !== calculatedCheckChar) {
    return error || "Tarkistusmerkki ei täsmää";
  }
};
export const companyIdentifierValidator = (
  value: any,
  error?: string,
): string | null | undefined => {
  if (value === "") {
    return;
  }

  if (typeof value !== "string") {
    return error || "Virheellinen Y-tunnus";
  }

  const result = /^(\d{6,7})-(\d)$/.exec(value);

  if (!result) {
    return error || "Virheellinen Y-tunnus";
  }

  const identifier = parseInt(result[1]);
  const checkNumber = parseInt(result[2]);
  let sum = 0;
  let calculatedCheckNumber;

  for (let i = 0; i < 7; ++i) {
    const digit = Math.floor((identifier / Math.pow(10, i)) % 10);
    sum += digit * COMPANY_IDENTIFIER_CHECKSUM_MULTIPLIERS[i];
  }

  calculatedCheckNumber = sum % 11;

  if (calculatedCheckNumber === 1) {
    // Company identifiers that sum up to a remainder of 1 are not handed out at all,
    // because non-zero values are subtracted from 11 to get the final number and
    // in these cases that number would be 10
    return error || "Virheellinen Y-tunnus";
  } else if (calculatedCheckNumber > 1) {
    calculatedCheckNumber = 11 - calculatedCheckNumber;
  }

  if (calculatedCheckNumber !== checkNumber) {
    return error || "Tarkistusmerkki ei täsmää";
  }
};
export const emailValidator = (
  value: any,
  error?: string,
): string | null | undefined => {
  if (!value) {
    return;
  }

  // A relatively simple validation that catches the most egregious examples of invalid emails.
  // (Also intentionally denies some technically valid but in this context exceedingly rare addresses,
  // like ones with quoted strings containing spaces or a right-side value without a dot.)
  if (!/^\S+@\S+\.\S{2,}$/.exec(value)) {
    return error || "Virheellinen sähköpostiosoite";
  }
};
export const validateApplicationForm: (
  arg0: string,
) => (arg0: Record<string, any>) => Record<string, any> =
  (pathPrefix: string) => (values: Record<string, any>) => {
    let sum = 0;
    const errors = {};
    const controlSharePaths = [];
    const root = get(values, pathPrefix);

    if (!root?.sections) {
      return {};
    }

    const searchSingleSection = (section, path) => {
      if (section.fields) {
        Object.keys(section.fields).map((fieldIdentifier) => {
          if (fieldIdentifier === CONTROL_SHARE_FIELD_IDENTIFIER) {
            const result = /^(\d+)\s*\/\s*(\d+)$/.exec(
              section.fields[fieldIdentifier].value,
            );

            if (!result) {
              set(
                errors,
                `${path}.fields.${fieldIdentifier}.value`,
                "Virheellinen hallintaosuus",
              );
            } else {
              sum += parseInt(result[1]) / parseInt(result[2]);
              controlSharePaths.push(`${path}.fields.${fieldIdentifier}.value`);
            }
          }
        });
      }

      if (section.sections) {
        Object.keys(section.sections).map((identifier) =>
          searchSection(
            section.sections[identifier],
            `${path}.sections.${identifier}`,
          ),
        );
      }
    };

    const searchSection = (section, path) => {
      if (section instanceof Array) {
        section.forEach((singleSection, i) =>
          searchSingleSection(singleSection, `${path}[${i}]`),
        );
      } else {
        searchSingleSection(section, path);
      }
    };

    Object.keys(root.sections).map((identifier) =>
      searchSection(
        root.sections[identifier],
        `${pathPrefix}.sections.${identifier}`,
      ),
    );

    if (Math.abs(sum - 1) > 1e-9) {
      controlSharePaths.forEach((path) => {
        set(errors, path, "Hallintaosuuksien yhteismäärän on oltava 100%");
      });
    }

    return errors;
  };
