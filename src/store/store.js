import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import updateProfileReducer from "./slices/updateProfileSlice.js"
import govtJobReducer from './slices/govtJobSlice.js'
import internshipReducer from "./slices/internshipSlice.js";
import previousYearReducer from './slices/previousSlice.js';
import admissionReducer from './slices/admissionSlice.js';
import teamReducer from './slices/teamSlice.js';
import scholarshipReducer from './slices/scholarshipSlice.js';
import admitCardReducer from './slices/admitCardSlice.js';
import resultReducer from './slices/resultSlice.js';
import globalSearchReducer from './slices/globalSearchSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobReducer,
    updateProfile: updateProfileReducer,
    govtJobs : govtJobReducer,
    internships : internshipReducer,
    previousYears : previousYearReducer,
    admissions: admissionReducer,
    team: teamReducer,
    scholarships: scholarshipReducer,
    admitcards: admitCardReducer,
    results: resultReducer,
    globalSearch: globalSearchReducer
  },
});

export default store;