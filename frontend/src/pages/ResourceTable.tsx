import React, { useState, useEffect } from "react";
import { fetchResources, fetchResourceById } from "../services/api";
import ResourceDetail from "../components/ResourceDetail";
import type { LearningResource } from "../types/learningResource";
import { useDebounce } from "../hooks/useDebounce";
import { useThrottle } from "../hooks/useThrottle";

interface Resource {
  id: string;
  title: string;
  resourceType: string;
  difficulty: string;
  estimatedMinutes: number;
}

const PAGE_SIZE = 10; //we can also handle this from user input, user can select how many items per page, but for now keeping it simple

const ResourceTable: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState<string>("");
  const [resourceType, setResourceType] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [loadingResourceId, setLoadingResourceId] = useState<string | null>(null);


  const debouncedSearch = useDebounce(search, 300);
  const debouncedTag = useDebounce(tag, 300);

  useEffect(() => {
    const getResources = async () => {
      setLoading(true);
      const data = await fetchResources(
        debouncedSearch,
        resourceType,
        difficulty,
        debouncedTag,
        currentPage,
        PAGE_SIZE
      );
      setResources(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setLoading(false);
    };
    getResources();
  }, [debouncedSearch, resourceType, difficulty, debouncedTag, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const throttledPageChange = useThrottle(handlePageChange, 500);

  const handleViewResource = async (id: string) => {
    setLoadingResourceId(id);
    const resource = await fetchResourceById(id);
    setLoadingResourceId(null);
    if (resource) {
      setSelectedResource(resource);
    }
  };

  const throttledViewResource = useThrottle(handleViewResource, 500);

  const handleCloseModal = () => {
    setSelectedResource(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Resource Catalogue</h2>
        {!loading && (
          <p className="text-gray-600 text-sm">
            {totalItems === 0
              ? "No results found"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, totalItems)} of ${totalItems} results`}
          </p>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          onChange={(e) => setResourceType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Resource Type</option>
          <option value="Article">Article</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Course">Course</option>
        </select>
        <select
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Estimated Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{resource.title}</td>
                <td className="p-2">{resource.resourceType}</td>
                <td className="p-2">{resource.difficulty}</td>
                <td className="p-2">{resource.estimatedMinutes} mins</td>
                <td className="p-2">
                  <button
                    onClick={() => throttledViewResource(resource.id)}
                    disabled={loadingResourceId !== null}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingResourceId === resource.id ? "Loading..." : "View Details"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => throttledPageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => throttledPageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedResource && (
        <ResourceDetail resource={selectedResource} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ResourceTable;
