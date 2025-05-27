"use client"
import { generateTenateURL } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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
                        <Image src={data.image.url} width={32} height={32} className=' rounded-full border shrink-0 size-[32px]' alt={data.slug}/>

                    )
                 }
                    <p className='text-xl'>

                        {data.name}
                    </p>

                </Link>


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

