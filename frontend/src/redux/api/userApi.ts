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

export const userApi = createApi({
  reducerPath: "signup",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, RegisterPayload>({
      query: (payload) => ({
        url: "/signup",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = userApi;
