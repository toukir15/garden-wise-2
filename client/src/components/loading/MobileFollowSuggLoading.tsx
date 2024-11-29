import React from "react";

export default function MobileFollowSuggLoading() {
  return (
    <div className="flex space-x-2 py-6 justify-center  xl:hidden ">
      {[1, 2, 3].map((item) => (
        <div key={item} className="w-28 animate-pulse">
          <div className="h-28 w-28 bg-gray-700"></div>
          <div className="h-4 mt-[4px] bg-gray-700 rounded w-24"></div>
          <div className="h-4 mt-1 bg-gray-700 rounded w-20"></div>
          <div className="h-8 mt-2 bg-gray-700 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}
