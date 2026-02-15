import authReducer from './auth-slice'
import tagsReducer from './people/tags-slice'
import peopleReducer from './people/people-slice';
import { configureStore } from '@reduxjs/toolkit';



const store = configureStore({
    reducer: {
        auth: authReducer,
        tags: tagsReducer,
        people: peopleReducer,
    },
});

export default store;