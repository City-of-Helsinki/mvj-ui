import { describe, expect, it } from "vitest";
import { getContentLeaseListLeaseAddresses } from "./helpers";
import type { Lease } from "./types";

describe("leases/helpers", () => {
  describe("getContentLeaseListLeaseAddresses", () => {
    it("should return empty array when lease is empty", () => {
      const lease = {} as Lease;
      expect(getContentLeaseListLeaseAddresses(lease)).to.deep.equal([]);
    });

    it("should return empty array when there are no lease areas", () => {
      const lease = {
        lease_areas: [],
      } as unknown as Lease;
      expect(getContentLeaseListLeaseAddresses(lease)).to.deep.equal([]);
    });

    it("should return empty array when areas have no addresses", () => {
      const lease = {
        lease_areas: [
          {
            addresses: [],
          },
        ],
      } as unknown as Lease;
      expect(getContentLeaseListLeaseAddresses(lease)).to.deep.equal([]);
    });

    it("should return addresses correctly from areas", () => {
      const lease = {
        lease_areas: [
          {
            addresses: [
              { address: "Address 2", postal_code: "00200", city: "Helsinki" },
              { address: "Address 1", postal_code: "00100", city: "Helsinki" },
            ],
          },
        ],
      } as unknown as Lease;

      const results = getContentLeaseListLeaseAddresses(lease);
      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.deep.equal([
        "Address 1, 00100 Helsinki",
        "Address 2, 00200 Helsinki",
      ]);
    });

    it("should filter out archived areas", () => {
      const lease = {
        lease_areas: [
          {
            archived_at: "2023-01-01",
            addresses: [
              {
                address: "Old Address",
                postal_code: "00300",
                city: "Helsinki",
              },
            ],
          },
          {
            addresses: [
              {
                address: "New Address",
                postal_code: "00400",
                city: "Helsinki",
              },
            ],
          },
        ],
      } as unknown as Lease;

      const results = getContentLeaseListLeaseAddresses(lease);
      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.deep.equal(["New Address, 00400 Helsinki"]);
    });

    it("should return unique addresses per area and sorted", () => {
      const lease = {
        lease_areas: [
          {
            addresses: [
              { address: "B", postal_code: "00200", city: "Helsinki" },
              { address: "A", postal_code: "00100", city: "Helsinki" },
              { address: "A", postal_code: "00100", city: "Helsinki" },
            ],
          },
        ],
      } as unknown as Lease;

      const results = getContentLeaseListLeaseAddresses(lease);
      expect(results).to.deep.equal([
        ["A, 00100 Helsinki", "B, 00200 Helsinki"],
      ]);
    });

    it("should handle multiple areas separately", () => {
      const lease = {
        lease_areas: [
          {
            addresses: [
              { address: "Area 1", postal_code: "00100", city: "Helsinki" },
            ],
          },
          {
            addresses: [
              { address: "Area 2", postal_code: "00200", city: "Helsinki" },
            ],
          },
        ],
      } as unknown as Lease;

      const results = getContentLeaseListLeaseAddresses(lease);
      expect(results).to.have.lengthOf(2);
      expect(results[0]).to.deep.equal(["Area 1, 00100 Helsinki"]);
      expect(results[1]).to.deep.equal(["Area 2, 00200 Helsinki"]);
    });

    it("should filter out null or empty address strings", () => {
      const lease = {
        lease_areas: [
          {
            addresses: [
              {}, // results in null
              { address: "" }, // results in ""
            ],
          },
        ],
      } as unknown as Lease;

      const results = getContentLeaseListLeaseAddresses(lease);
      expect(results).to.deep.equal([]);
    });
  });
});
