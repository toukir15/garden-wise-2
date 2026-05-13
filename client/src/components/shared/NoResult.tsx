import React from "react";
import { FiAlertCircle } from "react-icons/fi";

interface NoResultsProps {
  message?: string;
  description?: string;
  height: string;
}

const NoResults: React.FC<NoResultsProps> = ({
  message = "No data available.",
  description = "Try adjusting your filters or check back later.",
  height,
}) => {
  return (
    <div className={`${height}`}>
      <div className="flex justify-center h-full items-center text-center px-4">
        <div>
          <FiAlertCircle
            size={40}
            className="text-gray-400 mx-auto sm:text-gray-500 sm:text-5xl"
          />
          <p className="text-gray-500 text-base sm:text-lg mt-2 sm:mt-4 xl:mt-6">
            {message}
          </p>
          <p className="text-sm text-gray-400 sm:text-base mt-1 sm:mt-2 xl:mt-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoResults;
