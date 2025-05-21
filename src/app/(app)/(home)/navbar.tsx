"use client"

import React, { useState } from 'react'
import { Poppins } from 'next/font/google'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { NavbarSidebar } from './navbar-sidebar'
import { MenuIcon } from 'lucide-react'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
const poppins =Poppins({
    subsets:["latin"],
    weight:["700"]
})
interface navbarItemProps{
    href:string,
    children:React.ReactNode,
    isActive?:boolean
}
const NavbarItems=({href,children,isActive}:navbarItemProps)=>{
    return(
        <Button asChild variant={'outline'} className={cn("bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",isActive &&"bg-black text-white hover:bg-black hover:text-white")}>
        <Link href={href}>
        {children}
        </Link>
        </Button>
    )
}

const navbarItems=[
    {href:'/',children:'Home'},
    {href:'/about',children:'About'},
    {href:'/features',children:'Features'},
    {href:'/pricing',children:'Pricing'},
    {href:'/contact',children:'Contact'},
]
export const Navbar = () => {
    const trpc=useTRPC();
    const session=useQuery(trpc.auth.session.queryOptions())
    const pathname=usePathname();
    const [isSidebarOpen,setIsSideBarOpen]=useState(false);
  return (
    <nav className='h-20 flex border-b justify-between font-medium bg-white'>
     <Link href={'/'} className='p-6 flex items-center'>
     <span className={cn("text-5xl font-semibold",poppins.className)}>
        funroad
     </span>
     </Link>
     <NavbarSidebar open={isSidebarOpen} onOpenChange={setIsSideBarOpen} items={navbarItems}/>

     <div className='items-center gap-4 hidden lg:flex'>
        {
            navbarItems.map((items)=>
            <NavbarItems href={items.href} key={items.href} isActive={pathname===items.href} >{items.children}</NavbarItems>)
        }

     </div>
   {
    session.data?.user? (
    <div className='hidden lg:flex'>
            <Button asChild variant={'secondary'} className='border-l borderr-t-0 border-b-0 bg-black border-r-0 px-12 h-full text-white rounded-none  hover:text-black transition-colors text-lg'>
            <Link  href={'/admin'}>Dashboard</Link>
        </Button>

    </div>):( <div className='hidden lg:flex'>
        <Button asChild variant={'secondary'} className='border-l borderr-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-500 transition-colors text-lg'>
            <Link  prefetch  href={'/sign-in'}>Log in</Link>
        </Button>
        <Button asChild variant={'secondary'} className='border-l borderr-t-0 border-b-0 bg-black border-r-0 px-12 h-full text-white rounded-none  hover:text-black transition-colors text-lg'>
            <Link prefetch href={'/sign-up'}>Start Selling</Link>
        </Button>


     </div>)
   }

     <div className='flex lg:hidden items-center justify-center'>
        <Button variant={'ghost'} className='size-12 border-transparent  bg-white' onClick={()=>setIsSideBarOpen(true)}><MenuIcon/></Button>

     </div>
    </nav>
  )
}

