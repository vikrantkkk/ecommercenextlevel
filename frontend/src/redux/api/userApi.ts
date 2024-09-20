import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = "http://localhost:5000/api/v1/user/";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
interface LoginPayload {
  name: string;
  password: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include", // Include credentials for cookies if required

  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, RegisterPayload>({
      query: (payload) => ({
        url: "/signup",
        method: "POST",
        body: payload,
      }),
    }),
    loginUser: builder.mutation<User, LoginPayload>({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = userApi;
