import { useState, useEffect } from "react";
import { FaUser, FaTasks, FaSpinner, FaChartBar } from "react-icons/fa";
import { taskAPI, userAPI, projectAPI } from "../services/api";

const WorkloadDistribution = ({ projectId }) => {
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchWorkload = async () => {
    try {
      setLoading(true);

      // Get project details
      const projectRes = await projectAPI.getOne(projectId);
      const project = projectRes.data.project;

      // Get all tasks for this project
      const tasksRes = await taskAPI.getAll();
      const projectTasks = tasksRes.data.tasks.filter(
        (task) => (task.project._id || task.project) === projectId
      );

      // Get all users
      const usersRes = await userAPI.getAll();
      const allUsers = usersRes.data.users;

      // Get project members
      const projectMemberIds = [
        project.owner._id || project.owner,
        ...(project.members || []).map((m) => m._id || m),
      ];

      const projectUsers = allUsers.filter((user) =>
        projectMemberIds.includes(user._id)
      );

      // Calculate workload for each user
      const workloadData = projectUsers.map((user) => {
        const userTasks = projectTasks.filter(
          (task) => task.assignedTo?._id === user._id
        );

        const tasksByStatus = {
          todo: userTasks.filter((t) => t.status === "todo").length,
          inProgress: userTasks.filter((t) => t.status === "in-progress")
            .length,
          done: userTasks.filter((t) => t.status === "done").length,
        };

        return {
          user,
          totalTasks: userTasks.length,
          tasksByStatus,
          tasks: userTasks,
        };
      });

      // Sort by total tasks (descending)
      workloadData.sort((a, b) => b.totalTasks - a.totalTasks);

      setWorkload(workloadData);
    } catch (error) {
      console.error("Failed to fetch workload:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxTasks = () => {
    return Math.max(...workload.map((w) => w.totalTasks), 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="text-4xl text-purple-600 animate-spin" />
      </div>
    );
  }

  if (workload.length === 0) {
    return (
      <div className="text-center py-12">
        <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No team members found</p>
      </div>
    );
  }

  const maxTasks = getMaxTasks();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <FaChartBar className="text-2xl text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">
          Workload Distribution
        </h3>
      </div>

      {workload.map((item) => (
        <div
          key={item.user._id}
          className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {item.user.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.user.name}</p>
              <p className="text-sm text-gray-600">{item.user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {item.totalTasks}
              </p>
              <p className="text-xs text-gray-600">tasks</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                style={{
                  width: `${(item.totalTasks / maxTasks) * 100}%`,
                }}></div>
            </div>
          </div>

          {/* Task Breakdown */}
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">
                To Do:{" "}
                <span className="font-semibold">{item.tasksByStatus.todo}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-600">
                In Progress:{" "}
                <span className="font-semibold">
                  {item.tasksByStatus.inProgress}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-600">
                Done:{" "}
                <span className="font-semibold">{item.tasksByStatus.done}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkloadDistribution;
