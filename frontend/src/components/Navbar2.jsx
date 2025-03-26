import React, { useState, useEffect, useRef } from 'react'
import { FaPhoneVolume } from "react-icons/fa6";
import { MdKeyboardArrowDown, MdPhoneInTalk } from "react-icons/md";
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { RxCross2 } from "react-icons/rx";
import { LuMoveRight } from "react-icons/lu";


function Navbar2() {
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
        <div className="relative h-screen  flex flex-col lg:block">
       
          
 
          <img src="images2/sukoon4.png" className="absolute  inset-0 w-full h-full object-cover brightness-90" alt="Background" />
          
    {/* Navbar */}
    <div className={`flex flex-row justify-between lg:justify-start ${isScrolled ? "fixed top-0 left-0 w-full bg-black lg:bg-black shadow-lg" : "relative bg-black lg:bg-black"} z-50 py-6 px-5 lg:px-20 items-center transition-all duration-300`}>
      <div className='me-32'>
        <img src="images2/sukoonWhiteLogo.png" alt="Logo" className='w-32' />
      </div>
      <div className="hidden lg:block">
        <ul className="flex flex-row text-sm poppins text-white space-x-8">
          <a href='/linkpage'><li className='cursor-pointer'>Home</li></a>
          <a href='#about'><li className='cursor-pointer'>About</li></a>
          
          <a href='#location'><li className='cursor-pointer'>Location</li></a>
          <a href='#amenities'><li className='cursor-pointer'>Amenities</li></a>
          <a href='#club'><li className='cursor-pointer'>Gallery</li></a>
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
        <HiOutlineMenuAlt3 className="text-white text-3xl cursor-pointer" onClick={toggleMenu} />
      </div>
    </div>
          {/* Navbar Ends Here */}

          {/* Sliding Menu */}
          <div className={`fixed top-0 right-0 h-screen w-3/4 bg-white z-50 transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <RxCross2 onClick={toggleMenu} className='absolute top-4 right-4 text-lg' />
            <ul className="flex flex-col text-black p-6 space-y-4">
              <a href='#home'><li className='cursor-pointer'>Home</li></a>
              <a href='#about'><li className='cursor-pointer'>About</li></a>
              <a href='#amenities'><li className='cursor-pointer'>Amenities</li></a>
              <a href='#location'><li className='cursor-pointer'>Location Advantage</li></a>
              <li>
                <div className="flex flex-row bg-gray-200 items-center rounded-md">
                  <div className="bg-green-950 text-center py-3 px-1 rounded-md">
                    <MdPhoneInTalk className="text-white text-lg" />
                  </div>
                  <div className="px-2">
                    <p className="text-sm font-semibold">Book Site Visit</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Buttons at the bottom of the header */}
          <div className="absolute bottom-10  flex-row justify-end w-full px-20 transform  flex space-x-6">
            <a download href='images2/brochure.pdf' className="bg-white    py-2 px-10 font-normal  shadow-md flex items-center">
              <span className="text-sm font-semibold poppins ">Download Brochure</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar2;