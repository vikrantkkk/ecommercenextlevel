import Link from 'next/link';
import React from 'react';
import { Input } from "@/components/ui/input";
import { Heart, Search, ShoppingCart, User } from 'lucide-react';

const Header = () => {
    return (
        <header className='flex flex-wrap justify-between px-20 py-6 items-center border-b shadow-sm bg-white'>
            <div className='flex justify-center items-center space-x-10'>
                <div className='text-2xl font-bold'>Exclusive</div>
                <nav className='flex gap-6'>
                    <Link href="/" className="relative group">
                        <span className="relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#DB4444] before:transition-all group-hover:before:w-full">Home</span>
                    </Link>
                    <Link href="/contact" className='relative group'>
                        <span className='relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#DB4444] before:transition-all group-hover:before:w-full'>Contact</span>
                    </Link>
                    <Link href="/about" className='relative group'>
                        <span className='relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#DB4444] before:transition-all group-hover:before:w-full'>About</span>
                    </Link>
                    <Link href="/signup" className='relative group'>
                        <span className='relative before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#DB4444] before:transition-all group-hover:before:w-full'>Sign Up</span>
                    </Link>
                </nav>
            </div>

          
            <div className='flex space-x-4 items-center'>
                <div className="relative w-80">
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:border-gray-500 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-label="Search" />
                </div>
                <div className='p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer' aria-label="Favorites">
                    <Heart className='text-gray-500 hover:text-[#DB4444]' />
                </div>
                <div className='p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer' aria-label="Shopping Cart">
                    <ShoppingCart className='text-gray-500 hover:text-[#DB4444]' />
                </div>
                <div className="p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer" aria-label="User Profile">
                    <User className="text-gray-500 hover:text-[#DB4444]" size={24} />
                </div>
            </div>
        </header>
    );
}

export default Header;
