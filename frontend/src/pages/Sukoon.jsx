import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar2 from '../components/Navbar2';

function Sukoon() {
    const images = [
      {
        img : "/images2/img2.jpg",
        text : "Library"
      },
      
      {
        img : "/images2/img5.jpg",
        text : "Club House"
      },
      {
        img : "/images2/img6.jpg",
        text : "TT Court"
      },
      {
        img : "/images2/img8.jpg",
      },
      {
        img : "/images2/img9.jpg",
        text : "Gym"
      },
      {
        img : "/images2/header3.png",
      },
      {
        img : "/images2/img10.jpg",
        text : "Swimming Pool"
      },
        
        
        
        
        
        
      ];
      const images2 = [
        "/images2/int1.jpeg",
        "/images2/int2.jpeg",
        "/images2/int3.jpeg",
        "/images2/int4.jpeg",
        "/images2/int5.jpeg",
        "/images2/int6.jpeg",
        "/images2/int7.jpeg",
      ];
      const ame = [
        {
            img : "/images2/yoga.png",
            text : "Lawn Area"
        },
        {
            img : "/images2/lifts.png",
            text : "Lift"
        },
        {
            img : "/images2/fire.png",
            text : "Fire Extinguisher"
        },
        {
            img : "/images2/cctv.png",
            text : "CCTV Surveillance"
        },
        {
            img : "/images2/park.png",
            text : "Meditation Garden"
        },
        {
            img : "/images2/light.png",
            text : "Ample Lighting"
        },
        {
            img : "/images2/opengym.png",
            text : "Outdoor Gym"
        },
        {
            img : "/images2/kidplau.png",
            text : "Kids Play Area"
        },
        {
            img : "/images2/guard.png",
            text : "Guard Room"
        },
        {
            img : "/images2/leg.png",
            text : "Jogging Track"
        },
        {
            img : "/images2/secured.png",
            text : "Secured Gated Community"
        },
        {
          img : "/images2/sitout.png",
          text : "Stepped Sitting Area"
        },
        {
          img : "/images2/grass.png",
          text : "Grass Mounds"
        },
        {
          img : "/images2/fire.png",
          text : "Fire Place area "
        },
        {
          img : "/images2/celebpark.png",
          text : "Senior Citizen Sitting Garden"
        },
        {
          img : "/images2/aroma.png",
          text : "Aromatic Garden"
        },
        {
          img : "/images2/park.png",
          text : "Tranquil Garden"
        },

        {
          img : "/images2/butterfly.png",
          text : "Herb Garden"
        },
        {
          img : "/images2/park.png",
          text : "Arrival Garden"
        },
        {
          img : "/images2/waterf.png",
          text : "Entrance Water Fall"
        },
        {
          img : "/images2/sculpture.png",
          text : "Sculptures"
        },
        {
          img : "/images2/celebpark.png",
          text : "Entrance Greens"
        },
        {
          img : "/images2/gazebo.png",
          text : "Grand Entrance Plaza"
        },

        {
          img : "/images2/evc.png",
          text : "Ev Charging Station"
        },
        {
          img : "/images2/water.png",
          text : "24X7 Water Supply"
        },
        {
          img : "/images2/power.png",
          text : "Power Backup"
        },
        {
          img : "/images2/shade.png",
          text : "Shaded Walkways"
        },
        {
          img : "/images2/amphit.png",
          text : "Amphitheatre"
        },
        {
          img : "/images2/path.png",
          text : "Reflexology Path"
        },
        {
          img : "/images2/badminton.png",
          text : "Badminton Court"
        },
        {
            img : "/images2/cricket.png",
            text : "Cricket Pitch"
        },
        {
          img : "/images2/tennis.png",
          text : "Lawn Tennis Court"
        },
        {
          img : "/images2/paddle.png",
          text : "Paddle Court"
        },
        {
          img : "/images2/laundry.png",
          text : "Laundry"
        },
        {
          img : "/images2/salon.png",
          text : "Salon"
        },
        {
          img : "/images2/coffee.png",
          text : "Coffee Lounge"
        },
        {
          img : "/images2/medical.png",
          text : "Medical Shop"
        },
        {
          img : "/images2/lavish.png",
          text : "Lavish Dining Area"
        },
      
        
        
        
      ]


      

      







    const [currentSlide, setCurrentSlide] = useState(0);
  let sliderRef = null;
  let sliderRef2 = null;

  const settings = {
    infinite: true,
    autoplay: true,
  
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const settings2 = {  // Separate settings for second carousel
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };
  return (
    <>
    <div>
        <Navbar2/>
        <div className='px-4 lg:px-28 pt-20 pb-10' id='about'>
        <h1 className='text-6xl font-semibold mb-6 americana'>
         Sukoon
        </h1> 
        <p className='font-bold text-xl  mb-4 americana '>
        Welcome to ROF Sukoon - 3BHK Ultra Luxury Apartments
        </p>   
        <p className='text-sm text-justify'>
        Discover a world where sophistication meets comfort. Nestled in the heart of 
        Gurugram, ROF Sukoon offers a unique blend of modern architecture, timeless 
        design, and unmatched exclusivity. This is not just a residence, it's a statement.Located in Sector 37-D, enjoy proximity to the finest schools, entertainment hubs, and 
        business districts, while remaining a serene retreat from the hustle and bustle.Experience the perfect blend of privacy and community. ROF Sukoon is designed for 
        those who seek exclusivity, sophistication, and comfort- all in one place.
        </p>
        </div>
        
    <div className="w-[85%] mx-auto pb-20">
          <div className="relative">
            <Slider {...settings2} ref={(slider) => (sliderRef2 = slider)}>
              {images2.map((img, index) => (
                <div key={index} className="flex justify-center">
                  <img src={img} className="sm:h-[200px] lg:w-full lg:h-[500px] object-cover rounded-lg" alt={`Slide ${index}`} />
                </div>
              ))}
            </Slider>

            {/* Custom Controls */}
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-3xl text-white px-4 py-2 rounded-full"
              onClick={() => sliderRef2.slickPrev()}
            >
              ❮
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-3xl text-white p-2 rounded-full"
              onClick={() => sliderRef2.slickNext()}
            >
              ❯
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-1 lg:space-x-3">
        {images2.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`w-14 h-[30px] lg:w-28 lg:h-[70px]  object-cover  rounded-[25px] cursor-pointer  ${currentSlide === index ? 'opacity-100' : 'opacity-30'}`}
            onClick={() => sliderRef2.slickGoTo(index)}
            alt={`Thumbnail ${index}`}
          />
        ))}
      </div>
        </div>
        <div className='lg:px-28 px-4 py-20 bg-[#f7f3e8]' id='location'>
            <p className='americana text-2xl lg:text-5xl font-semibold mb-16'>
                Location Advantages
            </p>
            <div className='flex flex-row flex-wrap gap-y-14'>
                <div className='flex flex-row justify-start w-full lg:w-[33%] items-center'>
                    <img src='images2/road.png' className='me-4 w-16'></img>
                    <p className='poppins text-xs'>Minutes away from <br/>dwarka expressway</p>
                </div>
                <div className='flex flex-row justify-start w-full lg:w-[33%] items-center'>
                    <img src='images2/hospital.png' className='me-4 w-16'></img>
                    <p className='poppins text-xs'> More than 5 world class <br/> hospital within minutes </p>
                </div>
                
                <div className='flex flex-row justify-start w-full lg:w-[33%] items-center'>
                    <img src='images2/uni.png' className='me-4 w-16'></img>
                    <p className='poppins text-xs'> Faster access to IMT Manesar, <br/>Hero Honda Chowk, NH8 & <br/>Multi-utility corridor </p>
                </div>
                <div className='flex flex-row justify-start w-full lg:w-[33%] items-center'>
                    <img src='images2/rail.png' className='me-4 w-16'></img>
                    <p className='poppins text-xs'>Transportation & Medical <br/> facilities are nearby</p>
                </div>
                <div className='flex flex-row justify-start w-full lg:w-[33%] items-center'>
                    <img src='images2/uni.png' className='me-4 w-16'></img>
                    <p className='poppins text-xs'>Present in already inhabited <br/>area with established school<br/>& Market</p>
                </div>
                <div className='flex flex-row justify-start w-full lg:w-[33%] items-center'>
                    <img src='images2/bus.png' className='me-4 w-16'></img>
                    <p className='poppins text-xs'>1800 MNC's are<br/> close by</p>
                </div>
                

            </div>
             
        </div>
    </div>
    <div className='lg:px-28 px-4 py-20 ' id='amenities'>
            <p className='americana text-5xl font-semibold mb-16'>
                Amenities
            </p>
            <div className='flex flex-row flex-wrap gap-y-10'>
                {
                    ame.map((ame)=> (
                        <div className='flex flex-row w-[48%] lg:w-[33.3333%] justify-start items-center'>
                            <img src={ame.img} className='me-4 w-8'></img>
                            <p className='poppins '>{ame.text}</p>
                        </div>
                    ))
                }
            </div>    
    </div> 
    <div className='px-28 pt-20 ' id='club'>
        <p className='text-6xl font-semibold mb-6 americana'>
        Gallery
        </p>
        </div>
        <div className="w-[85%] mx-auto pb-20">
      {/* Main Slider */}
      <div className="relative">
  <Slider {...settings} ref={(slider) => (sliderRef = slider)}>
    {images.map((item, index) => (
      <div key={index} className="relative flex justify-center">
        <img
          src={item.img}
          className="w-full sm:h-[200px] lg:h-[500px] object-cover rounded-lg"
          alt={`Slide ${index}`}
        />
        <div className={`absolute left-0 bottom-10 ${ item.text ? 'bg-gradient-to-r from-amber-800 to-transparent' : 'bg-transparent'  } py-2 px-4 `}>
          <p className="text-5xl font-semibold poppins text-white">{item.text}</p>
        </div>
      </div>
    ))}
  </Slider>

  {/* Custom Controls */}
  <button
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-3xl text-white px-4 py-2 rounded-full"
    onClick={() => sliderRef.slickPrev()}
  >
    ❮
  </button>
  <button
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-3xl text-white p-2 rounded-full"
    onClick={() => sliderRef.slickNext()}
  >
    ❯
  </button>
</div>


      {/* Thumbnail Navigation */}
      
    </div>
    
    <div className='lg:px-28 px-4 py-20' id='sitemap'>
        <p className='americana text-2xl lg:text-5xl font-semibold mb-16'>
            Site Plan
        </p>
        <img src = "images2/SitePlan4.jpg" className='hover:scale-105 transition-all transform duration-300'></img>

    </div> 
    <div className='lg:px-28 px-4 py-20' id='locationmap'>
        <p className='americana text-2xl lg:text-5xl font-semibold mb-16'>
            Location Map
        </p>
        <img src = "images2/locationMap2.jpg" className='hover:scale-105 transition-all transform duration-300'></img>

    </div>           

    </>
  )
}

export default Sukoon