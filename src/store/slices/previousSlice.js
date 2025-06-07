import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const previousYearSlice = createSlice({
  name: "previousYears",
  initialState: {
    subjects: [],         // For storing unique subjects
    papersList: [],       // For storing papers of a specific subject
    currentPaper: null,   // For storing details of a single paper
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalYears: 0,
    latestYears: [],
  },
  reducers: {
    fetchSubjectsRequest(state) {
      state.loading = true;
      state.error = null;
  },
  fetchSubjectsSuccess(state, action) {
      state.loading = false;
      state.subjects = action.payload;
      state.error = null;
  },
  fetchSubjectsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.subjects = [];
  },

  // Subject papers loading states
  fetchPapersRequest(state) {
      state.loading = true;
      state.error = null;
  },
  fetchPapersSuccess(state, action) {
      state.loading = false;
      state.papersList = action.payload;
      state.error = null;
  },
  fetchPapersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.papersList = [];
  },

  // Single paper details loading states
  fetchPaperDetailsRequest(state) {
      state.loading = true;
      state.error = null;
  },
  fetchPaperDetailsSuccess(state, action) {
      state.loading = false;
      state.currentPaper = action.payload;
      state.error = null;
  },
  fetchPaperDetailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.currentPaper = null;
  },

  // Clear states
  clearError(state) {
      state.error = null;
  },
  resetState(state) {
      state.subjects = [];
      state.papersList = [];
      state.currentPaper = null;
      state.loading = false;
      state.error = null;
  },
  requestLatestYears(state) {
    state.loading = true;
    state.error = null;
  },
  successForLatestYears(state, action) {
    state.loading = false;
    state.error = null;
    state.latestYears = action.payload.pyqs;
  },
  failureForLatestYears(state, action) {
    state.loading = false;
    state.error = action.payload;
    state.latestYears = [];
  }
},
});
export const fetchSubjects = () => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.fetchSubjectsRequest());
      const response = await axios.get('/api/pyqs');
      dispatch(previousYearSlice.actions.fetchSubjectsSuccess(response.data));
  } catch (error) {
      dispatch(previousYearSlice.actions.fetchSubjectsFailure(
          error.response?.data?.error || "Failed to fetch subjects"
      ));
  }
};

export const fetchPapersBySubject = (subject) => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.fetchPapersRequest());
      const response = await axios.get(`/api/pyqs?subject=${encodeURIComponent(subject)}`);
      dispatch(previousYearSlice.actions.fetchPapersSuccess(response.data));
  } catch (error) {
      dispatch(previousYearSlice.actions.fetchPapersFailure(
          error.response?.data?.error || "Failed to fetch papers"
      ));
  }
};

export const fetchPaperDetails = (paperId) => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.fetchPaperDetailsRequest());
      const response = await axios.get(`/api/pyqs/${paperId}`);
      dispatch(previousYearSlice.actions.fetchPaperDetailsSuccess(response.data));
  } catch (error) {
      dispatch(previousYearSlice.actions.fetchPaperDetailsFailure(
          error.response?.data?.error || "Failed to fetch paper details"
      ));
  }
};
export const fetchLatestYears = () => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.requestLatestYears());
      const { data } = await axios.get(`/api/pyqs/latest`, { withCredentials: true });
      dispatch(previousYearSlice.actions.successForLatestYears(data));
      
  } catch (error) {
      dispatch(previousYearSlice.actions.failureForLatestYears(error.response?.data?.message || "Failed to fetch latest years"));
  }
}

export const clearErrors = () => (dispatch) => {
  dispatch(previousYearSlice.actions.clearError());
};

export const resetPreviousYearState = () => (dispatch) => {
  dispatch(previousYearSlice.actions.resetState());
};
export const { actions } = previousYearSlice;
export default previousYearSlice.reducer;
