"use client";
import React, { useState } from "react";

export default function YearButton() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  return (
    <div className="flex space-x-2">
      {years.map((year) => (
        <button
          key={year}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring ${
            selectedYear === year
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedYear(year)}
        >
          {year == currentYear ? "This Year" : year}
        </button>
      ))}
    </div>
  );
}
