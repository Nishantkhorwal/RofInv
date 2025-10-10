
// // import { useEffect, useRef, useState } from "react"

// // const Pravasa = () => {
// //   const amenities = [
// //     {
// //       id: 1,
// //       title: "Luxury Swimming Pool",
// //       description: "Dive into our crystal-clear infinity pool with panoramic views",
// //       image: "/images2/club9.jpeg?height=800&width=1200",
// //       accent: "#10b981",
// //     },
// //     {
// //       id: 2,
// //       title: "Modern Badminton Court",
// //       description: "Good Quality court and professional looking structure",
// //       image: "/img2.jpg?height=800&width=1200",
// //       accent: "#3b82f6",
// //     },
// //     {
// //       id: 3,
// //       title: "Luxury Sculptures",
// //       description: "Beautiful and attractive looking sculptures",
// //       image: "/img3.jpg?height=800&width=1200",
// //       accent: "#f59e0b",
// //     },
// //     {
// //       id: 4,
// //       title: "Luxury Club",
// //       description: "Comprehensive wellness treatments in a tranquil atmosphere",
// //       image: "/images2/club2.jpeg?height=800&width=1200",
// //       accent: "#ec4899",
// //     },
// //     {
// //       id: 5,
// //       title: "Basketball Court",
// //       description: "Breathtaking views and premium experiences in the area",
// //       image: "/img5.jpg?height=800&width=1200",
// //       accent: "#8b5cf6",
// //     },
// //   ]

// //   const topGalleryImages = [
// //     { id: 1, src: "/img1.jpg?height=400&width=600", title: "Exterior View" },
// //     { id: 2, src: "/img2.jpg?height=400&width=600", title: "Garden Area" },
// //     { id: 3, src: "/img3.jpg?height=400&width=600", title: "Entrance Hall" },
// //     { id: 4, src: "/img4.jpg?height=400&width=600", title: "Lobby Design" },
// //     { id: 5, src: "/img5.jpg?height=400&width=600", title: "Architecture" },
// //     { id: 6, src: "/img6.jpg?height=400&width=600", title: "Landscape" },
// //   ]

// //   const bottomGalleryImages = [
// //     { id: 1, src: "/img1.jpg?height=400&width=600", title: "Night View" },
// //     { id: 2, src: "/img2.jpg?height=400&width=600", title: "Interior Design" },
// //     { id: 3, src: "/img3.jpg?height=400&width=600", title: "Luxury Suites" },
// //     { id: 4, src: "/img4.jpg?height=400&width=600", title: "Dining Area" },
// //     { id: 5, src: "/img5.jpg?height=400&width=600", title: "Spa & Wellness" },
// //     { id: 6, src: "/img6.jpg?height=400&width=600", title: "Event Spaces" },
// //   ]

// //   const containerRef = useRef(null)
// //   const [currentIndex, setCurrentIndex] = useState(0)
// //   const [scrollProgress, setScrollProgress] = useState(0)
// //   const [currentSection, setCurrentSection] = useState("top") // 'top', 'amenities', 'bottom'
// //   const [sectionProgress, setSectionProgress] = useState(0)

// //   useEffect(() => {
// //     const container = containerRef.current
// //     if (!container) return

// //     let scrollTimeout

// //     const handleWheel = (e) => {
// //       e.preventDefault()

// //       clearTimeout(scrollTimeout)

// //       const sensitivity = 0.001
// //       const delta = e.deltaY * sensitivity

// //       if (currentSection === "top") {
// //         setSectionProgress((prev) => {
// //           const newProgress = Math.max(0, Math.min(1, prev + delta))
// //           if (newProgress >= 0.98 && delta > 0) {
// //             setCurrentSection("amenities")
// //             setSectionProgress(0)
// //             setScrollProgress(0)
// //             return 0
// //           }
// //           return newProgress
// //         })
// //       } else if (currentSection === "amenities") {
// //         setScrollProgress((prev) => {
// //           const newProgress = Math.max(0, Math.min(1, prev + delta))

