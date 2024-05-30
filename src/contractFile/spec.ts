import { expect } from "chai";
import { fetchContractFilesById, receiveContractFilesById, notFoundById } from "./actions";
import contractFileReducer from "./reducer";
import type { ContractFileState } from "./types";
const defaultState: ContractFileState = {
  byId: {},
  isFetchingById: {}
};

describe('contractFile', () => {
  describe('Reducer', () => {
    describe('contractFileReducer', () => {
      it('should update isFetchingById flags when fetching contract files', () => {
        const dummyId = 1;
        const newState = { ...defaultState,
          isFetchingById: {
            [dummyId]: true
          }
        };
        const state = contractFileReducer({}, fetchContractFilesById(dummyId));
        expect(state).to.deep.equal(newState);
      });
      it('should update contract files', () => {
        const dummyId = 1;
        const dummyFiles = [];
        const newState = { ...defaultState,
          byId: {
            [dummyId]: dummyFiles
          },
          isFetchingById: {
            [dummyId]: false
          }
        };
        const state = contractFileReducer({}, receiveContractFilesById({
          contractId: dummyId,
          files: dummyFiles
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingById flags when by notFoundById', () => {
        const dummyId = 1;
        const newState = { ...defaultState,
          isFetchingById: {
            [dummyId]: false
          }
        };
        let state = contractFileReducer({}, fetchContractFilesById(dummyId));
        state = contractFileReducer(state, notFoundById(dummyId));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});