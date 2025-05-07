import React, { useState, useEffect } from "react";
import { GetAllQueries, CreateQuery } from "../../service/api";

// Debug log to check imports
console.log("Imported GetAllQueries:", GetAllQueries);
console.log("Imported CreateQuery:", CreateQuery);

function Query() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    requestedDate: "",
    requestMessage: "",
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and fetch queries on mount
  useEffect(() => {
    console.log("Query component mounted");

    // Retrieve and validate loginData
    let loginData;
    try {
      const rawData = localStorage.getItem("loginData");
      console.log("Raw loginData from localStorage:", rawData);
      loginData = rawData ? JSON.parse(rawData) : null;
      console.log("Parsed loginData:", loginData);
    } catch (error) {
      console.error("Error parsing loginData:", error.message);
      setAuthStatus("Invalid session data. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      setIsLoading(false);
      return;
    }

    // Check if loginData has token and user._id
    if (!loginData || !loginData.token || !loginData.user || !loginData.user._id) {
      console.warn("Missing token or user._id. Redirecting to login...");
      setAuthStatus("Authentication required. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      setIsLoading(false);
      return;
    }

    const fetchQueries = async () => {
      try {
        const userId = loginData.user._id;
        const token = loginData.token;
        console.log("Fetching queries for userId:", userId, "with token:", token);

        if (typeof GetAllQueries !== "function") {
          throw new Error("GetAllQueries function is not available.");
        }

        // Pass token in headers
        const data = await GetAllQueries({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          // Filter queries for the logged-in user
          const userQueries = data.filter((query) => query.raisedBy === userId);
          setRequests(userQueries);
          if (userQueries.length === 0) {
            console.log("No queries found for user:", userId);
          }
          setAuthStatus(null);
        } else {
          console.warn("API response is not an array");
          setRequests([]);
          setAuthStatus("No queries found.");
        }
      } catch (err) {
        console.error("Error fetching queries:", err);
        // Use response status or a fallback message if err.message is undefined
        const errorMessage = err.response?.status
          ? `HTTP ${err.response.status}`
          : err.message || "Unknown error occurred";

        // Only redirect for authentication errors
        if (errorMessage.includes("403") || errorMessage.includes("401")) {
          console.warn("Authentication error. Redirecting to login...");
          setAuthStatus("Session expired. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          setAuthStatus("Failed to load queries. Please try again later.");
          setRequests([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueries();

    return () => {
      console.log("Query component unmounted");
    };
  }, []);

  // Handle modal open/close
  const openModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setFormData({ requestedDate: "", requestMessage: "" });
    setFormError(null);
    setFormSuccess(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Basic validation
    if (!formData.requestedDate || !formData.requestMessage) {
      setFormError("Please fill in both the date and reason fields.");
      setFormError("Please fill in both the date and reason fields.");
      return;
    }

    // Validate future date
    const today = new Date().toISOString().split("T")[0];
    if (formData.requestedDate < today) {
      setFormError("Please select a future date.");
      return;
    }

    // Prepare data for API
    let loginData;
    try {
      loginData = JSON.parse(localStorage.getItem("loginData"));
    } catch (error) {
      console.error("Error parsing loginData in handleSubmit:", error.message);
      setFormError("Invalid session data. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const userId = loginData?.user?._id;
    const token = loginData?.token;
    if (!userId || !token) {
      setFormError("User ID or token not found. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const queryData = {
      course: "Default Course",
      title: "Meeting Request",
      issue: formData.requestMessage,
      requestedDate: formData.requestedDate,
      requestMessage: formData.requestMessage,
      raisedBy: userId, // Use user._id from loginData
    };

    console.log("Sending queryData to CreateQuery:", queryData);

    try {
      setIsSubmitting(true);
      if (typeof CreateQuery !== "function") {
        throw new Error("CreateQuery function is not available. Please check the API module.");
      }

      // Pass token in headers
      const response = await CreateQuery(queryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Create Query Response:", response);
      setFormSuccess("Request submitted successfully!");

      // Refresh the table data
      const updatedData = await GetAllQueries({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(updatedData)) {
        const userQueries = updatedData.filter(
          (query) => query.raisedBy === userId
        );
        setRequests(userQueries);
      } else {
        setRequests([]);
      }

      setTimeout(closeModal, 3000);
    } catch (err) {
      console.error("Error creating query:", err);
      const errorMessage = err.response?.status
        ? `HTTP ${err.response.status}`
        : err.message || "Unknown error occurred";
      if (errorMessage.includes("403") || errorMessage.includes("401")) {
        setFormError("You are not authorized to create a query. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (errorMessage.includes("500")) {
        setFormError("Server error occurred while creating the query. Please try again later or contact support.");
      } else {
        setFormError(`Failed to submit request: ${errorMessage}. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      {/* Title and Button Row */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Requests</h1>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Request a Slot
        </button>
      </div>

      {/* Auth Status Message */}
      {authStatus && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          {authStatus}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
            <h2 className="text-xl font-semibold mb-4">Request a Slot</h2>
            <form onSubmit={handleSubmit}>
              {/* Select Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date:
                </label>
                <input
                  type="date"
                  name="requestedDate"
                  value={formData.requestedDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Enter Reason */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Reason:
                </label>
                <textarea
                  name="requestMessage"
                  value={formData.requestMessage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter your reason here..."
                  required
                />
              </div>

              {/* Form Messages */}
              {formError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-lg">
                  {formSuccess}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Request ID
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Raised By
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Requested Date
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Requested Message
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Scheduled Date
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Scheduled Time
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Meeting Link
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Admin Message
              </th>
              <th className="px-4 py-2 bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-4 text-center text-gray-500 text-sm"
                >
                  You have no requests at the moment.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request._id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.raisedBy || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.status}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.requestedDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.requestMessage}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.scheduledDate || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.time || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.meetingLink === "No Link" ? (
                      "No Link"
                    ) : (
                      <a
                        href={request.meetingLink}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.adminMessage || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {request.purpose || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Query;