// //           if (newProgress >= 0.95 && delta > 0) {
// //             const nextIndex = (currentIndex + 1) % amenities.length
// //             if (nextIndex === 0) {
// //               // Finished all amenities, go to bottom section
// //               setCurrentSection("bottom")
// //               setSectionProgress(0)
// //               return 0
// //             } else {
// //               setCurrentIndex(nextIndex)
// //               return 0
// //             }
// //           } else if (newProgress <= 0.05 && delta < 0 && currentIndex === 0) {
// //             // Go back to top section
// //             setCurrentSection("top")
// //             setSectionProgress(0.8)
// //             return 0
// //           } else if (newProgress <= 0.05 && delta < 0) {
// //             const prevIndex = currentIndex === 0 ? amenities.length - 1 : currentIndex - 1
// //             setCurrentIndex(prevIndex)
// //             return 1
// //           }

// //           return newProgress
// //         })
// //       } else if (currentSection === "bottom") {
// //         setSectionProgress((prev) => {
// //           const newProgress = Math.max(0, Math.min(1, prev + delta))
// //           if (newProgress <= 0.02 && delta < 0) {
// //             setCurrentSection("amenities")
// //             setCurrentIndex(amenities.length - 1)
// //             setScrollProgress(0.8)
// //             return 0
// //           }
// //           return newProgress
// //         })
// //       }

// //       scrollTimeout = setTimeout(() => {
// //         // Scroll timeout logic if needed
// //       }, 100)
// //     }

// //     container.addEventListener("wheel", handleWheel, { passive: false })

// //     return () => {
// //       container.removeEventListener("wheel", handleWheel)
// //       clearTimeout(scrollTimeout)
// //     }
// //   }, [currentIndex, currentSection, amenities.length])

// //   const currentAmenity = amenities[currentIndex]
// //   const nextIndex = (currentIndex + 1) % amenities.length
// //   const nextAmenity = amenities[nextIndex]

// //   const interpolatedTitle = scrollProgress < 0.5 ? currentAmenity.title : nextAmenity.title
// //   const interpolatedDescription = scrollProgress < 0.5 ? currentAmenity.description : nextAmenity.description
// //   const interpolatedAccent = scrollProgress < 0.5 ? currentAmenity.accent : nextAmenity.accent

// //   // Top Gallery Component
// //   const TopGallery = () => (
// //     <div className="h-screen bg-gray-900 overflow-hidden relative">
// //       <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30 z-10"></div>

// //       {/* Hero Text */}
// //       <div className="absolute inset-0 z-20 flex items-center justify-center">
// //         <div className="text-center text-white px-8">
// //           <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">PRAVASA</h1>
// //           <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">Where Luxury Meets Perfection</p>
// //           <div className="w-24 h-px bg-amber-400 mx-auto mb-8"></div>
// //           <p className="text-lg font-light opacity-80">Scroll to explore our world</p>
// //         </div>
// //       </div>

// //       {/* Gallery Grid */}
// //       <div
// //         className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 transition-transform duration-1000 ease-out"
// //         style={{ transform: `scale(${1 + sectionProgress * 0.1}) translateY(${sectionProgress * -20}px)` }}
// //       >
// //         {topGalleryImages.map((image, index) => (
// //           <div
// //             key={image.id}
// //             className="relative overflow-hidden group"
// //             style={{
// //               opacity: 1 - sectionProgress * 0.3,
// //               transform: `translateY(${sectionProgress * (index % 2 === 0 ? -30 : 30)}px)`,
// //             }}
// //           >
// //             <img
// //               src={image.src || "/placeholder.svg"}
// //               alt={image.title}
// //               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
// //             />
// //             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
// //             <div className="absolute bottom-4 left-4 text-white">
// //               <p className="text-sm font-medium">{image.title}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   )

// //   // Bottom Gallery Component
// //   const BottomGallery = () => (
// //     <div className="h-screen bg-gray-100 overflow-hidden relative">
// //       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

// //       {/* Footer Text */}
// //       <div className="absolute bottom-0 left-0 right-0 z-20 p-12 text-center text-white">
// //         <h2 className="text-4xl md:text-6xl font-bold mb-4">Experience Awaits</h2>
// //         <p className="text-lg md:text-xl font-light mb-6 max-w-2xl mx-auto">
// //           Discover the ultimate in luxury living and premium amenities
// //         </p>
// //         <div className="w-24 h-px bg-amber-400 mx-auto"></div>
// //       </div>

