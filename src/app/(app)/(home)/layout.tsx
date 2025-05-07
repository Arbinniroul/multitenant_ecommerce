"use client"
import React from 'react'
import { Navbar } from './navbar';
import Footer from './footer';

 interface layoutProps{
    children:React.ReactNode;
 }
const Layout = ({children}:layoutProps) => {
  return (
    <div className='flex flex-col min-h-screen '>
        <Navbar/>
        <div className='flex-1 bg-[#f4f4f0]'>
        {children}

        </div>
        <Footer/>
        </div>
  )
}

export default Layout