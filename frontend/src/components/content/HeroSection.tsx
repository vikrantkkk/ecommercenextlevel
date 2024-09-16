import React from 'react'
import gif from '@/assets/png/Hero.png'
import Image from 'next/image'

const HeroSection = () => {
    return (
        <div className='flex flex-col md:flex-row'>

         
            <div className='w-full md:w-1/5 h-auto md:h-[66vh] border-r-2 border-gray-300 flex items-center justify-center'>
                <div className='text-lg font-semibold text-gray-700'>Sidebar</div>
            </div>

         
            <div className='flex-1  py-6 pr-20 pl-6 flex items-center justify-center'>
                <Image
                    src={gif}
                    alt='Hero GIF'
                    width={1200}
                    className='object-cover'
                />
            </div>
        </div>
    )
}

export default HeroSection