// //       {/* Gallery Masonry Layout */}
// //       <div
// //         className="absolute inset-0 p-4 transition-transform duration-1000 ease-out"
// //         style={{ transform: `translateY(${sectionProgress * 50}px)` }}
// //       >
// //         <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
// //           {bottomGalleryImages.map((image, index) => (
// //             <div
// //               key={image.id}
// //               className={`relative overflow-hidden rounded-lg group ${
// //                 index === 0 ? "col-span-2 row-span-2" : index === 1 ? "row-span-2" : index === 2 ? "col-span-2" : ""
// //               }`}
// //               style={{
// //                 opacity: Math.min(1, sectionProgress * 2),
// //                 transform: `translateY(${(1 - sectionProgress) * 40}px)`,
// //               }}
// //             >
// //               <img
// //                 src={image.src || "/placeholder.svg"}
// //                 alt={image.title}
// //                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
// //               />
// //               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// //               <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// //                 <p className="text-sm font-medium">{image.title}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   )

// //   return (
// //     <>
// //     <div className="relative w-full text-gray-800">

// //       <div ref={containerRef} className="relative">
// //         {/* Top Gallery Section */}
// //         {currentSection === "top" && <TopGallery />}

// //         {/* Amenities Section */}
// //         {currentSection === "amenities" && (
// //           <div className="relative h-screen w-screen overflow-hidden bg-black cursor-grab active:cursor-grabbing">
// //             {/* Current Image Layer */}
// //             <div className="absolute top-0 left-0 w-full h-full">
// //               <div
// //                 className="absolute top-0 left-0 w-full h-full transition-transform duration-75 ease-linear"
// //                 style={{
// //                   transform: `scale(${1 + scrollProgress * 0.05}) translateY(${scrollProgress * -10}px)`,
// //                 }}
// //               >
// //                 <img
// //                   src={currentAmenity.image || "/placeholder.svg"}
// //                   alt={currentAmenity.title}
// //                   className="w-full h-full object-cover block"
// //                 />
// //                 <div
// //                   className="absolute top-0 left-0 w-full h-full transition-opacity duration-75 ease-linear"
// //                   style={{
// //                     opacity: 1 - scrollProgress * 0.3,
// //                     background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6))",
// //                   }}
// //                 />
// //               </div>
// //             </div>

// //             {/* Next Image Layer */}
// //             <div
// //               className="absolute top-0 left-0 w-full h-full overflow-hidden"
// //               style={{
// //                 clipPath: `polygon(0 ${100 - scrollProgress * 100}%, 100% ${100 - scrollProgress * 100}%, 100% 100%, 0% 100%)`,
// //               }}
// //             >
// //               <div
// //                 className="absolute top-0 left-0 w-full h-full transition-transform duration-75 ease-linear"
// //                 style={{
// //                   transform: `translateY(${(1 - scrollProgress) * 100}px) scale(${0.95 + scrollProgress * 0.05})`,
// //                 }}
// //               >
// //                 <img
// //                   src={nextAmenity.image || "/placeholder.svg"}
// //                   alt={nextAmenity.title}
// //                   className="w-full h-full object-cover block"
// //                 />
// //                 <div
// //                   className="absolute top-0 left-0 w-full h-full"
// //                   style={{
// //                     background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))",
// //                   }}
// //                 />
// //               </div>
// //             </div>

// //             {/* Content Layer */}


// //             {/* Progress Indicator */}
// //             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-xs font-light">
// //               <div className="flex items-center gap-2">
// //                 <span className="whitespace-nowrap">
// //                   {currentIndex + 1} / {amenities.length}
// //                 </span>
// //                 <div className="w-8 h-0.5 bg-white/20 rounded-full overflow-hidden">
// //                   <div
// //                     className="h-full bg-white/60 rounded-full transition-all duration-100 ease-linear"
// //                     style={{ width: `${scrollProgress * 100}%` }}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Bottom Gallery Section */}
// //         {currentSection === "bottom" && <BottomGallery />}

// //         {/* Luxury Text Box - Only visible during amenities */}
// //         {currentSection === "amenities" && (
// //           <div className="fixed bottom-8 right-8 z-50">
// //             <div
// //               className="bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg shadow-2xl p-6 max-w-xs transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
// //               style={{ borderColor: interpolatedAccent + "40" }}
// //             >
// //               {/* Decorative corner elements */}
// //               <div
// //                 className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2"
// //                 style={{ borderColor: interpolatedAccent }}
// //               ></div>
// //               <div
// //                 className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2"
// //                 style={{ borderColor: interpolatedAccent }}
// //               ></div>
// //               <div
// //                 className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2"
// //                 style={{ borderColor: interpolatedAccent }}
// //               ></div>
// //               <div
// //                 className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2"
// //                 style={{ borderColor: interpolatedAccent }}
// //               ></div>

