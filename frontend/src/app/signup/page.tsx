"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import {GoogleIcon} from '../../assets/svg/icon'
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegisterUserMutation } from '@/redux/api/userApi'

const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be atleast 6 character")
})

type SignUpFormValues = z.infer<typeof signUpSchema>

const Signup = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  const onSubmit = async (data: any) => {
    try {
      await registerUser(data).unwrap()
    } catch (error) {
      console.log(error);
    }
  }

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <div className='flex-1 bg-red-500'>left</div>
      <div className='flex-1 flex justify-center items-center'>
        <div className=' flex flex-col gap-4 w-1/2'>
          <div className='text-3xl font-semibold'>Create an account</div>
          <div className='font-semibold'>Enter your details below</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
              <FormField control={form.control} name="name" render={
                ({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='name' {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )
              } />
              <FormField control={form.control} name="email" render={
                ({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type='email' placeholder='email' {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )
              } />
              <FormField control={form.control} name="password" render={
                ({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type='password' placeholder='password' {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )
              } />
              <Button type='submit' className='w-full'>{isLoading ? 'Creating Account...' : 'Create Account'}</Button>
            </form>
            <Button className="w-full py-3 rounded-lg shadow-md">
              <span className="flex items-center gap-2 justify-center">
                <GoogleIcon />
                <span>Sign up with Google</span>
              </span>
            </Button>
            <div className='flex justify-center items-center gap-2'>
              <span>
                Already have account?
              </span>
              <Link href="/login" className='relative group'>
                <span className='relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#DB4444] before:transition-all group-hover:before:w-full'>Log in</span>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Signup