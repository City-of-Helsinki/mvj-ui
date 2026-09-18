import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { findIndex } from "lodash-es";
import type { Attributes, Methods, QueryParams } from "@/types";
import type {
  AreaNote,
  AreaNoteId,
  AreaNoteList,
  AreaNoteState,
} from "./types";

export const initialState: AreaNoteState = {
  attributes: null,
  initialValues: {
    id: -1,
    geoJSON: {},
    isNew: true,
    note: "",
  },
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  list: [],
  methods: null,
};

const areaNoteSlice = createSlice({
  name: "mvj/areaNote",
  initialState,
  reducers: {
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },
    receiveAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.attributes = payload;
    },
    receiveMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.methods = payload;
      state.isFetchingAttributes = false;
    },
    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },
    fetchAreaNoteList: (state, _action: PayloadAction<QueryParams>) => {
      state.isFetching = true;
    },
    receiveAreaNoteList: (state, { payload }: PayloadAction<AreaNoteList>) => {
      state.list = payload;
      state.isFetching = false;
    },
    createAreaNote: (state, _action: PayloadAction<AreaNote>) => {
      state.isFetching = true;
    },
    deleteAreaNote: (state, _action: PayloadAction<number>) => {
      state.isFetching = true;
    },
    editAreaNote: (state, _action: PayloadAction<AreaNote>) => {
      state.isFetching = true;
    },
    receiveDeletedAreaNote: (state, { payload }: PayloadAction<AreaNoteId>) => {
      state.list = state.list.filter((area) => area.id !== payload);
      state.isFetching = false;
    },
    receiveEditedAreaNote: (state, { payload }: PayloadAction<AreaNote>) => {
      const index = findIndex(state.list, (area) => area.id === payload.id);

      if (index === -1) {
        state.list.push(payload);
      } else {
        state.list[index] = payload;
      }

      state.isFetching = false;
    },
    notFound: (state) => {
      state.isFetching = false;
    },
    showEditMode: (state) => {
      state.isEditMode = true;
    },
    hideEditMode: (state) => {
      state.isEditMode = false;
    },
    initializeAreaNote: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.initialValues = payload;
    },
  },
});

export const {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchAreaNoteList,
  receiveAreaNoteList,
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  receiveDeletedAreaNote,
  receiveEditedAreaNote,
  notFound,
  showEditMode,
  hideEditMode,
  initializeAreaNote,
} = areaNoteSlice.actions;

export default areaNoteSlice.reducer;
