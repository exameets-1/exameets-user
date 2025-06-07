import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const teamSlice = createSlice({
    name: "teams",
    initialState: {
        teams: [],
        team: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalTeams: 0
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
        getTeamsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.teams = action.payload.teams;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalTeams = action.payload.totalTeams;
        },
        getSingleTeamSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.team = action.payload.team;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetTeam(state) {
            state.error = null;
            state.team = null;
        },
        deleteTeamRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteTeamSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.teams = state.teams.filter(team => team._id !== action.payload.id);
        },
        deleteTeamFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

/*export const fetchTeams = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.requestStarted());
        let link = `api/teams?`;
        
        if (searchKeyword) {
            link += `&searchKeyword=${searchKeyword}`;
        }

        const response = await axios.get(link, { withCredentials: true });
        dispatch(teamSlice.actions.getTeamsSuccess(response.data));
    } catch (error) {
        dispatch(teamSlice.actions.requestFailed(error.response.data.message));
    }
};

export const fetchSingleTeam = (id) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.requestStarted());
        const response = await axios.get(`/api/teams/${id}`, {
            withCredentials: true
        });
        dispatch(teamSlice.actions.getSingleTeamSuccess(response.data));
    } catch (error) {
        dispatch(teamSlice.actions.requestFailed(error.response.data.message));
    }
};


export const deleteTeam = (id) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.deleteTeamRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/team/${id}`, { withCredentials: true });
        dispatch(teamSlice.actions.deleteTeamSuccess({ message: response.data.message, id }));
        } catch (error) {
            dispatch(teamSlice.actions.deleteTeamFailed(error.response?.data?.message || "Failed to delete team"));
            // toast.error(error.response?.data?.message || "Failed to delete team");
            }
            };*/
            export const clearTeamErrors = () => async (dispatch) => {
                dispatch(teamSlice.actions.clearErrors());
            };
            
            export const resetTeamDetails = () => async (dispatch) => {
                dispatch(teamSlice.actions.resetTeam());
            };
            
            export default teamSlice.reducer;
