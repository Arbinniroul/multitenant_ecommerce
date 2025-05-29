"use client"
import { generateTenateURL } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

const CheckOutbutton=dynamic(()=>import('@/modules/checkout/ui/components/checkout-button').then((mod)=>mod.CheckOutbutton),{ssr:false,loading:()=><Button disabled className=' bg-white'><ShoppingCart className='text-black'
/></Button>})

interface NavbarProps {
    slug: string
}
export const Navbar = ({ slug }: NavbarProps) => {
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }))
    return (
        <nav className='h-20 border-b font-medium bg-white'>
            <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full  lg:px-12'>
                <Link href={generateTenateURL(slug)} className='flex items-center gap-2'>
                 {
                    data?.image?.url &&(
                        <Image src={data?.image?.url} width={32} height={32} className=' rounded-full border shrink-0 size-[32px]' alt={data.slug}/>

                    )
                 }
                    <p className='text-xl'>

                        {data.name}
                    </p>

                </Link>
                <CheckOutbutton tenantSlug={slug} hideIfEmpty/>


            </div>
        </nav>
    )
}
export const NavbarSkeleton = () => {

    return (
        <nav className='h-20 border-b font-medium bg-white'>
            <div className='max-w-(-breakpoint-xl) mx-auto flex justify-between items-center h-full  lg:px-12'>
             
                <p className='text-xl animate-pulse bg-gray-200 w-20 h-6 rounded'></p>
            </div>
        </nav>
    )
}