// //               {/* Content */}
// //               <div className="text-center space-y-3">
// //                 <div className="flex items-center justify-center mb-3">
// //                   <div
// //                     className="w-8 h-px"
// //                     style={{ background: `linear-gradient(to right, transparent, ${interpolatedAccent}, transparent)` }}
// //                   ></div>
// //                   <div className="mx-3 w-2 h-2 rounded-full" style={{ backgroundColor: interpolatedAccent }}></div>
// //                   <div
// //                     className="w-8 h-px"
// //                     style={{ background: `linear-gradient(to right, transparent, ${interpolatedAccent}, transparent)` }}
// //                   ></div>
// //                 </div>

// //                 <h3
// //                   className="font-serif text-lg font-bold tracking-wider uppercase"
// //                   style={{ color: interpolatedAccent }}
// //                 >
// //                   {interpolatedTitle}
// //                 </h3>

// //                 <p className="text-white text-sm font-light leading-relaxed tracking-wide">{interpolatedDescription}</p>

// //                 <div className="pt-2">
// //                   <div
// //                     className="w-12 h-px mx-auto"
// //                     style={{ background: `linear-gradient(to right, transparent, ${interpolatedAccent}, transparent)` }}
// //                   ></div>
// //                 </div>

// //                 <p
// //                   className="text-gray-300 text-xs font-light tracking-widest uppercase"
// //                   style={{ color: `${interpolatedAccent}99` }}
// //                 >
// //                   Pravasa Luxury
// //                 </p>
// //               </div>

// //               {/* Subtle glow effect */}
// //               <div
// //                 className="absolute inset-0 rounded-lg pointer-events-none"
// //                 style={{ background: `linear-gradient(to bottom right, ${interpolatedAccent}10, transparent)` }}
// //               ></div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //     </>
// //   )
// // }

// // export default Pravasa


// import React, { useEffect, useRef, useState } from "react";
// import "../App.css"; // We'll add some CSS here
// import PravasaPage from "./PravasaPage";
// import {
//   Shield,
//   Phone,
//   Download,
//   Star,
//   Calendar,

// } from "lucide-react"

// export default function Pravasa() {
//   return (
//     <div className="min-h-[300vh] ">
//       <section className="">
//         <PravasaPage />
//       </section>

//       <section id="amenities" className="relative py-20 bg-white">

//         <div className="relative z-10">
//           <h1 className="w-full text-center americana font-bold text-6xl py-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 drop-shadow-2xl">
//             Premium Amenities
//           </h1>
//           <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8 rounded-full shadow-lg"></div>
//           <p className="text-center text-black text-xl max-w-3xl mx-auto px-4 leading-relaxed">
//             Discover world-class facilities designed to elevate your lifestyle
//           </p>
//         </div>
//       </section>

//       {/* First Section with fixed background and amenity card */}
//       <section
//         className="h-screen bg-fixed bg-center bg-cover relative"
//         style={{
//           backgroundImage:
//             "url('img1.jpg')",
//         }}
//       >
//         <div className="h-full bg-black bg-opacity-30 relative">
//           {/* Luxury Amenity Card */}
//           <div
//               className={`absolute bottom-8 right-8 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-sm border border-yellow-400/30 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-yellow-400/20`}
//               style={{
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Card Header with Icon */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
//                     🚗
//                   </div>
//                   <div className="ml-4">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-yellow-400 text-sm font-medium tracking-wider">01</div>
//               </div>

//               {/* Card Content */}
//               <h3 className="text-white text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Luxury Parking
//               </h3>

//               <p className="text-gray-300 text-base leading-relaxed mb-6">A very Luxury Parking with a breathtaking entrance</p>

//               {/* Decorative Elements */}
//               <div className="space-y-3">
//                 <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
//                     ))}
//                   </div>
//                   <div className="text-yellow-400 text-xs font-medium tracking-widest">PREMIUM</div>
//                 </div>
//               </div>

//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/5 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
//             </div>

//             {/* Side Accent Line */}
//             <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
//         </div>
//       </section>

