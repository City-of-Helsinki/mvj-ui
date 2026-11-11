import { describe, expect, it } from "vitest";
import areaSearchReducer, {
  initialState,
  areaSearchesByBBoxNotFound,
  areaSearchesNotFound,
  attributesNotFound,
  batchEditAreaSearchInfoChecks,
  editAreaSearch,
  fetchAreaSearchList,
  fetchAreaSearchListByBBox,
  fetchAttributes,
  fetchListAttributes,
  fetchSingleAreaSearch,
  hideEditMode,
  listAttributesNotFound,
  receiveAreaSearchByBBoxList,
  receiveAreaSearchEdited,
  receiveAreaSearchEditFailed,
  receiveAreaSearchList,
  receiveAttributes,
  receiveListAttributes,
  receiveListMethods,
  receiveMethods,
  receiveSingleAreaSearch,
  setAreaSearchAttachments,
  showEditMode,
  singleAreaSearchNotFound,
} from "@/areaSearch/slice";

describe("AreaSearch", () => {
  describe("Reducer", () => {
    describe("areaSearchReducer", () => {
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = areaSearchReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          foo: "bar",
        };
        const newState = { ...initialState, methods: dummyMethods };
        const state = areaSearchReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingAttributes to true when fetching attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = areaSearchReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingAttributes to false when attributes were not found", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        const state = areaSearchReducer(
          { ...initialState, isFetchingAttributes: true },
          attributesNotFound(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update list attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState, listAttributes: dummyAttributes };
        const state = areaSearchReducer(
          initialState,
          receiveListAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update list methods", () => {
        const dummyMethods = {
          foo: "bar",
        };
        const newState = { ...initialState, listMethods: dummyMethods };
        const state = areaSearchReducer(
          initialState,
          receiveListMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingListAttributes to true when fetching list attributes", () => {
        const newState = { ...initialState, isFetchingListAttributes: true };
        const state = areaSearchReducer(initialState, fetchListAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingListAttributes to false when list attributes were not found", () => {
        const newState = { ...initialState, isFetchingListAttributes: false };
        const state = areaSearchReducer(
          { ...initialState, isFetchingListAttributes: true },
          listAttributesNotFound(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update area search list", () => {
        const dummyList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = {
          ...initialState,
          areaSearchList: dummyList,
          isFetchingAreaSearchList: false,
        };
        const state = areaSearchReducer(
          { ...initialState, isFetchingAreaSearchList: true },
          receiveAreaSearchList(dummyList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetching flag when retrieving area searches", () => {
        const newState = { ...initialState, isFetchingAreaSearchList: true };
        const state = areaSearchReducer(
          initialState,
          fetchAreaSearchList({ test: "test" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should unset isFetching flag when area searches could not be fetched", () => {
        const newState = { ...initialState, isFetchingAreaSearchList: false };
        const state = areaSearchReducer(
          { ...initialState, isFetchingAreaSearchList: true },
          areaSearchesNotFound(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update area search list by bounding box", () => {
        const dummyList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = {
          ...initialState,
          areaSearchListByBBox: dummyList,
          isFetchingAreaSearchListByBBox: false,
        };
        const state = areaSearchReducer(
          { ...initialState, isFetchingAreaSearchListByBBox: true },
          receiveAreaSearchByBBoxList(dummyList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetching flag when retrieving area searches by bounding box", () => {
        const newState = {
          ...initialState,
          isFetchingAreaSearchListByBBox: true,
        };
        const state = areaSearchReducer(
          initialState,
          fetchAreaSearchListByBBox({ test: "test" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should unset isFetching flag when area searches by bounding box could not be fetched", () => {
        const newState = {
          ...initialState,
          isFetchingAreaSearchListByBBox: false,
        };
        const state = areaSearchReducer(
          { ...initialState, isFetchingAreaSearchListByBBox: true },
          areaSearchesByBBoxNotFound(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update current area search", () => {
        const dummySearch = {
          id: 1,
        };
        const newState = {
          ...initialState,
          currentAreaSearch: dummySearch,
          isFetchingCurrentAreaSearch: false,
        };
        const state = areaSearchReducer(
          { ...initialState, isFetchingCurrentAreaSearch: true },
          receiveSingleAreaSearch(dummySearch),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetching flag when retrieving current area search", () => {
        const newState = { ...initialState, isFetchingCurrentAreaSearch: true };
        const state = areaSearchReducer(initialState, fetchSingleAreaSearch(1));
        expect(state).to.deep.equal(newState);
      });
      it("should unset isFetching flag when current area search could not be fetched", () => {
        const newState = {
          ...initialState,
          isFetchingCurrentAreaSearch: false,
        };
        const state = areaSearchReducer(
          { ...initialState, isFetchingCurrentAreaSearch: true },
          singleAreaSearchNotFound(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should enable edit mode", () => {
        const newState = { ...initialState, isEditMode: true };
        const state = areaSearchReducer(initialState, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should disable edit mode", () => {
        const newState = { ...initialState, isEditMode: false };
        const state = areaSearchReducer(
          { ...initialState, isEditMode: true },
          hideEditMode(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set update flag when batch editing info checks", () => {
        const newState = {
          ...initialState,
          isBatchEditingAreaSearchInfoChecks: true,
        };
        const state = areaSearchReducer(
          { ...initialState, isBatchEditingAreaSearchInfoChecks: false },
          batchEditAreaSearchInfoChecks({
            areaSearch: initialState,
            applicant: [],
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set edit flag when updating an area search", () => {
        const newState = { ...initialState, isEditingAreaSearch: true };
        const state = areaSearchReducer(
          initialState,
          editAreaSearch(initialState),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should unset edit flag when an area search was updated", () => {
        const newState = { ...initialState, isEditingAreaSearch: false };
        const state = areaSearchReducer(
          { ...initialState, isEditingAreaSearch: true },
          receiveAreaSearchEdited(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should unset edit flag and store the error when an area search could not be updated", () => {
        const newState = {
          ...initialState,
          isEditingAreaSearch: false,
          lastAreaSearchEditError: { test: "test error" },
        };
        const state = areaSearchReducer(
          { ...initialState, isEditingAreaSearch: true },
          receiveAreaSearchEditFailed({ test: "test error" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update area search attachments", () => {
        const dummyFile = {
          id: 1,
          attachment:
            "http://localhost:8001/media/area_search_attachments/2024-04-19/filename.pdf",
          name: "filename.pdf",
          field: 1,
          created_at: "2024-04-19T10:54:21.269517+03:00",
          user: {
            id: 1,
            first_name: "Matti",
            last_name: "Meikäläinen",
            is_staff: false,
            username: "u-abcdefg1hij23klmnvwxyzabcd",
          },
        };
        const newState = {
          ...initialState,
          currentAreaSearch: {
            area_search_attachments: [dummyFile],
          },
        };
        const state = areaSearchReducer(
          {
            ...initialState,
            currentAreaSearch: {
              area_search_attachments: [],
            },
          },
          setAreaSearchAttachments([dummyFile]),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
