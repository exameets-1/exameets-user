import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const govtJobSlice = createSlice({
  name: "govtjobs",
  initialState: {
    govtjobs: [],
    loading: false,
    error: null,
    message: null,
    singlegovtJob: {},
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    latestGovtJobs: [],
  }, 
  reducers: {
    requestForAllJobs(state) {
      state.loading = true;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleJob(state) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.singlegovtJob = action.payload || {};
    },
    failureForSingleJob(state, action) {
      state.singlegovtJob = {};
      state.error = action.payload;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
      state.loading = false;
    },
    resetGovtJobSlice(state) {
      state.error = null;
      state.govtjobs = [];
      state.loading = false;
      state.message = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalJobs = 0;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.error = null;
      state.govtjobs = action.payload.jobs || [];
      state.currentPage = action.payload.currentPage || 1;
      state.totalPages = action.payload.totalPages || 1;
      state.totalJobs = action.payload.totalJobs || 0;
    },
    requestLatestJobs(state) {
      state.loading = true;
      state.error = null;
    },
    successLatestJobs(state, action) {
      state.loading = false;
      state.error = null;
      state.latestGovtJobs = action.payload.govtjobs || [];
    },
    failureLatestJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.latestGovtJobs = [];
    }
  },
});

/*export const fetchGovtJobs = (city, job_type, searchKeyword = "", page = 1) => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.requestForAllJobs());

    let link = `/api/govtjobs?`;
    let queryParams = [`page=${page}`];

    if (searchKeyword) {
      queryParams.push(`searchKeyword=${searchKeyword}`);
    }
    if (city && city !== "All") {
      queryParams.push(`city=${city}`);
    }
    if (job_type && job_type !== "All") {
      queryParams.push(`job_type=${job_type}`);
    }

    link += queryParams.join("&");
    const { data } = await axios.get(link, { withCredentials: true });
    dispatch(govtJobSlice.actions.successForAllJobs(data));
  } catch (error) {
    dispatch(govtJobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch jobs"));
  }
};

export const fetchSingleGovtJob = (jobId) => async (dispatch) => {
  dispatch(govtJobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(
      `/api/govtjobs/${jobId}`,
      { withCredentials: true }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch job details');
    }

    dispatch(govtJobSlice.actions.successForSingleJob(response.data.job));
  } catch (error) {
    dispatch(govtJobSlice.actions.failureForSingleJob(
      error.response?.data?.message || error.message || "Failed to fetch job"
    ));
  }
};*/

export const clearAllGovtJobErrors = () => (dispatch) => {
  dispatch(govtJobSlice.actions.clearAllErrors());
};

export const resetGovtJobSlice = () => (dispatch) => {
  dispatch(govtJobSlice.actions.resetGovtJobSlice());
};

export const fetchLatestGovtJobs = () => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.requestLatestJobs());
    const { data } = await axios.get(
      `/api/govtjobs/latest`,
      { withCredentials: true }
    );
    // The API returns { success: true, govtjobs: [...] }
    dispatch(govtJobSlice.actions.successLatestJobs(data));
  } catch (error) {
    dispatch(govtJobSlice.actions.failureLatestJobs(error.response?.data?.message || "Failed to fetch latest jobs"));
  }
};

export const { clearErrors } = govtJobSlice.actions;
export default govtJobSlice.reducer;