//       {/* Second Section with normal scroll and different amenity card */}
//       <section
//         className="h-screen bg-fixed bg-center bg-cover relative"
//         style={{
//           backgroundImage:
//             "url('img2.jpg')",
//         }}
//       >
//         <div className="h-full bg-black bg-opacity-40 relative">
//           {/* Luxury Amenity Card */}
//           <div
//               className={`absolute bottom-8 right-8 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-sm border border-yellow-400/30 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-yellow-400/20`}
//               style={{
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Card Header with Icon */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
//                     🏸
//                   </div>
//                   <div className="ml-4">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-yellow-400 text-sm font-medium tracking-wider">02</div>
//               </div>

//               {/* Card Content */}
//               <h3 className="text-white text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Badminton Court
//               </h3>

//               <p className="text-gray-300 text-base leading-relaxed mb-6">Designed for both performance and comfort</p>

//               {/* Decorative Elements */}
//               <div className="space-y-3">
//                 <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
//                     ))}
//                   </div>
//                   <div className="text-yellow-400 text-xs font-medium tracking-widest">PREMIUM</div>
//                 </div>
//               </div>

//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/5 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
//             </div>

//             {/* Side Accent Line */}
//             <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
//         </div>
//       </section>

//       {/*Third Section with normal scroll and different amenity card */}
//       <section
//         className="h-screen bg-fixed bg-center bg-cover relative"
//         style={{
//           backgroundImage:
//             "url('img3.jpg')",
//         }}
//       >
//         <div className="h-full bg-black bg-opacity-40 relative">
//           {/* Luxury Amenity Card */}
//           <div
//               className={`absolute bottom-8 right-8 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-sm border border-yellow-400/30 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-yellow-400/20`}
//               style={{
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Card Header with Icon */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
//                     🎨
//                   </div>
//                   <div className="ml-4">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-yellow-400 text-sm font-medium tracking-wider">03</div>
//               </div>

//               {/* Card Content */}
//               <h3 className="text-white text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Luxury Sculptures
//               </h3>

//               <p className="text-gray-300 text-base leading-relaxed mb-6">Crafted for elegance and impact in real world</p>

//               {/* Decorative Elements */}
//               <div className="space-y-3">
//                 <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
//                     ))}
//                   </div>
//                   <div className="text-yellow-400 text-xs font-medium tracking-widest">PREMIUM</div>
//                 </div>
//               </div>

//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/5 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
//             </div>

//             {/* Side Accent Line */}
//             <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
//         </div>
//       </section>
//       <section
//         className="h-screen bg-fixed bg-center bg-cover relative"
//         style={{
//           backgroundImage:
//             "url('img5.jpg')",
//         }}
//       >
//         <div
//               className={`absolute bottom-8 right-8 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-sm border border-yellow-400/30 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-yellow-400/20`}
//               style={{
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Card Header with Icon */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
//                     🏀
//                   </div>
//                   <div className="ml-4">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-yellow-400 text-sm font-medium tracking-wider">04</div>
//               </div>

//               {/* Card Content */}
//               <h3 className="text-white text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Basketball Court
//               </h3>

//               <p className="text-gray-300 text-base leading-relaxed mb-6">Crafted for elegance and impact in real world</p>

//               {/* Decorative Elements */}
//               <div className="space-y-3">
//                 <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
//                     ))}
//                   </div>
//                   <div className="text-yellow-400 text-xs font-medium tracking-widest">PREMIUM</div>
//                 </div>
//               </div>

//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/5 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
//             </div>

//             {/* Side Accent Line */}
//             <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
//       </section>
//       <section
//         className="h-screen bg-fixed bg-center bg-cover relative"
//         style={{
//           backgroundImage:
//             "url('images2/club2.jpeg')",
//         }}
//       >
//         <div
//               className={`absolute bottom-8 right-8 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-sm border border-yellow-400/30 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-yellow-400/20`}
//               style={{
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Card Header with Icon */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
//                     🥂
//                   </div>
//                   <div className="ml-4">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-yellow-400 text-sm font-medium tracking-wider">05</div>
//               </div>

//               {/* Card Content */}
//               <h3 className="text-white text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Luxury Club
//               </h3>

//               <p className="text-gray-300 text-base leading-relaxed mb-6">Experience refined leisure and exclusivity</p>

//               {/* Decorative Elements */}
//               <div className="space-y-3">
//                 <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
//                     ))}
//                   </div>
//                   <div className="text-yellow-400 text-xs font-medium tracking-widest">PREMIUM</div>
//                 </div>
//               </div>

//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/5 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
//             </div>

