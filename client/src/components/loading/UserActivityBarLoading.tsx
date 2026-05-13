import React from "react";

export default function UserActivityBarLoading() {
  return (
    <div className="min-w-[780px] px-20 h-[400px] relative">
      {/* Cartesian Grid Skeleton */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-1">
        {Array(6)
          .fill(null)
          .map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="border-b border-dashed border-gray-300 h-full col-span-12"
            ></div>
          ))}
      </div>

      {/* Placeholder Bars for each column */}
      <div className="absolute inset-0 grid grid-cols-12 gap-1">
        {Array(12)
          .fill(null)
          .map((_, colIdx) => (
            <div
              key={colIdx}
              className="flex flex-col items-center justify-end h-full gap-2"
            >
              {Array(6)
                .fill(null)
                .map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className={`w-8 bg-gray-300 rounded animate-pulse`}
                    style={{
                      height: `${Math.random() * 50}px`,
                    }}
                  ></div>
                ))}
            </div>
          ))}
      </div>

      {/* Tooltip Placeholder */}
      <div className="absolute top-32 left-60 bg-gray-200 p-2 rounded shadow-lg animate-pulse">
        <p className="h-4 w-24 bg-gray-300 mb-2 rounded"></p>
        <p className="h-4 w-20 bg-gray-300 mb-1 rounded"></p>
        <p className="h-4 w-16 bg-gray-300 rounded"></p>
      </div>
    </div>
  );
}
