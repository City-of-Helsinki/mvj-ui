import { describe, expect, it } from "vitest";
import {
  mapRyytiEventsToCompanyNotice,
  mapRyytiStructuredExtractToCompanyExtended,
  mapRyytiStructuredExtractToCompanyNoticeFallback,
  mapRyytiStructuredExtractToCompanyRepresent,
} from "./mappers";

describe("tradeRegister mappers", () => {
  describe("mapStructuredExtractToCompanyExtended", () => {
    it("maps key company and contact fields", () => {
      const result = mapRyytiStructuredExtractToCompanyExtended({
        companyDetails: {
          businessId: "1234567-8",
          tradeRegisterNumber: "1.234.567",
          name: "Test Company Oy",
          registerTime: "2026-01-01T00:00:00Z",
          companyFormCode: { code: "OY" },
          companyStatusCode: { code: "R" },
        },
        contactDetails: {
          internetAddress: "https://example.com",
          emailAddress: "test@example.com",
          telephoneNumber: "+358123",
          mobilePhoneNumber: "+358456",
          faxNumber: "+358789",
          companyAddress: {
            postalAddress: {
              coAddress: "c/o Test",
              streetName: "Street",
              houseNumber: "1",
              postcode: { code: "00100" },
              city: "Helsinki",
              countryCode: { code: "FI" },
            },
            streetAddress: {
              streetName: "Visit",
              houseNumber: "2",
              postcode: { code: "00200" },
              city: "Espoo",
              countryCode: { code: "FI" },
            },
          },
        },
        registryEntryList: [
          {
            "@type": "KOTI",
            municipalCode: { code: "091" },
            startTime: "2025-01-01T00:00:00Z",
          },
          {
            "@type": "TAL",
            businessLine: "Software development",
            startTime: "2025-01-01T00:00:00Z",
          },
          {
            "@type": "OPO",
            amount: 1000,
            startTime: "2025-01-01T00:00:00Z",
          },
          {
            "@type": "OSLUKU",
            count: 100,
            startTime: "2025-01-01T00:00:00Z",
          },
        ],
        companyNameHistoryList: [
          {
            name: "Old Name Oy",
            startDate: "2020-01-01",
            endDate: "2021-01-01",
          },
        ],
      });

      expect(result?.businessId).to.equal("1234567-8");
      expect(result?.registrationNumber).to.equal("1.234.567");
      expect(result?.companyName?.name).to.equal("Test Company Oy");
      expect(result?.companyName?.lineOfBusiness?.value).to.equal(
        "Software development",
      );
      expect(result?.contactInformation?.email).to.equal("test@example.com");
      expect(result?.contactInformation?.phone?.number).to.deep.equal([
        "+358123",
        "+358456",
      ]);
      expect(result?.domicile?.code).to.equal("091");
      expect(result?.shareCapital?.value).to.equal(1000);
      expect(result?.shareCapital?.amountOfShares).to.equal(100);
    });
  });

  describe("mapEventsToCompanyNotice", () => {
    it("filters by business id and maps notice values", () => {
      const result = mapRyytiEventsToCompanyNotice(
        [
          {
            businessId: "1234567-8",
            notificationType: { code: "M" },
            eventType: { code: "MV" },
            notificationRecordNumber: "2026/1",
            notificationArrivalTimestamp: "2026-01-02T00:00:00Z",
            notificationRegisterTimestamp: "2026-01-03T00:00:00Z",
            notificationState: { code: "V" },
          },
          {
            businessId: "7654321-0",
            notificationType: { code: "X" },
          },
        ],
        "1234567-8",
      );

      expect(result.notice.length).to.equal(1);
      expect(result.notice[0].type).to.equal("M");
      expect(result.notice[0].recordNumber).to.equal("2026/1");
      expect(result.notice[0].latestPhaseName).to.equal("V");
    });
  });

  describe("mapStructuredExtractToCompanyNoticeFallback", () => {
    it("maps fallback notices from SELAS entries", () => {
      const result = mapRyytiStructuredExtractToCompanyNoticeFallback({
        registryEntryList: [
          {
            "@type": "SELAS",
            notificationTypeCode: { code: "M" },
            matterTypeCode: { code: "SOME" },
            startTime: "2026-01-01T00:00:00Z",
            endTime: "2026-01-02T00:00:00Z",
          },
        ],
      });

      expect(result.notice.length).to.equal(1);
      expect(result.notice[0].type).to.equal("M");
      expect(result.notice[0].arrivalDate).to.equal("2026-01-01T00:00:00Z");
    });
  });

  describe("mapStructuredExtractToCompanyRepresent", () => {
    it("maps body and representation sections", () => {
      const result = mapRyytiStructuredExtractToCompanyRepresent({
        registryEntryList: [
          {
            "@type": "EDU",
            personList: [
              {
                rolecode: { code: "PJ" },
                identification: "01.02.1980",
                name: "Matti Meikalainen",
              },
            ],
          },
          {
            "@type": "NIMO",
            groupedPersonList: [
              {
                representingWayCode: { code: "NIMO01" },
                groupnumber: 1,
                identification: "02.03.1985",
                name: "Teppo Testinen",
              },
            ],
          },
          {
            "@type": "NIML",
            registerEntryText: "Legal text",
            startTime: "2026-01-01T00:00:00Z",
          },
        ],
        juridicPersonList: [],
      });

      expect(result?.body.length).to.be.greaterThan(0);
      expect(result?.representation.length).to.equal(1);
      expect(result?.legalRepresentation.length).to.equal(1);
      expect(result?.legalRepresentation[0].text).to.equal("Legal text");
    });
  });
});
