import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const admitCardSlice = createSlice({
    name: "admitcards",
    initialState: {
        admitcards: [],
        admitcard: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalAdmitCards: 0,
        latestAdmitCards: [],
        message: null
    },
    reducers: {
        requestStarted(state) {
            state.loading = true;
            state.error = null;
        },
        requestFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getAdmitCardsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admitcards = action.payload.admitcards;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalAdmitCards = action.payload.totalAdmitCards;
        },
        getSingleAdmitCardSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admitcard = action.payload.admitcard;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetAdmitCard(state) {
            state.admitcard = null;
            state.latestAdmitCards = [];
        },
        requestLatestAdmitCards(state) {
            state.loading = true;
            state.error = null;
        },
        successLatestAdmitCards(state, action) {
            state.loading = false;
            state.error = null;
            state.latestAdmitCards = action.payload.admitCards;
        },
        failureLatestAdmitCards(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.latestAdmitCards = [];
        },
        clearMessage(state) {
            state.message = null;
        }
    },
});

/*export const fetchAdmitCards = (searchKeyword = "", organization = "", status = "", page = 1) => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.requestStarted());
        let link = `/api/admitcards/?`;
        
        if (searchKeyword) {
            link += `&searchKeyword=${searchKeyword}`;
        }
        if (organization) {
            link += `&organization=${organization}`;
        }
        if (status) {
            link += `&status=${status}`;
        }
        const response = await axios.get(link, { withCredentials: true });
        dispatch(admitCardSlice.actions.getAdmitCardsSuccess(response.data));
    } catch (error) {
        dispatch(admitCardSlice.actions.requestFailed(error.response.data.message));
    }
};

export const fetchSingleAdmitCard = (id) => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.requestStarted());
        const response = await axios.get(`/api/admitcards/${id}`, {
            withCredentials: true
        });
        dispatch(admitCardSlice.actions.getSingleAdmitCardSuccess(response.data));
    } catch (error) {
        dispatch(admitCardSlice.actions.requestFailed(error.response.data.message));
    }
};*/

export const clearAdmitCardErrors = () => async (dispatch) => {
    dispatch(admitCardSlice.actions.clearErrors());
};

export const resetAdmitCardDetails = () => async (dispatch) => {
    dispatch(admitCardSlice.actions.resetAdmitCard());
};

export const fetchLatestAdmitCards = () => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.requestLatestAdmitCards());
        const { data } = await axios.get(
            `/api/admitcards/latest`,
            { withCredentials: true }
        );
        dispatch(admitCardSlice.actions.successLatestAdmitCards(data));
    } catch (error) {
        dispatch(
            admitCardSlice.actions.failureLatestAdmitCards(
                error.response?.data?.message || "Failed to fetch latest admit cards"
            )
        );
    }
};

export const { clearMessage } = admitCardSlice.actions;
export default admitCardSlice.reducer;