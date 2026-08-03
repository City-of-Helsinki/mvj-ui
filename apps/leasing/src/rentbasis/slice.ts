import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type {
  RentBasis,
  RentBasisId,
  RentBasisList,
  RentBasisState,
} from "./types";

const initialState: RentBasisState = {
  attributes: null,
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  isSaving: false,
  list: {},
  methods: null,
  rentbasis: {},
  isFormDirty: false,
};

const rentBasisSlice = createSlice({
  name: "mvj/rentbasis",
  initialState,
  reducers: {
    hideEditMode: (state) => {
      state.isEditMode = false;
    },

    showEditMode: (state) => {
      state.isEditMode = true;
    },

    fetchRentBasisList: (
      state,
      _action: PayloadAction<Record<string, any> | null | undefined>,
    ) => {
      state.isFetching = true;
    },

    fetchSingleRentBasis: (state, _action: PayloadAction<RentBasisId>) => {
      state.isFetching = true;
    },

    receiveRentBasisList: (state, action: PayloadAction<RentBasisList>) => {
      state.isFetching = false;
      state.list = action.payload;
    },

    receiveSingleRentBasis: (state, action: PayloadAction<RentBasis>) => {
      state.isFetching = false;
      state.isSaving = false;
      state.rentbasis = action.payload;
    },

    notFound: (state) => {
      state.isFetching = false;
      state.isSaving = false;
    },

    createRentBasis: (state, _action: PayloadAction<RentBasis>) => {
      state.isSaving = true;
    },

    editRentBasis: (state, _action: PayloadAction<RentBasis>) => {
      state.isSaving = true;
    },

    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },

    receiveAttributes: (state, action: PayloadAction<Attributes>) => {
      state.attributes = action.payload;
    },

    receiveMethods: (state, action: PayloadAction<Methods>) => {
      state.isFetchingAttributes = false;
      state.methods = action.payload;
    },

    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },

    receiveIsSaveClicked: (state, action: PayloadAction<boolean>) => {
      state.isSaveClicked = action.payload;
    },

    receiveIsFormDirty: (state, action: PayloadAction<boolean>) => {
      state.isFormDirty = action.payload;
    },
  },
});

export default rentBasisSlice.reducer;

export const {
  hideEditMode,
  showEditMode,
  fetchRentBasisList,
  fetchSingleRentBasis,
  receiveRentBasisList,
  receiveSingleRentBasis,
  notFound,
  createRentBasis,
  editRentBasis,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveIsSaveClicked,
  receiveIsFormDirty,
} = rentBasisSlice.actions;
