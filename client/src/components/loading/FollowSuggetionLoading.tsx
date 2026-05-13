import React from "react";

export default function FollowSuggetionLoading() {
  return (
    <div className="h-[calc(100vh-150px)]">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="py-3 border-b  border-gray-900 animate-pulse flex gap-2 px-2 items-center"
        >
          {/* Profile Photo Skeleton */}
          <div>
            <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
          </div>

          {/* User Info and Follow Button Skeleton */}
          <div className="flex justify-between items-center w-full">
            <div>
              <div className="h-4 bg-gray-700 rounded-md w-24 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded-md w-16"></div>
            </div>

            <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
