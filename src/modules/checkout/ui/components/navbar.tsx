"use client"
import { Button } from '@/components/ui/button'
import { generateTenateURL } from '@/lib/utils'


import Link from 'next/link'
import React from 'react'


interface NavbarProps {
    slug: string
}
export const Navbar = ({ slug }: NavbarProps) => {
  
    return (
        <nav className='h-20 border-b font-medium bg-white'>
            <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full  lg:px-12'>
               <p className='text-xl'>Checkout</p>
               <Button
               variant={"elevated"}
               asChild
               >
                <Link href={`${generateTenateURL(slug)}`}>
                Continue Shopping

                </Link>
               </Button>


            </div>
        </nav>
    )
}