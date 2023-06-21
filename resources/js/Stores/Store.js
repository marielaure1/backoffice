import { createSlice, configureStore } from '@reduxjs/toolkit'

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    value: 0,
    token: "",
    isLogged: false
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isLogged = true;
    },
    loginFail: (state, action) => {
      console.log(action.payload);
      state.isLogged = false;
      state.token = "";
    },
    registerSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isLogged = true;
    },
    registerFail: (state, action) => {
      console.log(action.payload);
      state.isLogged = false;
      state.token = "";
    }
  }
})

export const { loginSuccess, loginFail, registerSuccess, registerFail } = apiSlice.actions

const store = configureStore({
  reducer: apiSlice.reducer
})

export default store
