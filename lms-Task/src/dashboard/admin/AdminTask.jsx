import React, { useState, useEffect } from 'react';
import { CreateTask, UploadFileTask, GetAllTasks, GetAllUsers } from '../../service/api';

const AdminTask = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    selectedUser: [],
    pdfFile: null,
  });

  const [selectedUserType, setSelectedUserType] = useState('admin');
  const [users, setUsers] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [validationMessages, setValidationMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTasks(true);
      try {
        // Fetch tasks
        const tasks = await GetAllTasks();
        console.log('GetAllTasks response:', tasks); // Debug API response
        const normalizedTasks = (Array.isArray(tasks) ? tasks : []).map((task) => {
          console.log('Task assignedTo:', task.assignedTo); // Debug assignedTo
          return {
            ...task,
            assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [],
            file: task.file || null,
          };
        });
        setAssignedTasks(normalizedTasks);

        // Fetch users with task assignments
        const userData = await GetAllUsers();
        console.log('Processed users:', userData); // Debug processed users
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (error) {
        console.error('Fetch data error:', error);
        setValidationMessages((prev) => [
          ...prev,
          error.message || 'Failed to fetch tasks or users',
        ]);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'selectedUser') {
      setTaskData((prev) => {
        const selectedUsers = checked
          ? [...prev.selectedUser, value]
          : prev.selectedUser.filter((userId) => userId !== value);
        return { ...prev, selectedUser: selectedUsers };
      });
    } else {
      setTaskData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setValidationMessages((prev) => [
          ...prev,
          'Invalid file type. Please upload a PDF file.',
        ]);
        setTaskData((prev) => ({ ...prev, pdfFile: null }));
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setValidationMessages((prev) => [
          ...prev,
          'File size exceeds 5MB. Please upload a smaller PDF file.',
        ]);
        setTaskData((prev) => ({ ...prev, pdfFile: null }));
        return;
      }
      setTaskData((prev) => ({ ...prev, pdfFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = [];

    // Validate form inputs
    if (!taskData.title) errors.push('Task Title is required.');
    if (!taskData.description) errors.push('Description is required.');
    if (!taskData.dueDate) errors.push('Due Date is required.');
    if (selectedUserType === 'user' && taskData.selectedUser.length === 0) {
      errors.push('Please select at least one user.');
    }

    if (errors.length > 0) {
      setValidationMessages((prev) => [...prev, ...errors]);
      return;
    }

    try {
      setIsUploading(true);
      let fileData = null;

      // Handle file upload if selected
      if (taskData.pdfFile) {
        try {
          const formData = new FormData();
          formData.append('file', taskData.pdfFile);
          const uploadResponse = await UploadFileTask(formData);
          console.log('UploadFileTask response:', uploadResponse); // Debug API response

          // Check if uploadResponse is an error string
          if (typeof uploadResponse === 'string') {
            throw new Error(uploadResponse || 'File upload failed');
          }

          // Extract fileUrl from response.data
          fileData = uploadResponse.data?.fileUrl;
          if (!fileData) {
            console.warn('No fileUrl in upload response:', uploadResponse.data);
            setValidationMessages((prev) => [
              ...prev,
              'File uploaded but no file URL returned. Task will be created without a file.',
            ]);
          }
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          setValidationMessages((prev) => [
            ...prev,
            uploadError.message || 'Failed to upload PDF file. Task will be created without a file.',
          ]);
          fileData = null; // Proceed without file
        }
      }

      // Create task
      const apiTaskData = {
        title: taskData.title,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate).toISOString(),
        assignedTo: selectedUserType === 'admin' ? [] : taskData.selectedUser,
        file: fileData, // Store file URL or null
      };

      const newTask = await CreateTask(apiTaskData);
      console.log('CreateTask response:', newTask); // Debug API response
      const normalizedTask = {
        ...newTask,
        assignedTo: Array.isArray(newTask.assignedTo) ? newTask.assignedTo : [],
        file: newTask.file || null,
      };
      setAssignedTasks((prev) => [...prev, normalizedTask]);

      // Reset form
      setTaskData({
        title: '',
        description: '',
        dueDate: '',
        selectedUser: [],
        pdfFile: null,
      });
      setSelectedUserType('admin');
      setValidationMessages([]);
    } catch (error) {
      console.error('Task creation failed:', error);
      setValidationMessages((prev) => [
        ...prev,
        error.message || 'Failed to create task',
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const closeValidationMessage = (index) => {
    setValidationMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {validationMessages.length > 0 && (
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {validationMessages.map((message, index) => (
            <div
              key={index}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex justify-between items-center"
            >
              <p>{message}</p>
              <button
                onClick={() => closeValidationMessage(index)}
                className="text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="w-1/3 mr-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-full sticky top-0 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Add Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Assign New Task"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                placeholder="Description"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="dueDate">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Assign To</label>
              <div className="flex space-x-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={selectedUserType === 'admin'}
                    onChange={() => setSelectedUserType('admin')}
                    className="mr-2 focus:ring-green-500"
                  />
                  Admin
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={selectedUserType === 'user'}
                    onChange={() => setSelectedUserType('user')}
                    className="mr-2 focus:ring-green-500"
                  />
                  User
                </label>
              </div>
              {selectedUserType === 'user' && (
                <div className="mt-2">
                  <label className="block text-gray-700 mb-2">Select Users</label>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <label key={user._id} className="flex items-center">
                        <input
                          type="checkbox"
                          name="selectedUser"
                          value={user._id}
                          checked={taskData.selectedUser.includes(user._id)}
                          onChange={handleChange}
                          className="mr-2 focus:ring-green-500"
                        />
                        {user.username || user.name || user._id}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="pdfUpload">
                Upload PDF
              </label>
              <input
                type="file"
                id="pdfUpload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isUploading}
              />
              {taskData.pdfFile && (
                <div className="mt-2">
                  <p className="text-green-600">Selected: {taskData.pdfFile.name}</p>
                  <div className="mt-2 border rounded p-2">
                    <iframe
                      src={URL.createObjectURL(taskData.pdfFile)}
                      title="PDF Preview"
                      className="w-full h-64"
                      style={{ border: 'none' }}
                    ></iframe>
                    <p className="text-gray-500 text-sm mt-1">
                      Note: PDF preview may not be supported in all browsers.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add Task'}
            </button>
          </form>
        </div>
      </div>

      <div className="w-2/3">
        <div className="bg-white p-6 rounded-lg shadow-md h-full sticky top-0 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Assigned Tasks</h2>
          {isLoadingTasks ? (
            <p className="text-gray-500 text-center">Loading tasks...</p>
          ) : assignedTasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks have been created yet</p>
          ) : (
            <div className="space-y-4">
              {assignedTasks.map((task, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-800">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    Assigned to:{' '}
                    {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                      ? task.assignedTo
                          .map((userOrId) => {
                            // If userOrId is an object (e.g., { _id, username })
                            if (typeof userOrId === 'object' && userOrId) {
                              return userOrId.username || userOrId.name || userOrId._id || 'Unknown User';
                            }
                            // If userOrId is a string (user ID), find user in users state
                            const user = users.find((u) => u._id === userOrId);
                            return user ? user.username || user.name || user._id : userOrId || 'Unknown User';
                          })
                          .join(', ')
                      : 'Admin'}
                  </p>
                  {task.file && (
                    <div className="mt-2">
                      <h4 className="text-green-600 font-semibold">Attached PDF:</h4>
                      <div className="mt-2 border rounded p-2">
                        <iframe
                          src={task.file}
                          title={`PDF for ${task.title}`}
                          className="w-full h-64"
                          style={{ border: 'none' }}
                        ></iframe>
                        <p className="text-gray-500 text-sm mt-1">
                          Note: PDF preview may not be supported in all browsers.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTask;