import React, { useState } from "react";
import { getAIRecommendations, getErrorMessage } from "../services/api";
import ErrorAlert from "../components/ErrorAlert";
import ResourceDetail from "../components/ResourceDetail";
import { useThrottle } from "../hooks/useThrottle";
import type { AIRecommendationResponse, LearningResource } from "../types/learningResource";

const ResourceCard: React.FC<{
  resource: LearningResource;
  index: number;
  onResourceClick: (resource: LearningResource) => void;
}> = ({ resource, index, onResourceClick }) => (
  <div
    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300"
    onClick={() => onResourceClick(resource)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onResourceClick(resource)}
  >
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 mb-1 text-indigo-600 hover:text-indigo-800">
          {resource.title}
        </h4>
        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border">
            {resource.resourceType}
          </span>
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border">
            {resource.difficulty}
          </span>
          <span className="text-xs text-gray-500">{resource.estimatedMinutes} mins</span>
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.map((tag, i) => (
                <span key={i} className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AIRecommendation: React.FC = () => {
  const [goal, setGoal] = useState<string>("");
  const [maxItems, setMaxItems] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAIRecommendations(goal, maxItems);
      setRecommendations(result);
    } catch (err) {
      setError(getErrorMessage(err));
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  const throttledSubmit = useThrottle(handleSubmit, 500);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-8">
      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} />
      )}
      <h2 className="text-2xl font-semibold mb-4">AI Learning Path Advisor</h2>
      <textarea
        placeholder="Describe your learning goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md mb-4"
      />
      <input
        type="number"
        value={maxItems}
        onChange={(e) => setMaxItems(Number(e.target.value))}
        placeholder="Max Items"
        className="w-full p-4 border border-gray-300 rounded-md mb-4"
      />
      <button
        onClick={() => throttledSubmit()}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        Get Recommendations
      </button>

      {loading && <p className="mt-4 text-center">Loading...</p>}

      {recommendations && (
        <div className="mt-6 space-y-6">
          
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-800 mb-1">Summary</h3>
            <p className="text-gray-700">{recommendations.summary}</p>
          </div>
          {recommendations.explanation && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">{recommendations.explanation}</p>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Resources</h3>
            <div className="space-y-3">
              {recommendations.resources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                  onResourceClick={setSelectedResource}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-indigo-600 text-white rounded-lg flex items-center justify-between">
            <span className="font-medium">Total estimated time</span>
            <span className="font-bold text-lg">{recommendations.totalEstimatedMinutes} minutes</span>
          </div>
        </div>
      )}

      {selectedResource && (
        <ResourceDetail
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default AIRecommendation;
