import authReducer from './auth-slice'
import tagsReducer from './people/tags-slice'
import { configureStore } from '@reduxjs/toolkit';



const store = configureStore({
    reducer: {
        auth: authReducer,
        tags: tagsReducer,
    },
});

export default store;