import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaFilter,
  FaSave,
} from "react-icons/fa";
import { projectAPI, taskAPI, teamAPI } from "../services/api";

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({
    projects: [],
    tasks: [],
    teams: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    projects: true,
    tasks: true,
    teams: true,
    status: "all",
    priority: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("saved_search_filters");
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setResults({ projects: [], tasks: [], teams: [] });
        return;
      }

      setLoading(true);
      try {
        const searchPromises = [];

        if (activeFilters.projects) {
          searchPromises.push(
            projectAPI
              .getAll({
                search: searchTerm,
                status:
                  activeFilters.status !== "all"
                    ? activeFilters.status
                    : undefined,
              })
              .then((res) => ({
                projects: res.data.projects || res.data || [],
              }))
              .catch(() => ({ projects: [] }))
          );
        }

        if (activeFilters.tasks) {
          searchPromises.push(
            taskAPI
              .getAll({
                search: searchTerm,
                status:
                  activeFilters.status !== "all"
                    ? activeFilters.status
                    : undefined,
                priority:
                  activeFilters.priority !== "all"
                    ? activeFilters.priority
                    : undefined,
              })
              .then((res) => ({ tasks: res.data.tasks || res.data || [] }))
              .catch(() => ({ tasks: [] }))
          );
        }

        if (activeFilters.teams) {
          searchPromises.push(
            teamAPI
              .getAll({ search: searchTerm })
              .then((res) => ({ teams: res.data.teams || res.data || [] }))
              .catch(() => ({ teams: [] }))
          );
        }

        const searchResults = await Promise.all(searchPromises);
        const combinedResults = searchResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          { projects: [], tasks: [], teams: [] }
        );

        setResults(combinedResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilters]);

  const handleResultClick = (type, id) => {
    setIsOpen(false);
    setSearchTerm("");

    switch (type) {
      case "project":
        navigate(`/projects/${id}`);
        break;
      case "task":
        navigate(`/tasks/${id}`);
        break;
      case "team":
        navigate(`/teams/${id}`);
        break;
      default:
        break;
    }
  };

  const saveCurrentFilter = () => {
    const filterName = prompt("Enter a name for this filter:");
    if (filterName) {
      const newFilter = {
        id: Date.now(),
        name: filterName,
        filters: { ...activeFilters },
      };
      const updated = [...savedFilters, newFilter];
      setSavedFilters(updated);
      localStorage.setItem("saved_search_filters", JSON.stringify(updated));
    }
  };

  const loadSavedFilter = (filter) => {
    setActiveFilters(filter.filters);
    setShowFilters(false);
  };

  const deleteSavedFilter = (id) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem("saved_search_filters", JSON.stringify(updated));
  };

  const totalResults =
    (results.projects?.length || 0) +
    (results.tasks?.length || 0) +
    (results.teams?.length || 0);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects, tasks, teams..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-48 xl:w-64 px-4 py-2 pl-10 pr-20 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

        {/* Filter Toggle & Clear */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              showFilters ? "text-blue-600" : "text-gray-400"
            }`}
            title="Filters">
            <FaFilter className="text-xs" />
          </button>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setResults({ projects: [], tasks: [], teams: [] });
              }}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear">
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (searchTerm.length >= 2 || showFilters) && (
        <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Filters Panel */}
          {showFilters && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm text-gray-900">
                  Search Filters
                </h3>
                <button
                  onClick={saveCurrentFilter}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <FaSave className="mr-1" /> Save
                </button>
              </div>

              {/* Entity Type Filters */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Search In:
                </label>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.projects}
                      onChange={(e) =>
                        setActiveFilters({
                          ...activeFilters,
                          projects: e.target.checked,
                        })
                      }
                      className="mr-1.5"
                    />
                    <span className="text-xs">Projects</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.tasks}
                      onChange={(e) =>
                        setActiveFilters({
                          ...activeFilters,
                          tasks: e.target.checked,
                        })
                      }
                      className="mr-1.5"
                    />
                    <span className="text-xs">Tasks</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.teams}
                      onChange={(e) =>
                        setActiveFilters({
                          ...activeFilters,
                          teams: e.target.checked,
                        })
                      }
                      className="mr-1.5"
                    />
                    <span className="text-xs">Teams</span>
                  </label>
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status:
                </label>
                <select
                  value={activeFilters.status}
                  onChange={(e) =>
                    setActiveFilters({
                      ...activeFilters,
                      status: e.target.value,
                    })
                  }
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded">
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              {/* Priority Filter (for tasks) */}
              {activeFilters.tasks && (
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priority:
                  </label>
                  <select
                    value={activeFilters.priority}
                    onChange={(e) =>
                      setActiveFilters({
                        ...activeFilters,
                        priority: e.target.value,
                      })
                    }
                    className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded">
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              )}

              {/* Saved Filters */}
              {savedFilters.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Saved Filters:
                  </label>
                  <div className="space-y-1">
                    {savedFilters.map((filter) => (
                      <div
                        key={filter.id}
                        className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-gray-200">
                        <button
                          onClick={() => loadSavedFilter(filter)}
                          className="text-xs text-blue-600 hover:text-blue-700 flex-1 text-left">
                          {filter.name}
                        </button>
                        <button
                          onClick={() => deleteSavedFilter(filter.id)}
                          className="text-xs text-red-600 hover:text-red-700 ml-2">
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {searchTerm.length >= 2 && (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                </div>
              ) : totalResults === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">No results found for "{searchTerm}"</p>
                </div>
              ) : (
                <div className="p-2">
                  {/* Projects */}
                  {results.projects && results.projects.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2 flex items-center">
                        <FaProjectDiagram className="mr-2" /> Projects (
                        {results.projects.length})
                      </h3>
                      {results.projects.map((project) => (
                        <button
                          key={project._id}
                          onClick={() =>
                            handleResultClick("project", project._id)
                          }
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors">
                          <div className="font-medium text-sm text-gray-900">
                            {project.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {project.description}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                project.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                              {project.status}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tasks */}
                  {results.tasks && results.tasks.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2 flex items-center">
                        <FaTasks className="mr-2" /> Tasks (
                        {results.tasks.length})
                      </h3>
                      {results.tasks.map((task) => (
                        <button
                          key={task._id}
                          onClick={() => handleResultClick("task", task._id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors">
                          <div className="font-medium text-sm text-gray-900">
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {task.description}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                              {task.status}
                            </span>
                            {task.priority && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  task.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : task.priority === "medium"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Teams */}
                  {results.teams && results.teams.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2 flex items-center">
                        <FaUsers className="mr-2" /> Teams (
                        {results.teams.length})
                      </h3>
                      {results.teams.map((team) => (
                        <button
                          key={team._id}
                          onClick={() => handleResultClick("team", team._id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors">
                          <div className="font-medium text-sm text-gray-900">
                            {team.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {team.members?.length || 0} members
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
