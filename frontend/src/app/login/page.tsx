"use client";

import React from "react";
import {GoogleIcon} from "../../assets/svg/icon";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLoginUserMutation } from "@/redux/api/userApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().min(6, "Password must be atleast 6 character"),
});


type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    console.log("Form data", data);
    const response = await loginUser(data).unwrap()
    dispatch(setUser(response))
  };

  return (
    <>
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 bg-red-500 flex items-center justify-center">
          <p className="text-white text-2xl font-bold">left content</p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className=" flex flex-col gap-6 w-full max-w-md p-8">
            <div>
              <p className="text-4xl font-semibold">Log in to Exclusive</p>
              <p className="text-lg text-gray-600 mt-5">
                Enter your details below
              </p>
            </div>

            {/* Additional login form elements can go here */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage>
                      {form.formState.errors.email?.message}
                    </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage>
                      {form.formState.errors.password?.message}
                    </FormMessage>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full ">
                  Log in
                </Button>
              </form>
              <Button className="w-full py-3 rounded-lg shadow-md">
                <span className="flex items-center gap-2 justify-center">
                  <GoogleIcon />
                  <span>Sign up with Google</span>
                </span>
              </Button>
              <div className="flex justify-center items-center gap-2">
                <span>Don't have an account yet?</span>
                <Link href="/signup" className="relative group">
                  <span className="relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#DB4444] before:transition-all group-hover:before:w-full">
                    Sign Up
                  </span>
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
