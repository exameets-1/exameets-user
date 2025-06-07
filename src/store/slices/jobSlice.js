import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    itJobs: [],
    nonItJobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    latestJobs: [],
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
      state.singleJob = action.payload;
    },
    failureForSingleJob(state, action) {
      state.singleJob;
      state.error = action.payload;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
      state.loading = false;
    },
    resetJobSlice(state) {
      state.error = null;
      state.jobs = [];
      state.loading = false;
      state.message = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalJobs = 0;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.error = null;
      state.jobs = action.payload.jobs || [];
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
      state.latestJobs = action.payload.jobs;
    },
    failureLatestJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.latestJobs = [];
    },
    getAllITJobsRequest(state) {
      state.loading = true;
      state.error = null;
    },
   getAllITJobsSuccess(state, action) {
  state.loading = false;
  state.error = null;
  state.itJobs = action.payload.jobs; // ✅ Use itJobs
},

getAllNonITJobsSuccess(state, action) {
  state.loading = false;
  state.error = null;
  state.nonItJobs = action.payload.jobs; // ✅ Use nonItJobs
},

    getAllITJobsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getAllNonITJobsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllNonITJobsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

/*export const fetchJobs = (city, job_type, searchKeyword = "", page = 1) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForAllJobs());

    let link = `/api/jobs?`;
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
    dispatch(jobSlice.actions.successForAllJobs(data));
  } catch (error) {
    dispatch(jobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch jobs"));
  }
};

export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(
      `/api/jobs/${jobId}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForSingleJob(response.data.job));
  } catch (error) {
    dispatch(jobSlice.actions.failureForSingleJob(error.response?.data?.message || "Failed to fetch job"));
  }
};*/

export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export const fetchLatestJobs = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestLatestJobs());
    const { data } = await axios.get(
      `/api/jobs/latest`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successLatestJobs(data));
  } catch (error) {
    dispatch(jobSlice.actions.failureLatestJobs(error.response?.data?.message || "Failed to fetch latest jobs"));
  }
};

export const fetchAllITJobs = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.getAllITJobsRequest());
    const response = await axios.get(
      `/api/jobs/category/it`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.getAllITJobsSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.getAllITJobsFailed(error.response?.data?.message || "Failed to fetch IT jobs"));
  }
};

export const fetchAllNonITJobs = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.getAllNonITJobsRequest());
    const response = await axios.get(
      `/api/jobs/category/non-it`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.getAllNonITJobsSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.getAllNonITJobsFailed(error.response?.data?.message || "Failed to fetch non-IT jobs"));
  }
};

export const { clearErrors } = jobSlice.actions;
export default jobSlice.reducer;