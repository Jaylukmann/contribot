import React from 'react';
import Link from 'next/link'
import ConnectWallet from './ConnectWallet'
import Image from 'next/image'


function Header() {
  return (
  <header className=' header flex mb-10'>
 
    <div className='pr-[50px] mr-[50px]'>
        <Link href="/"><Image className='rounded-full w-10 h-10' src="/img/logo1.jfif"  width="40" height="40" alt="Contribot logo" /></Link> 
          </div>

      <ul className='flex space-x-36   justify-between  bg-green-800 text-white font-dm text-[16px] font-semibold 
        '>
          <li className=''>
            <Link href="/">Home</Link>
          </li>
          <li className=''>
            <Link href="/about">About</Link>
          </li>
          <li className=''>
            <Link href="/blog">Blog</Link>
          </li>
          <li className=''>
            <Link href="/community">Community</Link>
          </li>
          <li className=''>
            <Link href="/contact">Contact</Link>
          </li>
          <div className='px-10 py-2 border-[#5127DA] border-2 rounded-full cursor-pointer'>
            <ConnectWallet />
          </div>
        </ul>
        
    </header>
    
  )
}
        

export default Header;