
import React from 'react'
import { Navbar } from './navbar';
import Footer from './footer';
import SearchFilters from './search-filters';
import configPromise from "@payload-config";
import { getPayload } from "payload";
import {Category} from "@/payload-types"
 interface layoutProps{
    children:React.ReactNode;
 }
const Layout =async ({children}:layoutProps) => {
    const payload = await getPayload({
        config: configPromise,
      });

      const data = await payload.find({
        collection:"categories",
        depth:1,
        pagination:false,
        where:{
          parent:{
            exists:false,
          }
        }
      })
      const formattedData=data.docs.map((doc)=>
    (  {
        ...doc,
        subcategories:(doc.subcategories?.docs??[]).map((doc)=>({
          ...doc as Category,
          subcategories:undefined,

        }))

      }))
      console.log("formattedData",formattedData)
      console.log("data",data)
  return (
    <div className='flex flex-col min-h-screen '>
        <Navbar/>
        <SearchFilters data={formattedData}/>
        <div className='flex-1 bg-[#f4f4f0]'>
        {children}

        </div>
        <Footer/>
        </div>
  )
}

export default Layout