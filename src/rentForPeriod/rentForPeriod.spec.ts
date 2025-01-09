import { describe, expect, it } from "vitest";
import {
  receiveRentForPeriodByLease,
  deleteRentForPeriodByLease,
  fetchRentForPeriodByLease,
  receiveIsSaveClicked,
  notFound,
} from "./actions";
import rentForPeriodReducer from "./reducer";
import type { RentForPeriodState } from "./types";
const defaultState: RentForPeriodState = {
  byLease: {},
  isFetching: false,
  isSaveClicked: false,
};

describe("Rent for period", () => {
  describe("Reducer", () => {
    describe("rentForPeriodReducer", () => {
      it("should update rent for period list", () => {
        const leaseId = 1;
        const dummyRentForPeriod1 = {
          id: 1,
          label: "Foo",
        };
        const dummyRentForPeriod2 = {
          id: 1,
          label: "Foo",
        };
        const newState1 = {
          ...defaultState,
          byLease: {
            [leaseId]: [dummyRentForPeriod1],
          },
        };
        const newState2 = {
          ...defaultState,
          byLease: {
            [leaseId]: [dummyRentForPeriod1, dummyRentForPeriod2],
          },
        };
        let state = rentForPeriodReducer(
          {},
          receiveRentForPeriodByLease({
            leaseId: leaseId,
            rent: dummyRentForPeriod1,
          }),
        );
        expect(state).to.deep.equal(newState1);
        state = rentForPeriodReducer(
          state,
          receiveRentForPeriodByLease({
            leaseId: leaseId,
            rent: dummyRentForPeriod2,
          }),
        );
        expect(state).to.deep.equal(newState2);
      });
      it("should delete rent for period", () => {
        const leaseId1 = 1;
        const leaseId2 = 2;
        const rentId1 = 11;
        const rentId2 = 12;
        const dummyRentForPeriod = {
          id: rentId1,
          label: "Foo",
        };
        const newState1 = {
          ...defaultState,
          byLease: {
            [leaseId1]: [],
          },
        };
        const newState2 = {
          ...defaultState,
          byLease: {
            [leaseId1]: [],
            [leaseId2]: [],
          },
        };
        let state = rentForPeriodReducer(
          {},
          receiveRentForPeriodByLease({
            leaseId: leaseId1,
            rent: dummyRentForPeriod,
          }),
        );
        state = rentForPeriodReducer(
          state,
          deleteRentForPeriodByLease({
            leaseId: leaseId1,
            id: rentId1,
          }),
        );
        expect(state).to.deep.equal(newState1);
        state = rentForPeriodReducer(
          state,
          deleteRentForPeriodByLease({
            leaseId: leaseId2,
            id: rentId2,
          }),
        );
        expect(state).to.deep.equal(newState2);
      });
      it("should update isFetching flag to true when fetching rent for period", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = rentForPeriodReducer(
          {},
          fetchRentForPeriodByLease({
            leaseId: 1,
            id: 5,
            allowDelete: false,
            type: "year",
            startDate: "2018-12-12",
            endDate: "2018-12-12",
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState, isFetching: false };
        let state = rentForPeriodReducer(
          {},
          fetchRentForPeriodByLease({
            leaseId: 1,
            id: 5,
            allowDelete: false,
            type: "year",
            startDate: "2018-12-12",
            endDate: "2018-12-12",
          }),
        );
        state = rentForPeriodReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...defaultState, isSaveClicked: true };
        const state = rentForPeriodReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
