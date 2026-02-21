import authReducer from './auth-slice'
import tagsReducer from './people/tags-slice'
import peopleReducer from './people/people-slice';
import dashboardReducer from './people/dashboard-slice';
import analyticsReducer from './people/analytics-slice';
import { configureStore } from '@reduxjs/toolkit';



const store = configureStore({
    reducer: {
        auth: authReducer,
        tags: tagsReducer,
        people: peopleReducer,
        dashboard: dashboardReducer,
        analytics: analyticsReducer,
    },
});

export default store;