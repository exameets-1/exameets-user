import { createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const internshipSlice = createSlice({
  name: "internships",
  initialState: {
    internships: [],
    loading: false,         
    error: null,
    message: null,
    internship: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalInternships: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      limit: 8
    },
    latestInternships: [], 
  },
  reducers: {
    requestForAllInternships(state) {
    state.loading = true;
    state.error = null;
  },
  failureForAllInternships(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  requestForSingleInternship(state) {
    state.message = null;
    state.error = null;
    state.loading = true;
  },  
  successForSingleInternship(state, action) {
    state.loading = false;
    state.error = null;
    state.internship = action.payload;
  },
  failureForSingleInternship(state, action) {
    state.internship = null;
    state.error = action.payload;
    state.loading = false;
  },
  clearAllErrors(state) {
    state.error = null;
    state.internships;
  },
  resetInternshipSlice(state) {
    state.error = null;
    state.internships = [];
    state.loading = false;
    state.message = null;
    state.internship = null;
    state.latestInternships = []; 
  },
  successForAllInternships(state, action) {
    state.loading = false;
    state.internships = action.payload.internships;
    state.pagination = action.payload.pagination;
  },
  requestLatestInternships(state) {
    state.loading = true;
    state.error = null;
  },
  successLatestInternships(state, action) {
    state.loading = false;
    state.error = null;
    state.latestInternships = action.payload.internships;
  },
  failureLatestInternships(state, action) {
    state.loading = false;
    state.error = action.payload;
    state.latestInternships = [];
  },
  clearError: (state) => {
    state.error = null;
  },
  clearMessage: (state) => {
    state.message = null;
  },
},
});

/*export const fetchInternships = (city = "All", internship_type = "All", searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(internshipSlice.actions.requestForAllInternships());
        let link =`/api/internships?`;
        let queryParams = [`page=${page}`];
    
        if (city && city !== "All") {
            queryParams.push(`city=${encodeURIComponent(city)}`);
        }
        
        if (internship_type && internship_type !== "All") {
            queryParams.push(`internship_type=${encodeURIComponent(internship_type)}`);
        }
        
        if (searchKeyword) {
            queryParams.push(`searchKeyword=${encodeURIComponent(searchKeyword)}`);
        }
    
        link += queryParams.join("&");
        
        const response = await axios.get(link, { withCredentials: true });
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch internships");
        }
        
        dispatch(internshipSlice.actions.successForAllInternships({
            internships: response.data.internships,
            pagination: response.data.pagination
        }));
        dispatch(internshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(internshipSlice.actions.failureForAllInternships(
            error.response?.data?.message || error.message || "Failed to fetch internships"
        ));
    }
};
/*
export const fetchInternship_old = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(internshipSlice.actions.requestForAllInternships());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/getall?`;
        let queryParams = [`page=${page}`];
    
        if (searchKeyword) {
            queryParams.push(`searchKeyword=${encodeURIComponent(searchKeyword)}`);
        }
    
        link += queryParams.join("&");
        const response = await axios.get(link, { withCredentials: true });
        
        dispatch(internshipSlice.actions.successForAllInternships({
            internships: response.data.internships,
            pagination: response.data.pagination
        }));
        dispatch(internshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(internshipSlice.actions.failureForAllInternships(error.response?.data?.message || "Failed to fetch internships"));
    }
};*/

/*export const fetchSingleInternship = (internshipId) => async (dispatch) => {
    dispatch(internshipSlice.actions.requestForSingleInternship());
    try {
        const response = await axios.get(`/api/internships/${internshipId}`, { withCredentials: true });
        dispatch(internshipSlice.actions.successForSingleInternship(response.data.internship));
        dispatch(internshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(internshipSlice.actions.failureForSingleInternship(error.response.data.message));
    }
};*/

export const clearAllInternshipErrors = () => (dispatch) => {
    dispatch(internshipSlice.actions.clearAllErrors());
};

export const resetInternshipSlice = () => (dispatch) => {
    dispatch(internshipSlice.actions.resetInternshipSlice());
};

export const fetchLatestInternships = () => async (dispatch) => {
  try {
    dispatch(internshipSlice.actions.requestLatestInternships());
    const { data } = await axios.get(
      `/api/internships/latest`
    );
    dispatch(internshipSlice.actions.successLatestInternships(data));
  } catch (error) {
    dispatch(
      internshipSlice.actions.failureLatestInternships(
        error.response?.data?.message || "Failed to fetch latest internships"
      )
    );
  }
};

export const { clearError, clearMessage } = internshipSlice.actions;
export default internshipSlice.reducer;