//             {/* Side Accent Line */}
//             <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
//       </section>
//       <section
//         className="h-screen bg-fixed bg-center bg-cover relative"
//         style={{
//           backgroundImage:
//             "url('images2/club9.jpeg')",
//         }}
//       >
//         <div
//               className={`absolute bottom-8 right-8 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg rounded-2xl p-8 max-w-sm border border-yellow-400/30 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-yellow-400/20`}
//               style={{
//                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
//               }}
//             >
//               {/* Card Header with Icon */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
//                     🏊
//                   </div>
//                   <div className="ml-4">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <div className="text-yellow-400 text-sm font-medium tracking-wider">06</div>
//               </div>

//               {/* Card Content */}
//               <h3 className="text-white text-2xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                 Swimming Pool
//               </h3>

//               <p className="text-gray-300 text-base leading-relaxed mb-6">Dive into luxury and relaxation</p>

//               {/* Decorative Elements */}
//               <div className="space-y-3">
//                 <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
//                     ))}
//                   </div>
//                   <div className="text-yellow-400 text-xs font-medium tracking-widest">PREMIUM</div>
//                 </div>
//               </div>

//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/5 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
//             </div>

//             {/* Side Accent Line */}
//             <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
//       </section>


//       <section
//         id="location"
//         className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
//       >
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px)`,
//               backgroundSize: "50px 50px",
//             }}
//           ></div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="text-center mb-20">
//             <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 americana relative">
//               Location Map
//               <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full shadow-lg"></div>
//             </h2>
//             <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mt-8">
//               Discover our prime location nestled in the heart of natural beauty, with easy access to key attractions
//               and amenities.
//             </p>
//           </div>

//           <div className="relative group">
//             <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
//             <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <img
//                 src="images2/locationMap3.jpg"
//                 alt="Location Map"
//                 className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
//               />
//             </div>
//           </div>
//         </div>
//       </section> 
//         <section
//         id="location"
//         className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
//       >
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px)`,
//               backgroundSize: "50px 50px",
//             }}
//           ></div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="text-center mb-20">
//             <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 americana relative">
//               Site Map
//               <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full shadow-lg"></div>
//             </h2>
//             <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mt-8">
//                Explore our well-connected location surrounded by nature and close to major landmarks.
//             </p>
//           </div>

//           <div className="relative group">
//             <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
//             <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <img
//                 src="images2/club3.jpeg"
//                 alt="Location Map"
//                 className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Make ROF Pravasa Your Home?</h2>
//           <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
//             Don't miss this exclusive pre-launch opportunity. Limited units available with special pricing and payment
//             plans.
//           </p>

//           <div className="grid md:grid-cols-3 gap-6 mb-12">
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
//               <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
//               <h3 className="text-lg font-bold mb-2">Call Now</h3>
//               <p className="text-2xl font-bold text-yellow-400">7827 678 754</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
//               <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
//               <h3 className="text-lg font-bold mb-2">Site Visit</h3>
//               <p className="text-gray-300">Schedule your visit today</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
//               <Download className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
//               <h3 className="text-lg font-bold mb-2">Brochure</h3>
//               <p className="text-gray-300">Download detailed info</p>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             {/* <button className="bg-yellow-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
//               Book Site Visit Now
//             </button> */}
//             <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
//               Download Brochure
//             </button>
//             <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
//               WhatsApp: 7827 678 754
//             </button>
//           </div>
//         </div>
//       </section> 
//       <footer className="bg-black text-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div>
//               <div className="text-2xl font-bold mb-4">
//                 ROF <span className="text-yellow-400">PRAVASA</span>
//               </div>
//               <p className="text-gray-400 mb-4">Ultra Luxury Independent Floors at Sector-88A, Gurugram</p>
//               <div className="flex items-center text-yellow-400">
//                 <Phone className="w-4 h-4 mr-2" />
//                 <span className="font-semibold">7827 678 754</span>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold mb-4">Quick Links</h3>
//               <div className="space-y-2">
//                 <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
//                   About Project
//                 </a>
//                 <a href="#pricing" className="block text-gray-400 hover:text-white transition-colors">
//                   Pricing
//                 </a>
//                 <a href="#amenities" className="block text-gray-400 hover:text-white transition-colors">
//                   Amenities
//                 </a>
//                 <a href="#location" className="block text-gray-400 hover:text-white transition-colors">
//                   Location
//                 </a>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold mb-4">Contact Info</h3>
//               <div className="space-y-2 text-gray-400">
//                 <p>Sector-88A, Gurugram</p>
//                 <p>Dwarka Expressway</p>
//                 <p>Haryana, India</p>
//                 <div className="flex items-center mt-4">
//                   <Shield className="w-4 h-4 mr-2 text-green-400" />
//                   <span className="text-green-400 font-semibold">RERA Approved</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//             <p>&copy; 2024 ROF Pravasa. All rights reserved. | RERA No: 21 of 2025</p>
//           </div>
//         </div>
//       </footer> 
//     </div>
//   )
// }




