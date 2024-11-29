import React from "react";

export default function VisitUserProfileLoading() {
  return (
    <div className="border-x border-gray-700 h-screen">
      <div className="p-4 gap-4 border-b border-gray-600 animate-pulse">
        {/* Skeleton Profile Photo */}
        <div className="bg-gray-700 rounded-full w-[150px] h-[150px]"></div>

        {/* Skeleton User Info */}
        <div className="lg:flex justify-between mt-4">
          <div>
            <div className="bg-gray-700 h-6 w-32 rounded mt-2"></div>
            <div className="bg-gray-600 h-4 w-64 rounded mt-2"></div>
            <div className="bg-gray-600 h-4 w-40 rounded mt-2"></div>

            {/* Skeleton Followers/Following */}
            <div className="flex gap-4 mt-2">
              <div className="bg-gray-700 h-4 w-16 rounded"></div>
              <div className="bg-gray-700 h-4 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
