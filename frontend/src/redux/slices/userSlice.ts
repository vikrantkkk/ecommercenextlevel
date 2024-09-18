import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSate {
  data: any;
  loading: boolean;
  error: any;
}
const initialState: UserSate = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
