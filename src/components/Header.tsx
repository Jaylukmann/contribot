import Link from 'next/link'
import ConnectWallet from './ConnectWallet'
import React from "react";
function Header() {
  return (
  <header className='header'>
 
    <div className='pt-0'>
        <Link href="/"><img className='rounded-full w-10 h-10' src="/img/logo1.jfif" alt="Contribot logo" /></Link> 
          </div>

      <ul className='flex space-x-16 justify-content  font-dm text-[16px] font-semibold ml-900 pl-[50px]
        '>
          <li className=''>
            <Link href="/">Home</Link>
          </li>
          <li className=''>
            <Link href="/about">About</Link>
          </li>
          <li className=''>
            <Link href="/blog/hello-world">Blog</Link>
          </li>
          <li className=''>
            <Link href="/blog/hello-world">Community</Link>
          </li>
          <li className=''>
            <Link href="/blog/hello-world">Contact</Link>
          </li>
          <div className='px-10 py-2 border-[#5127DA] border-2 rounded-full cursor-pointer'>
            <ConnectWallet />
          </div>
        </ul>
        
    </header>
    
  )
}
        

export default Header;