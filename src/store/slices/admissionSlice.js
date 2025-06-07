import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const admissionSlice = createSlice({
    name: "admissions",
    initialState: {
        admissions: [],
        loading: false,
        error: null,
        message: null,
        singleAdmission: {},
        currentPage : 1,
        totalPages : 1,
        totalAdmissions : 0,
        latestAdmissions: [],
    },
    reducers: {
        requestForAllAdmissions(state) {
            state.loading = true;
            state.error = null;
        },
        successForAllAdmissions(state, action) {
            state.loading = false;
            state.error = null;
            state.admissions = action.payload.admissions || [];
            state.currentPage = action.payload.currentPage || 1;
            state.totalPages = action.payload.totalPages || 1;
            state.totalAdmissions = action.payload.totalAdmissions || 0;
        },
        failureForAllAdmissions(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        requestForSingleAdmission(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        successForSingleAdmission(state, action) {
            state.loading = false;
            state.error = null;
            state.singleAdmission = action.payload;
        },
        failureForSingleAdmission(state, action) {
            state.singleAdmission;
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors(state) {
            state.error = null;
            state.loading = false;
        },
        resetAdmission(state) {
            state.admission = null;
            state.latestAdmissions = [];
        },
        requestLatestAdmissions(state) {
            state.loading = true;
            state.error = null;
        },
        successLatestAdmissions(state, action) {
            state.loading = false;
            state.error = null;
            state.latestAdmissions = action.payload.admissions;
        },
        failureLatestAdmissions(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.latestAdmissions = [];
        }
    },
});

/*export const fetchAdmissions = ({ searchKeyword = "", category = "All", location = "All", page = 1, sortBy = "last_date", sortOrder = "asc", showActiveOnly = false }) => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.requestForAllAdmissions());

        let url = `/api/admissions/?`;
        const params = [`page=${page}`]

        if (searchKeyword) params.push("searchKeyword", searchKeyword);
        if (category !== "All") params.push("category", category);
        if (location !== "All") params.push("location", location);
        if (page) params.push("page", page);
        if (sortBy) params.push("sortBy", sortBy);
        if (sortOrder) params.push("sortOrder", sortOrder);
        params.push("showActiveOnly", showActiveOnly);

        url += params.toString();

        const { data } = await axios.get(url, { withCredentials: true });

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch admissions");
        }

        dispatch(admissionSlice.actions.successForAllAdmissions(data));
    } catch (error) {
        dispatch(admissionSlice.actions.failureForAllAdmissions(
            error.response?.data?.message || error.message || "Failed to fetch admissions"
        ));
    }
};

export const fetchSingleAdmission = (id) => async (dispatch) => {
    dispatch(admissionSlice.actions.requestForSingleAdmission());
    try {
        const response = await axios.get(`/api/admissions/${id}`, {
            withCredentials: true
        });
        dispatch(admissionSlice.actions.successForSingleAdmission(response.data.admission));
    } catch (error) {
        dispatch(admissionSlice.actions.failureForSingleAdmission(error.response?.data?.message || "Failed to fetch admission"));
    }
};*/

export const clearAdmissionErrors = () => async (dispatch) => {
    dispatch(admissionSlice.actions.clearErrors());
};

export const resetAdmissionDetails = () => async (dispatch) => {
    dispatch(admissionSlice.actions.resetAdmission());
};

export const fetchLatestAdmissions = () => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.requestLatestAdmissions());
        const { data } = await axios.get(
            `/api/admissions/latest`,
            { withCredentials: true }
        );
        dispatch(admissionSlice.actions.successLatestAdmissions(data));
    } catch (error) {
        dispatch(
            admissionSlice.actions.failureLatestAdmissions(
                error.response?.data?.message || "Failed to fetch latest admissions"
            )
        );
    }
};

export const {clearErrors} = admissionSlice.actions;
export default admissionSlice.reducer;