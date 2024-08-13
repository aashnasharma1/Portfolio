import React from 'react';
import logo from "./../assets/aashnalogo.png";
// import { FaLinkedIn, FaGithub, FaInstagram } from 'react-icons/fa';
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";



function Navbar() {
  return (
    <div>
      <nav className='mb-20 flex items-center justify-between py-6'>
      <div className='flex flex-shrink-0 items-center'>
        <img src={logo} alt='logo' className='mx-2 w-10'/>
      </div>
      <div className='m-8 flex items-center justify-center gap-4 text-2xl'>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram/>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin/>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaGithub/>
          </a>
        
      </div>
    </nav>
    </div>
    
  )
}

export default Navbar