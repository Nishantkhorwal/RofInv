import React, {useState} from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from './Navbar';

function MainPage() {
    const images = [
        "/images2/club1.jpeg",
        "/images2/bgImage2.jpeg",
        "/images2/Court.jpeg",
        "/images2/floors.jpeg",
        "/images2/Gym.jpeg",
      ];
      const images2 = [
        "/images2/club2.jpeg",
        "/images2/club4.jpeg",
        "/images2/club5.jpeg",
        "/images2/club6.jpeg",
        "/images2/club7.jpeg",
        "/images2/club8.jpeg",
        "/images2/club9.jpeg",
        "/images2/club10.jpeg",
        "/images2/club11.jpeg",
      ];
      const ame = [
        {
            img : "/images2/yoga.png",
            text : "Yoga Lawn"
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
            img : "/images2/gazebo.png",
            text : "Gazebo"
        },
        {
            img : "/images2/cctv.png",
            text : "CCTV Surveillance"
        },
        {
            img : "/images2/park.png",
            text : "Central Park"
        },
        {
            img : "/images2/badminton.png",
            text : "Badminton Court"
        },
        {
            img : "/images2/hall.png",
            text : "Community Hall"
        },
        {
            img : "/images2/light.png",
            text : "Ample Lighting"
        },
        {
            img : "/images2/basketball.png",
            text : "Basketball Court"
        },
        {
            img : "/images2/opengym.png",
            text : "Fitness Zone"
        },
        {
            img : "/images2/kidplau.png",
            text : "Kids Play"
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
          img : "/images2/senior.png",
          text : "Senior Citizen Court"
        },
        {
          img : "/images2/celebpark.png",
          text : "Celebration Park"
        },
        {
          img : "/images2/aroma.png",
          text : "Aroma Garden"
        },
        {
          img : "/images2/sitout.png",
          text : "Sit Out"
        },
        {
          img : "/images2/golf.png",
          text : "Golf Putting Green"
        },
        {
          img : "/images2/butterfly.png",
          text : "Butterfly Garden"
        },
        {
          img : "/images2/wooden.png",
          text : "Wooden Deck"
        },
        {
          img : "/images2/path.png",
          text : "Reflexology Path"
        },
        {
          img : "/images2/park.png",
          text : "Harmony Garden"
        },
        {
          img : "/images2/park.png",
          text : "Whispering Garden"
        },
        
        
      ]
    const [currentSlide, setCurrentSlide] = useState(0);
  let sliderRef = null;
  let sliderRef2 = null;

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };
  const settings2 = {  // Separate settings for second carousel
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (
    <>
    <div>
        <Navbar/>
        <div className='pb-10 pt-20 px-28' id='about'>
        <h1 className='text-6xl americana font-semibold mb-6'>
         Pravasa
        </h1> 
        <h2 className='text-xl americana font-semibold mb-4'>
        Welcome to ROF Pravasa - Luxury Floors
        </h2>   
        <p className='text-justify text-sm'>
        Pravasa is where sophistication of lifestyle and philosophy of wellness converge. Sitting in the prime location of Dwarka Expressway, our homes are for the people looking beyond just a house - they're looking for a way of life. Mind and body as well as their wish to indulge in Opulence. Here every square inch is designed for improving your physique and state of mind.Rof Pravasa is a entry point to a phenomenon of a lifestyle in one of the most luxurious zones of Dwarka Expressway.No doubt it is a great chance with world class services and product streams.Buy a home that you will enjoy at the present time and for the future and have what the best amenities location and provides future benefits.
        </p>
        </div>
        <div className="w-[85%] mx-auto pb-20">
      {/* Main Slider */}
      <div className="relative">
        <Slider {...settings} ref={(slider) => (sliderRef = slider)}>
          {images.map((img, index) => (
            <div key={index} className="flex justify-center">
              <img src={img} className="h-[500px] rounded-lg w-full object-cover" alt={`Slide ${index}`} />
            </div>
          ))}
        </Slider>

        {/* Custom Controls */}
        <button 
          className="bg-transparent rounded-full text-3xl text-white -translate-y-1/2 absolute left-2 px-4 py-2 top-1/2 transform"
          onClick={() => sliderRef.slickPrev()}
        >
          ❮
        </button>
        <button 
          className="p-2 rounded-full text-3xl text-white -translate-y-1/2 absolute right-2 top-1/2 transform"
          onClick={() => sliderRef.slickNext()}
        >
          ❯
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-4 space-x-3">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`w-28 h-[70px] object-cover  rounded-[25px] cursor-pointer border-2 ${currentSlide === index ? 'opacity-100' : 'opacity-30'}`}
            onClick={() => sliderRef.slickGoTo(index)}
            alt={`Thumbnail ${index}`}
          />
        ))}
      </div>
    </div>
        <div className='bg-[#f7f3e8] px-28 py-20' id='location'>
            <p className='text-5xl americana font-bold mb-16'>
                Location Advantages
            </p>
            <div className='flex flex-row flex-wrap gap-y-14'>
                <div className='flex flex-row justify-start w-[33%] items-center'>
                    <img src='images/road.png' className='w-16 me-4'></img>
                    <p className='text-xs poppins'>2 mins from <br/>dwarka expressway</p>
                </div>
                <div className='flex flex-row justify-start w-[33%] items-center'>
                    <img src='images/airport.png' className='w-16 me-4'></img>
                    <p className='text-xs poppins'> 25 mins from IGI <br/>Airport</p>
                </div>
                <div className='flex flex-row justify-start w-[33%] items-center'>
                    <img src='images/hospital.png' className='w-16 me-4'></img>
                    <p className='text-xs poppins'> 20 Mins from Medanta,<br/>The Medacity & Rajiv<br/>Chowk</p>
                </div>
                <div className='flex flex-row justify-start w-[33%] items-center'>
                    <img src='images/hospital.png' className='w-16 me-4'></img>
                    <p className='text-xs poppins'>7 mins from Manesar, <br/> Toll Plaza, NH-8, <br/> Hyatt Regency Hotel </p>
                </div>
                <div className='flex flex-row justify-start w-[33%] items-center'>
                    <img src='images/plot.png' className='w-16 me-4'></img>
                    <p className='text-xs poppins'>Centrally located<br/>corner plot</p>
                </div>
                <div className='flex flex-row justify-start w-[33%] items-center'>
                    <img src='images/uni.png' className='w-16 me-4'></img>
                    <p className='text-xs poppins'>10 mins from proposed <br/> Diplomatic Enclaves <br/> & Embassies</p>
                </div>

            </div>
             
        </div>
    </div>
    <div className='px-28 py-20' id='amenities'>
            <p className='text-5xl americana font-bold mb-16'>
                Amenities
            </p>
            <div className='flex flex-row flex-wrap gap-y-10'>
                {
                    ame.map((ame)=> (
                        <div className='flex flex-row justify-start w-[33.3333%] items-center'>
                            <img src={ame.img} className='w-8 me-4'></img>
                            <p className='poppins'>{ame.text}</p>
                        </div>
                    ))
                }
            </div>    
    </div> 
    <div className='pt-20 px-28' id='club'>
        <p className='text-6xl americana font-bold mb-6'>
         Club
        </p>
        </div>
    <div className="w-[85%] mx-auto pb-20">
          <div className="relative">
            <Slider {...settings2} ref={(slider) => (sliderRef2 = slider)}>
              {images2.map((img, index) => (
                <div key={index} className="flex justify-center">
                  <img src={img} className="h-[500px] rounded-lg w-full object-cover" alt={`Slide ${index}`} />
                </div>
              ))}
            </Slider>

            {/* Custom Controls */}
            <button 
              className="bg-transparent rounded-full text-3xl text-white -translate-y-1/2 absolute left-2 px-4 py-2 top-1/2 transform"
              onClick={() => sliderRef2.slickPrev()}
            >
              ❮
            </button>
            <button 
              className="p-2 rounded-full text-3xl text-white -translate-y-1/2 absolute right-2 top-1/2 transform"
              onClick={() => sliderRef2.slickNext()}
            >
              ❯
            </button>
          </div>
        </div>
        <div className='px-28 py-20' id='sitemap'>
    <div className="flex justify-between items-center mb-6">
        <p className='text-5xl americana font-bold'>
            Site Plan
        </p>
        <a href="/images2/club1.jpeg" download className="bg-black rounded-lg text-sm text-white hover:bg-gray-800 px-4 py-2 transition">
            Download
        </a>
    </div>
    <img src="/images2/club1.jpeg" className='cursor-pointer duration-300 hover:scale-105 transform transition-all'></img>
</div>
<div className='px-28 py-20' id='locationmap'>
    <div className="flex justify-between items-center mb-6">
        <p className='text-5xl americana font-bold'>
            Location Map
        </p>
        <a href="/images2/locationMap3.jpg" download className="bg-black rounded-lg text-sm text-white hover:bg-gray-800 px-4 py-2 transition">
            Download
        </a>
    </div>
    <img src="/images2/locationMap3.jpg" className='cursor-pointer duration-300 hover:scale-105 transform transition-all'></img>
</div>          

    </>
  )
}

export default MainPage