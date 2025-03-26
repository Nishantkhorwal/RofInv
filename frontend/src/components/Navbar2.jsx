import React, { useState, useEffect, useRef } from 'react'
import { FaPhoneVolume } from "react-icons/fa6";
import { MdPhoneInTalk } from "react-icons/md";
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { RxCross2 } from "react-icons/rx";

import { LuMoveRight } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";


function Navbar() {
  const [menuNavOpen, setMenuNavOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => setDropdown(!dropdown);


  const toggleNavMenu = () => {
    setMenuNavOpen(!menuNavOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Adjust this value to your desired scroll distance
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };



  return (
    <>
      <div id='home'>
        <div className="flex flex-col h-screen lg:block relative">



          <img src="images2/sukoon4.png" className="h-full w-full absolute object-cover brightness-90 inset-0 lg:object-fill" alt="Background" />

          {/* Navbar */}
          <div className={`flex flex-row justify-between lg:justify-start ${isScrolled ? "fixed top-0 left-0 w-full bg-black lg:bg-black shadow-lg" : "relative bg-black lg:bg-black"} z-50 py-6 px-5 lg:px-20 items-center transition-all duration-300`}>
            <div className='lg:me-32'>
              <img src="images2/sukoonWhiteLogo.png" alt="Logo" className=' w-20 lg:w-32' />
            </div>
            <div className="hidden lg:block">
              <ul className="flex flex-row text-sm text-white poppins space-x-8">
                <a href='/linkpage'><li className='cursor-pointer'>Home</li></a>
                <a href='#about'><li className='cursor-pointer'>About</li></a>

                <a href='#location'><li className='cursor-pointer'>Location</li></a>
                <a href='#amenities'><li className='cursor-pointer'>Amenities</li></a>
                <a href='#club'><li className='cursor-pointer'>Club</li></a>
                <a href='#sitemap'><li className='cursor-pointer'>Site Plan</li></a>
                <a href='#locationmap'><li className='cursor-pointer'>Location Map</li></a>
                <a href={localStorage.getItem("role") === "admin" ? "/sidebar" : "/home"}>
                  <li className='cursor-pointer'>Inventory</li>
                </a>
                <div className="relative">
                  <li className='flex justify-between cursor-pointer items-center' onClick={toggleDropdown}>
                    <p className='me-2  '>Download</p> <MdKeyboardArrowDown />
                  </li>


                  {/* Dropdown Content */}
                  {dropdown && (
                    <ul className="bg-white rounded-md shadow-md text-black w-48 absolute mt-2 py-2">
                      <a href='images2/SitePlan4.jpg' download>
                        <li className="cursor-pointer hover:bg-gray-100 px-4 py-2" >
                          Site Plan
                        </li>
                      </a>
                      <a href='images2/locationMap2.jpg' download>
                        <li className="cursor-pointer hover:bg-gray-100 px-4 py-2" >
                          Location Map
                        </li>
                      </a>
                    </ul>
                  )}
                </div>
              </ul>
            </div>
            <div className="lg:hidden">
              <HiOutlineMenuAlt3 className="text-3xl text-white cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          {/* Navbar Ends Here */}

          {/* Sliding Menu */}
          <div className={`fixed top-0 right-0 h-screen w-3/4 bg-white z-50 transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <RxCross2 onClick={toggleMenu} className='text-lg absolute  right-4 top-4' />
            <ul className="flex flex-col p-6 text-black lg:space-y-4">
              <a href='/linkpage'><li className='cursor-pointer'>Home</li></a>
              <a href='#about'><li className='cursor-pointer'>About</li></a>

              <a href='#location'><li className='cursor-pointer'>Location</li></a>
              <a href='#amenities'><li className='cursor-pointer'>Amenities</li></a>
              <a href='#club'><li className='cursor-pointer'>Club</li></a>
              <a href='#sitemap'><li className='cursor-pointer'>Site Plan</li></a>
              <a href='#locationmap'><li className='cursor-pointer'>Location Map</li></a>
              <a href={localStorage.getItem("role") === "admin" ? "/sidebar" : "/home"}>
                <li className='cursor-pointer'>Inventory</li>
              </a>

              <li>
                <div className="relative">
                  <li className='flex justify-between cursor-pointer items-center' onClick={toggleDropdown}>
                    <p className='lg:me-2  '>Download</p> <MdKeyboardArrowDown className='' />
                  </li>


                  {/* Dropdown Content */}
                  {dropdown && (
                    <ul className="bg-white rounded-md shadow-md text-black w-48 absolute mt-2 py-2">
                      <a href='images2/SitePlan4.jpg' download>
                        <li className="cursor-pointer hover:bg-gray-100 px-4 py-2" >
                          Site Plan
                        </li>
                      </a>
                      <a href='images2/locationMap2.jpg' download>
                        <li className="cursor-pointer hover:bg-gray-100 px-4 py-2" >
                          Location Map
                        </li>
                      </a>
                    </ul>
                  )}
                </div>

              </li>
            </ul>
          </div>

          {/* Buttons at the bottom of the header */}
          <div className="flex flex-row justify-end w-full absolute bottom-10 px-20 space-x-6 transform">
            <a href="images2/brochure.pdf" download >
              <button className="flex bg-white shadow-md font-normal items-center px-10 py-2">
                <span className="text-sm font-semibold poppins">Download Brochure</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;






