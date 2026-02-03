import React from "react";
import type { LearningResource } from "../types/learningResource";

interface ResourceDetailProps {
  resource: LearningResource;
  onClose: () => void;
}

const ResourceDetail: React.FC<ResourceDetailProps> = ({ resource, onClose }) => {
  

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl md:text-3xl font-bold pr-4">{resource.title}</h2>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{resource.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resource Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Resource Type</h3>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-gray-100 text-gray-800">
                  {resource.resourceType}
                </span>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Difficulty</h3>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-gray-100 text-gray-800">
                  {resource.difficulty}
                </span>
              </div>

              {/* Estimated Time */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Estimated Time</h3>
                <p className="text-gray-800 font-medium">{resource.estimatedMinutes} minutes</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags && resource.tags.length > 0 ? (
                    resource.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No tags</span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(resource.createdAt).toLocaleDateString()}
                </div>
                {resource.updatedAt && (
                  <div>
                    <span className="font-medium">Updated:</span>{" "}
                    {new Date(resource.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceDetail;
