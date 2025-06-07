import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const scholarshipSlice = createSlice({
  name: "scholarships",
  initialState: {
    scholarships: [],
    loading: false,         
    error: null,
    message: null,
    scholarship: null,
    currentPage: 1,
    totalPages: 1,
    totalScholarships: 0,
    appliedScholarships: [],
    latestScholarships: [], 
  },
  reducers: {
    requestForAllScholarships(state) {
    state.loading = true;
    state.error = null;
  },
  failureForAllScholarships(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  requestForSingleScholarship(state) {
    state.message = null;
    state.error = null;
    state.loading = true;
  },
  successForSingleScholarship(state, action) {
    state.loading = false;
    state.error = null;
    state.scholarship = action.payload;
  },
  failureForSingleScholarship(state, action) {
    state.scholarship = null;
    state.error = action.payload;
    state.loading = false;
  },
  clearAllErrors(state) {
    state.error = null;
  },
  resetScholarshipSlice(state) {
    state.error = null;
    state.scholarships = [];
    state.loading = false;
    state.message = null;
    state.scholarship = null;
    state.latestScholarships = []; 
  },
  successForAllScholarships(state, action) {
    state.loading = false;
    state.scholarships = action.payload.scholarships;
    state.currentPage = action.payload.currentPage;
    state.totalPages = action.payload.totalPages;
    state.totalScholarships = action.payload.totalScholarships;
  },
  requestLatestScholarships(state) {
    state.loading = true;
    state.error = null;
  },
  successLatestScholarships(state, action) {
    state.loading = false;
    state.error = null;
    state.latestScholarships = action.payload.scholarships;
  },
  failureLatestScholarships(state, action) {
    state.loading = false;
    state.error = action.payload;
    state.latestScholarships = [];
  }
 },
});

/*export const fetchScholarships = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(scholarshipSlice.actions.requestForAllScholarships());
        let link = `/api/scholarships/?`;
        let queryParams = [`page=${page}`];
    
        if (searchKeyword) {
            queryParams.push(`searchKeyword=${(searchKeyword)}`);
        }
    
        link += queryParams.join("&");
        const { data } = await axios.get(link, { withCredentials: true });
        
        dispatch(scholarshipSlice.actions.successForAllScholarships(data));
        dispatch(scholarshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(scholarshipSlice.actions.failureForAllScholarships(error.response?.data?.message || "Failed to fetch scholarships"));
    }
};


export const fetchSingleScholarship = (scholarshipId) => async (dispatch) => {
  dispatch(scholarshipSlice.actions.requestForSingleScholarship());
  try {
    const response = await axios.get(
      `/api/scholarships/${scholarshipId}`,
      { withCredentials: true }
    );
    dispatch(scholarshipSlice.actions.successForSingleScholarship(response.data.scholarship));
  } catch (error) {
    dispatch(scholarshipSlice.actions.failureForSingleScholarship(error.response?.data?.message || "Failed to fetch scholarship"));
  }
};*/

export const clearAllScholarshipErrors = () => (dispatch) => {
    dispatch(scholarshipSlice.actions.clearAllErrors());
};

export const resetScholarshipSlice = () => (dispatch) => {
    dispatch(scholarshipSlice.actions.resetScholarshipSlice());
};

export const fetchLatestScholarships = () => async (dispatch) => {
  try {
    dispatch(scholarshipSlice.actions.requestLatestScholarships());
    const { data } = await axios.get(
      `/api/scholarships/latest`,
      { withCredentials: true }
    );
    dispatch(scholarshipSlice.actions.successLatestScholarships(data));
  } catch (error) {
    dispatch(
      scholarshipSlice.actions.failureLatestScholarships(
        error.response?.data?.message || "Failed to fetch latest scholarships"
      )
    );
  }
};

/*export const deleteScholarship = (id) => async (dispatch) => {
    try {
        dispatch(scholarshipSlice.actions.deleteScholarshipRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/${id}`, { withCredentials: true });
        dispatch(scholarshipSlice.actions.deleteScholarshipSuccess({ message: response.data.message, id }));
    } catch (error) {
        dispatch(scholarshipSlice.actions.deleteScholarshipFailed(error.response?.data?.message || "Failed to delete scholarship"));
    }
};

export const updateScholarship = (scholarshipId, updatedData) => async (dispatch) => {
  try {
    dispatch(scholarshipSlice.actions.updateScholarshipRequest());
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/update/${scholarshipId}`,
      updatedData,
      { withCredentials: true }
    );
    dispatch(scholarshipSlice.actions.updateScholarshipSuccess(response.data));
  } catch (error) {
    dispatch(scholarshipSlice.actions.updateScholarshipFailed(error.response.data.message));
  }
};*/

export const { clearErrors } = scholarshipSlice.actions;
export default scholarshipSlice.reducer;
