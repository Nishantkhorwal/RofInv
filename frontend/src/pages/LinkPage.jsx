import React from "react";

const links = [
  { img: "images2/pravasaSS.PNG", url: "/mainpage", heading: "Pravasa" },
  { img: "images2/sukoonSS.PNG", url: "/sukoon", heading: "Sukoon" }
];

function LinkPage() {
  const role = localStorage.getItem("role");

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFFDD0]">
      <div className="flex flex-col md:flex-row items-center gap-12 relative">
        {links.map((link, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-semibold text-gray-800">{link.heading}</h1>
            <a
              href={link.url}
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-110 active:scale-95"
            >
              <img
                src={link.img}
                alt={`Link ${index + 1}`}
                className="w-[400px] h-[400px] object-cover rounded-xl border-4 border-white shadow-md hover:shadow-2xl transition-all"
              />
              <span className="absolute inset-0 flex justify-center items-center text-6xl font-bold text-white bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                +
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LinkPage;



