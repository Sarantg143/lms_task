import React, { useState, useEffect } from 'react';
import { GetUserTasksById } from '../../service/api'; // Adjust path as needed

const UserTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from localStorage (replace with auth context if available)
  const loginData = JSON.parse(localStorage.getItem('loginData'));
  const currentUserId = loginData?.userId || '680373b6c9e849266316e9da'; // Fallback user ID
  const token = loginData?.token; // Token for API authentication

  // Fetch tasks for the current user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for valid authentication
        if (!token) {
          throw new Error('Please log in to view tasks');
        }
        if (!currentUserId) {
          throw new Error('User ID is missing');
        }

        const response = await GetUserTasksById(currentUserId);

        // Validate response is an array
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format from server');
        }

        setTasks(response);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUserId, token]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Tasks</h2>
        {loading ? (
          <p className="text-gray-500 text-center">Loading tasks...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks assigned to you yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800">{task.title || 'Untitled'}</h3>
                <p className="text-gray-600">{task.description || 'No description'}</p>
                <p className="text-gray-500">Due: {formatDate(task.dueDate)}</p>
                {task.file && (
                  <div className="mt-2">
                    <div className="border rounded p-2">
                      <a
                        href={task.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Task File
                      </a>
                      <p className="text-gray-500 text-sm mt-1">
                        Note: File preview may not be supported for all file types.
                      </p>
                    </div>
                  </div>
                )}
                {task.mySubmission && (
                  <div className="mt-2">
                    <p className="text-gray-600">Your Submission:</p>
                    <p className="text-gray-500">
                      Status: {task.mySubmission.status || 'N/A'}
                      {task.mySubmission.markGiven && `, Marks: ${task.mySubmission.markGiven}`}
                    </p>
                    {task.mySubmission.file && (
                      <a
                        href={task.mySubmission.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Submission File
                      </a>
                    )}
                    {task.mySubmission.driveLink && (
                      <a
                        href={task.mySubmission.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-2"
                      >
                        View Drive Link
                      </a>
                    )}
                    {task.mySubmission.reviewNote && (
                      <p className="text-gray-500">Review: {task.mySubmission.reviewNote}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTask;