"use client"
interface CheckoutItemProps{
    isLast?:boolean;
    imageURL?:string
    name:string;
    productURL:string;
    tenantURL:string;
    tenantName:string;
    price:number;
    onRemove:()=>void
}

import { cn, formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const CheckoutItem = ({isLast,imageURL,name,productURL,tenantURL,tenantName,price,onRemove}:CheckoutItemProps) => {
    
  return (
    <div className={cn("grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b ",isLast && "border-b-0" )}>
        <div className='overflow-hidden border-r'>
            <div className='relative aspect-square h-full '>
                <Image src={imageURL || "/placeholder.png"} alt={`${name}`} fill className='object-cover'/>

            </div>
       

        </div>
         <div className='py-4 flex flex-col justify-between'>
            <div>
                <Link href={productURL}>
                <h4 className='font-bold underline'>
                    {name}
                </h4>
                </Link>
                     <Link href={tenantURL}>
                <p className='font-medium underline'>
                    {tenantName}
                </p>
                </Link>
            </div>

        </div>
        <div className='py-4 flex justify-between flex-col'>
            <p className='font-medium'>
                {formatCurrency(price)}

            </p>
            <button className='underline font-medium ' onClick={onRemove} type='button'>
                Remove

            </button>

        </div>


    </div>
  )
}

export default CheckoutItem