import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const resultSlice = createSlice({
    name: "results",
    initialState: {
        results: [],
        result: {},
        loading: false,
        error: null,
        message: null,
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        latestResults: []
    },
    reducers: {
        requestStarted: (state) => {
            state.loading = true;
            state.error = null;
        },
        getResultsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.results = action.payload.results;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalResults = action.payload.totalResults;
        },
        requestFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getSingleResultSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.result = action.payload;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetResult(state) {
            state.result = null;
            state.latestResults = [];
        },
        requestLatestResults(state) {
            state.loading = true;
            state.error = null;
        },
        successLatestResults(state, action) {
            state.loading = false;
            state.error = null;
            state.latestResults = action.payload.results;
        },
        failureLatestResults(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.latestResults = [];
        },
    }
});

/*export const fetchResults = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
      dispatch(resultSlice.actions.requestStarted());
  
      let link = `/api/results?`;
      let queryParams = [`page=${page}`];
  
      if (searchKeyword) {
        queryParams.push(`searchKeyword=${searchKeyword}`);
      }
  
      link += queryParams.join("&");
      const { data } = await axios.get(link, { withCredentials: true });
      dispatch(resultSlice.actions.getResultsSuccess(data));
    } catch (error) {
      dispatch(resultSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch results"));
    }
  };
  

  export const fetchSingleResult = (id) => async (dispatch) => {
    dispatch(resultSlice.actions.requestStarted());
    try {
      const response = await axios.get(
        `/api/results/${id}`,
        { withCredentials: true }
      );
      dispatch(resultSlice.actions.getSingleResultSuccess(response.data.result));
    } catch (error) {
      dispatch(resultSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch result"));
    }
  };*/

export const clearResultErrors = () => (dispatch) => {
    dispatch(resultSlice.actions.clearErrors());
};

export const resetResultDetails = () => (dispatch) => {
    dispatch(resultSlice.actions.resetResult());
};

export const fetchLatestResults = () => async (dispatch) => {
    try {
      dispatch(resultSlice.actions.requestLatestResults());
      const { data } = await axios.get(
        `/api/results/latest`,
        { withCredentials: true }
      );
      dispatch(resultSlice.actions.successLatestResults(data));
    } catch (error) {
      dispatch(resultSlice.actions.failureLatestResults(error.response?.data?.message || "Failed to fetch latest results"));
    }
  };
  
export default resultSlice.reducer;