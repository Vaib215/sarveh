import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from './reducers';

const store = configureStore({
  reducer: {
    auth: loginReducer,
  },
});

export default store;