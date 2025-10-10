
import { useState, useEffect } from "react"
// import { Menu, X, Download, MapPin, Zap, Shield, Users, Wifi, Car } from "lucide-react"
import {
  Menu,
  X,
  
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Home,
  Shield,
  
  CheckCircle,
  ArrowRight,
  Building,
  Users,
  Car,
  Wifi,
  Zap,
} from "lucide-react"

export default function PravasaPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const keyHighlights = [
    { icon: <Home className="w-6 h-6" />, text: "3BHK Luxury Apartments", value: "Investment ₹72 LAC" },
    { icon: <Building className="w-6 h-6" />, text: "Independent Floors", value: "₹2.4 CRORE onwards" },
    { icon: <CreditCard className="w-6 h-6" />, text: "Easy Payment Plan", value: "30:70 " },
    { icon: <Calendar className="w-6 h-6" />, text: "Pre-Launch Offer", value: "Save ₹25 LAC" },
  ]

  const locationAdvantages = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Prime Location",
      description:
        "Prime corner plot just 2 mins from Dwarka Expressway. Reach IGI Airport & IFFCO Chowk in 25 mins, Medanta & Rajiv Chowk in 20 mins.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High-Speed Connectivity",
      description: "Ultra-fast fiber optic internet and 5G coverage ensuring seamless digital operations.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Environment",
      description: "24/7 security monitoring with advanced surveillance systems and controlled access points.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Vibrant Community",
      description: "Surrounded by innovative businesses, cafes, and networking opportunities for growth.",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Smart Infrastructure",
      description: "IoT-enabled building systems with smart lighting, climate control, and energy management.",
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Easy Accessibility",
      description: "Multiple transportation options including metro, bus routes, and ample parking facilities.",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-sm"}`}
      >
        {/* Top Bar with Key Info */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Pre-Launch Offer: Save ₹25 LAC
              </span>
              <span className="hidden md:flex items-center">
                <Shield className="w-4 h-4 mr-1" /> RERA No : 21 of 2025
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center font-semibold">
                <Phone className="w-4 h-4 mr-1" /> 7827 678 754
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  {/* <span className={`${scrolled ? "text-gray-900" : "text-white"}`}>ROF</span>
                  <span className="text-green-600 ml-2">PRAVASA</span> */}
                  <img className="w-28" src={ scrolled ? "greenlogo.png" : "images2/logo.png" }></img>
                </div>
                <div className={`ml-3 text-xs ${scrolled ? "text-gray-600" : "text-gray-300"}`}>
                  <div>THE LUXURY</div>
                  <div>WELLNESS LIVING</div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                <a
                  href="#home"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-yellow-600" : "text-white hover:text-yellow-400"}`}
                >
                  Home
                </a>
                <a
                  href="#about"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-yellow-600" : "text-white hover:text-yellow-400"}`}
                >
                  About Project
                </a>
                <a
                  href="#pricing"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-yellow-600" : "text-white hover:text-yellow-400"}`}
                >
                  Pricing
                </a>
                <a
                  href="#amenities"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-yellow-600" : "text-white hover:text-yellow-400"}`}
                >
                  Amenities
                </a>
                <a
                  href="#location"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-yellow-600" : "text-white hover:text-yellow-400"}`}
                >
                  Location
                </a>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Now
              </button> */}
              <button
                className={`border-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${scrolled ? "border-gray-300 text-gray-700 hover:border-yellow-600 hover:text-yellow-600" : "border-white text-white hover:bg-white hover:text-gray-900"}`}
              >
                Call Now
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-md transition-colors ${scrolled ? "text-gray-700 hover:text-yellow-600" : "text-white hover:text-yellow-400"}`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-yellow-600 font-medium">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-yellow-600 font-medium">
                About Project
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-yellow-600 font-medium">
                Pricing
              </a>
              <a href="#amenities" className="block px-3 py-2 text-gray-700 hover:text-yellow-600 font-medium">
                Amenities
              </a>
              <a href="#location" className="block px-3 py-2 text-gray-700 hover:text-yellow-600 font-medium">
                Location
              </a>
              <div className="pt-4 space-y-2">
                <button className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold">Book Now</button>
                <button className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Full Screen Header */}
      <header
        id="home"
        className="relative h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/img3.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="mb-6">
              <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎉 Pre-Launch Offer - Limited Time
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold mb-4 leading-tight">
                ROF <span className="text-green-400">PRAVASA</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-2">Ultra Luxury Independent Floors</p>
              <p className="text-lg text-green-400 font-semibold">Sector-88A, Gurugram • Dwarka Expressway</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Call: 7827 678 754
              </button>
            </div>
          </div>

          {/* Right Content - Key Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyHighlights.map((item, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <div className="text-green-400 mr-3 text-2xl">{item.icon}</div>
                  <span className="text-base text-gray-200 font-medium">{item.text}</span>
                </div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Project Description Section */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 americana">ROF Pravasa</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className=" text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Pravasa is where sophistication of lifestyle and philosophy of wellness converge. Sitting in the prime location of Dwarka Expressway, our homes are for the people looking beyond just a house - they're looking for a way of life. Mind and body as well as their wish to indulge in Opulence. Here every square inch is designed for improving your physique and state of mind.Rof Pravasa is a entry point to a phenomenon of a lifestyle in one of the most luxurious zones of Dwarka Expressway.No doubt it is a great chance with world class services and product streams.Buy a home that you will enjoy at the present time and for the future and have what the best amenities location and provides future benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Design</h3>
              <p className="text-gray-600">Eco-friendly materials and energy-efficient systems for a greener future.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Technology</h3>
              <p className="text-gray-600">AI-powered systems that adapt to your needs and optimize performance.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Focus</h3>
              <p className="text-gray-600">Spaces designed to foster collaboration and meaningful connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Advantages Section */}
      <section id="advantages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl americana font-bold text-gray-900 mb-6">Location Advantages</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Positioned at the intersection of opportunity and innovation, our location offers unparalleled advantages
              for businesses and individuals seeking growth and success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locationAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 text-justify leading-relaxed">{advantage.description}</p>
                <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
          <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Pricing & Payment Plans</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible payment options designed to make your dream home affordable with attractive pre-launch benefits
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 3BHK Pricing */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-xl border border-blue-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">3BHK Apartments</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹72 LAC*</div>
                <div className="text-gray-600">Starting Price</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Booking Amount</span>
                  <span className="font-semibold text-gray-900">₹10 LAC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Payment Structure</span>
                  <span className="font-semibold text-gray-900">30:70</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Pre-Launch Benefit</span>
                  <span className="font-semibold text-green-600">Save ₹25 LAC</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Bank Loan</span>
                  <span className="font-semibold text-blue-600">Available</span>
                </div>
              </div>
            </div>

            {/* Independent Floors Pricing */}
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-8 shadow-xl border border-yellow-200 relative">
              <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                PREMIUM
              </div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Independent Floors</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">₹2.4 CR*</div>
                <div className="text-gray-600">Starting Price</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Ultra Luxury Features</span>
                  <span className="font-semibold text-gray-900">✓ Included</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Private Parking</span>
                  <span className="font-semibold text-gray-900">✓ Included</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Premium Amenities</span>
                  <span className="font-semibold text-gray-900">✓ Access</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Customization</span>
                  <span className="font-semibold text-yellow-600">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Plan Details */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">30:70 Payment Plan Benefits</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">30%</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">During Construction</h4>
                <p className="text-gray-600 text-sm">
                  Pay only 30% during the construction phase with flexible milestone-based payments
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">70%</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">On Possession</h4>
                <p className="text-gray-600 text-sm">Remaining 70% payable on possession with easy loan arrangements</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Easy EMI Options</h4>
                <p className="text-gray-600 text-sm">
                  Pre-approved loans from leading banks with competitive interest rates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">Perfect Investment Opportunity</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-yellow-400 mr-3" />
                    <span>High appreciation potential in Dwarka Expressway corridor</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-yellow-400 mr-3" />
                    <span>Ready-to-move luxury independent floors</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-yellow-400 mr-3" />
                    <span>Premium location with excellent connectivity</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-yellow-400 mr-3" />
                    <span>World-class amenities and infrastructure</span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-5xl font-bold text-yellow-400 mb-2">₹72 LAC*</div>
                <div className="text-xl mb-6">Starting Price for 3BHK</div>
                <button className="bg-yellow-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-yellow-700 transition-all duration-300 shadow-lg">
                  Get Price Details
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
