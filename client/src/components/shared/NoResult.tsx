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
      <div className="flex justify-center h-full items-center text-center">
        <div>
          <FiAlertCircle size={40} className="text-gray-400 mx-auto" />
          <p className="text-gray-500 text-lg mt-4">{message}</p>
          <p className="text-sm text-gray-400 mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoResults;
