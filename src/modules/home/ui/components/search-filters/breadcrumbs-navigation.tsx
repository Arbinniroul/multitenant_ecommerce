import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

import React from 'react'


interface Props{
    activeCategory?:string|null;
    activeCategoryName?:string|null;
    activeSubcategoryName?:string|null

}
const BreadCrumbNavigation = ({activeCategory,activeCategoryName,activeSubcategoryName}:Props) => {
    if(!activeCategoryName||activeCategory=="all") return null;

  return (
    <Breadcrumb>
    <BreadcrumbList>
    {
        activeSubcategoryName ?(
            <>
            <BreadcrumbItem>
            <BreadcrumbLink asChild className='text-xl font-medium underline text-primary'>
                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='text-primary font-medium text-xl'>
            /
            </BreadcrumbSeparator>
                     <BreadcrumbItem>
            <BreadcrumbPage  className='text-xl font-medium '>
                    {activeSubcategoryName}
            </BreadcrumbPage>
            </BreadcrumbItem>
            </>
        ):( 
        
        <BreadcrumbItem>
            <BreadcrumbPage  className='text-xl font-medium underline text-primary'>
                    {activeCategoryName}

            </BreadcrumbPage>
        </BreadcrumbItem>


           )
    }
    </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumbNavigation