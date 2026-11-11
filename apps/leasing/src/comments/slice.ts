import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type { LeaseId } from "@/leases/types";
import type {
  Comment,
  CommentId,
  CommentState,
  CreateCommentPayload,
  EditCommentPayload,
} from "./types";

export const initialState: CommentState = {
  attributes: null,
  byLease: {},
  isEditModeById: {},
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  methods: null,
};

const commentsSlice = createSlice({
  name: "mvj/comments",
  initialState,
  reducers: {
    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },
    notFound: (state) => {
      state.isFetching = false;
    },
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },
    receiveAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.attributes = payload;
      state.isFetchingAttributes = false;
    },
    receiveMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.methods = payload;
      state.isFetchingAttributes = false;
    },
    fetchCommentsByLease: (state, _action: PayloadAction<LeaseId>) => {
      state.isFetching = true;
    },
    receiveCommentsByLease: (state, { payload }: PayloadAction<Comment>) => {
      state.isFetching = false;
      state.byLease[payload.leaseId] = payload.comments;
    },
    createComment: (state, _action: PayloadAction<CreateCommentPayload>) => {
      state.isFetching = true;
    },
    editComment: (state, _action: PayloadAction<EditCommentPayload>) => {
      state.isFetching = true;
    },
    clearEditFlags: (state) => {
      state.isEditModeById = {};
    },
    hideEditModeById: (state, { payload }: PayloadAction<CommentId>) => {
      state.isEditModeById[payload] = false;
    },
    showEditModeById: (state, { payload }: PayloadAction<CommentId>) => {
      state.isEditModeById[payload] = true;
    },
    receiveIsSaveClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isSaveClicked = payload;
    },
  },
});

export const {
  attributesNotFound,
  notFound,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  fetchCommentsByLease,
  receiveCommentsByLease,
  createComment,
  editComment,
  clearEditFlags,
  hideEditModeById,
  showEditModeById,
  receiveIsSaveClicked,
} = commentsSlice.actions;

export default commentsSlice.reducer;
