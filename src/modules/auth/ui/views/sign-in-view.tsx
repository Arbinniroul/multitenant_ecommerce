"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginSchema } from '../Schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { trpc } from '@/trpc/server'
import { useTRPC } from '@/trpc/client'
const poppins =Poppins({
  subsets:["latin"],
  weight:["700"]
})



const SignInView = () => {
  const router=useRouter();
  const form =useForm<z.infer <typeof loginSchema>>({
    mode:"all",
    resolver:zodResolver(loginSchema),
    defaultValues:{
      email:"",
      password:"",
    },
  })

const onSubmit=(values:z.infer <typeof loginSchema>)=>{
  console.log(values)
  login.mutate(values);
}
const trpc=useTRPC();
const queryClient=useQueryClient();
const login=useMutation(trpc.auth.login.mutationOptions({

   
    
  onError:(error)=>{
  toast.error(error.message)
},
onSuccess:async()=>{
 await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
  router.push("/");
}
}));

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5'>
        <div className='bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto'>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8 lg:p-16 p-4'>
              <div className='flex items-center justify-between mb-8'>
                <Link href={'/'}>
                <span className={cn('text-2xl font-semibold',poppins.className)}>
                  funroad
                </span>
                </Link>
                <Button asChild variant={'ghost'} size={'sm'} className='text-base border-none underline'>
                  <Link prefetch href={'/sign-up'}>
                  Sign Up
                  </Link>

                </Button>

              </div>
              <h1 className='text-4xl font-medium'>
                Welcome back to funroad

              </h1>
            
 <FormField name='email' render={({field})=>(
                <FormItem>
                  <FormLabel className='text-base'>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
               
                  <FormMessage/>
                </FormItem>
              )


            }/>
             <FormField name='password' render={({field})=>(
                <FormItem>
                  <FormLabel className='text-base'>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type='password'/>
                  </FormControl>
               
                  <FormMessage/>
                </FormItem>
              )


            }/>




          <Button
          disabled={login.isPending}
          type='submit'
          size='lg'
          variant='elevated'
          className='bg-black text-white hover:bg-pink-400 hover:text-primary'
          >
            Login
          </Button>

            </form>

           </Form>

        </div>
        <div className='h-screen w-full lg:col-span-2 hidden lg:block' style={{backgroundImage:"url('authPage.png')",
          backgroundPosition:'center',
          backgroundSize:'cover'
        }} />
    </div>
  )
}


export default SignInView