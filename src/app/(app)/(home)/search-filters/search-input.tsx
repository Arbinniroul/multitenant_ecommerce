interface Props{
    disabled?:boolean
}
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'

const SearchInput = ({disabled}:Props) => {
  return (
    <div className='items-center gap-2 w-full '>
       <div className='relative w-full'>
        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500'/>
        <Input className='pl-8 '    placeholder='Search Products' disabled={disabled}/>

       </div>
       {/* TODO Add category button */}
       {/* TODO Add Library button */}
    </div>
  )
}

export default SearchInput