import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Phone,
  Download,
  MapPin,
  Calendar,
  CreditCard,
  Home,
  Shield,
  CheckCircle,
  ArrowRight,
  Building,
  Car,
  MessageCircle,
  Star,
  FishIcon as Swimming,
  Dumbbell,
  TreePine,
  Coffee,
  ShoppingBag,
  Gamepad2,
} from "lucide-react"

export default function PravasaLeadPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Thank you for your interest! We will contact you soon.")
  }

  const amenities = [
    {
      icon: <Swimming className="w-8 h-8" />,
      title: "Swimming Pool",
      description: "Crystal clear infinity pool with panoramic views",
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Badminton Court",
      description: "Professional quality court for sports enthusiasts",
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Luxury Parking",
      description: "Spacious covered parking with premium finishes",
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Fitness Center",
      description: "State-of-the-art gym with modern equipment",
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Club House",
      description: "Exclusive club with premium amenities",
    },
    {
      icon: <TreePine className="w-8 h-8" />,
      title: "Landscaped Gardens",
      description: "Beautiful green spaces and walking paths",
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Shopping Complex",
      description: "Retail outlets and convenience stores",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "24/7 Security",
      description: "Advanced security systems and surveillance",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-black/80 backdrop-blur-sm"
          }`}
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="hidden md:flex items-center">
                <Shield className="w-4 h-4 mr-1" /> RERA No: 21 of 2025
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
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  <span className={`${scrolled ? "text-gray-900" : "text-white"}`}>ROF</span>
                  <span className="text-green-600 ml-2">PRAVASA</span>
                </div>
                <div className={`ml-3 text-xs ${scrolled ? "text-gray-600" : "text-gray-300"}`}>
                  <div>THE LUXURY</div>
                  <div>WELLNESS LIVING</div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a
                href="#home"
                className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
              >
                Home
              </a>
              <a
                href="#about"
                className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
              >
                About
              </a>
              <a
                href="#amenities"
                className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
              >
                Amenities
              </a>
              <a
                href="#pricing"
                className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
              >
                Pricing
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="flex items-center px-6 py-2 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300">
                <Download className="w-4 h-4 mr-2" />
                Download Brochure
              </button>
              <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-md transition-colors ${scrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
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
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">
                About
              </a>
              <a href="#amenities" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">
                Amenities
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">
                Pricing
              </a>
              <div className="pt-4 space-y-2">
                <button className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300">
                  <Download className="w-4 h-4 mr-2" />
                  Download Brochure
                </button>
                <button className="w-full flex items-center justify-center px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header
        id="home"
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url('/img3.jpg')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="mb-8">

                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  ROF <span className="text-green-400">PRAVASA</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-200 mb-4">Ultra Luxury Independent Floors</p>
                <p className="text-lg text-green-400 font-semibold mb-6">Sector-88A, Gurugram • Dwarka Expressway</p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Home className="w-5 h-5 mr-2 text-green-400" />
                    <span className="text-sm">Starting 2.4 Cr</span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                    <span className="text-sm">30:70 Payment Plan</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Phone className="w-5 h-5 mr-2" />
                  Call: 7827 678 754
                </button>
                <button className="flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm">
                  <Download className="w-5 h-5 mr-2" />
                  Download Brochure
                </button>
              </div>
            </div>

            {/* Right Content - Lead Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Exclusive Details</h3>
                <p className="text-gray-600">Fill the form to receive pricing & floor plans</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 flex items-center justify-center text-lg bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Price Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-green-600" />
                    <span>RERA Approved</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>Premium Location</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose ROF Pravasa?</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ROF Pravasa, developed by ROF Infratech & Housing Pvt. Ltd. is an ultra‑luxury, low-rise residential
              enclave of 3 BHK+3T builder floors in Sector 88A, Gurugram, along the Dwarka Expressway.
              Spanning about 12 acres with over 3.5 acres dedicated to greenery, the layout includes a Basement
              + Stilt + 4 floors, with fourth-floor units featuring exclusive roof rights. With 816 units ranging from
              ~1,850 to 1,970 sq ft and prices beginning around ₹2.4 Cr, Pravasa incorporates energy-efficient
              walls, a three-tier security system, and earthquake-resistant RCC structure. Positioned just minutes
              from NH‑8, IGI Airport (~20 min), IMT Manesar, Medanta, and more, this project boasts excellent
              connectivity and is supported by flexible payment plans and RERA approvals (e.g., RERA-GRG-21 of
              2025).

              Designed for urban families, professionals, and savvy investors, ROF Pravasa delivers a lifestyle
              rooted in sophistication and wellness. With 70% green spaces, high-end amenities like a clubhouse,
              jogging tracks, indoor/outdoor play zones, lifts, CCTV, dedicated parking, and modular kitchens, the
              development emphasizes both aesthetic elegance and functional luxury. Supported by ROF’s
              enduring reputation for transparency and timely execution, Pravasa offers both a serene retreat and
              a high-potential asset, with expected 100% appreciation over 2–2½ years as the infrastructure along
              the Dwarka Expressway advances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Prime Location</h3>
              <p className="text-gray-600">
                Strategic location on Dwarka Expressway with excellent connectivity to Delhi and Gurgaon
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Luxury Design</h3>
              <p className="text-gray-600">Contemporary architecture with premium finishes and spacious layouts</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Value</h3>
              <p className="text-gray-600">
                High appreciation potential with attractive payment plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">World-Class Amenities</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Enjoy a lifestyle of luxury with our comprehensive range of premium amenities designed for your comfort
              and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  {amenity.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{amenity.title}</h3>
                <p className="text-gray-600 text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Attractive Pricing & Payment Plans</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Flexible payment options with attractive pre-launch benefits to make your dream home affordable
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">3BHK Apartments</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">₹72L now</div>
                <div className="text-gray-600">Rest on possession</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Booking Amount</span>
                  <span className="font-semibold text-gray-900">₹10 LAC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Payment Plan</span>
                  <span className="font-semibold text-gray-900">30:70</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-green-200 relative">
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                PREMIUM
              </div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Independent Floors</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">₹2.4 CR*</div>
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
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Customization</span>
                  <span className="font-semibold text-green-600">Available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Perfect Investment Opportunity</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                    <span>High appreciation potential in Dwarka Expressway corridor</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                    <span>Ready-to-move luxury independent floors</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                    <span>Premium location with excellent connectivity</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                    <span>World-class amenities and infrastructure</span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-5xl font-bold text-green-400 mb-2">₹72L Now</div>
                <div className="text-xl mb-6">Rest on possession for 3BHK</div>
                <button className="flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mx-auto lg:mx-0">
                  Get Price Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make ROF Pravasa Your Home?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Don't miss this exclusive pre-launch opportunity. Limited units available with special pricing.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Call Now</h3>
              <p className="text-2xl font-bold">7827 678 754</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Calendar className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Site Visit</h3>
              <p>Schedule your visit today</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Download className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Brochure</h3>
              <p>Download detailed info</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </button>
            <button className="flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              <Phone className="w-5 h-5 mr-2" />
              Schedule Site Visit
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                ROF <span className="text-green-400">PRAVASA</span>
              </div>
              <p className="text-gray-400 mb-4">Ultra Luxury Independent Floors at Sector-88A, Gurugram</p>
              <div className="flex items-center text-green-400">
                <Phone className="w-4 h-4 mr-2" />
                <span className="font-semibold">7827 678 754</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                  About Project
                </a>
                <a href="#amenities" className="block text-gray-400 hover:text-white transition-colors">
                  Amenities
                </a>
                <a href="#pricing" className="block text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>Sector-88A, Gurugram</p>
                <p>Dwarka Expressway</p>
                <p>Haryana, India</p>
                <div className="flex items-center mt-4">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-green-400 font-semibold">RERA Approved</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ROF Pravasa. All rights reserved. | RERA No: 21 of 2025</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center text-white animate-pulse transition-all duration-300 hover:scale-110"
          onClick={() => window.open("https://wa.me/917827678754", "_blank")}
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>
    </div>
  )
}






















