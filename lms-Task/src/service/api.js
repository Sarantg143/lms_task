import axios from "axios";

const baseUrl = "https://law-lms.onrender.com";
const Token = JSON.parse(localStorage.getItem("loginData"));
// console.log(Token.token);

axios.defaults.headers.common["Authorization"] = `Bearer ${Token?.token}`;

// =================================  Authentication section ========================

// Register
export const AuthRegister = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Login
export const AuthLogin = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/login`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// logout
export const Logout = async () => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/logout`);
    localStorage.clear();
    return res.data.message;
  } catch (error) {
    console.log(error);
  }
};

// =================================  Authentication section ========================
//
//
//
//
// =================================  user section ========================

// Get all users
export const GetAllUsers = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/users`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch users";
  }
};

// Get user by ID
export const GetUserById = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const res = await axios.get(`${baseUrl}/api/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch user";
  }
};

// Update user by ID
export const UpdateUserById = async (userId, userData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/users/${userId}`, userData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update user";
  }
};

// Update user approval status
export const UpdateUserApproval = async (userId, isApproved) => {
  try {
    const res = await axios.put(`${baseUrl}/api/users/approve/${userId}`, { isApproved });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update approval status";
  }
};

// Delete user by ID
export const DeleteUserById = async (userId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete user";
  }
};

// =================================  user section ========================
//
//
//
//
// =================================  course section ========================

// Get all courses
export const GetAllCourses = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/courses`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch courses";
  }
};

// Get course by ID
export const GetCourseById = async (id) => {
  try {
    if (!id) throw new Error("Course ID is required");
    const res = await axios.get(`${baseUrl}/api/courses/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error.response?.data?.message || error.message || "Failed to fetch course";
  }
};

// Add new course
export const AddNewCourseApi = async (courseData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/courses`, courseData);
    return res.data;
  } catch (error) {
    console.error("Error adding new course:", error);
    throw error.response?.data?.message || error.message || "Failed to add course";
  }
};

// Update course by ID
export const UpdateCourseById = async (courseData, id) => {
  try {
    const res = await axios.put(`${baseUrl}/api/courses/${id}`, courseData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update course";
  }
};

// Delete course by ID
export const DeleteCourseById = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/courses/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting course with ID ${id}:`, error);
    throw error.response?.data?.message || error.message || "Failed to delete course";
  }
};

// Create Course Enrollment
export const CreateCourseEnrollment = async ({ courseId }) => {
  try {
    const res = await axios.post(`${baseUrl}/api/enrollments/${courseId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Get Course Enrollment
export const GetCourseEnrollment = async ({ userId }) => {
  try {
    const res = await axios.get(`${baseUrl}/api/enrollments/${userId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Update Course Enrollment
export const UpdateCourseEnrollment = async ({ userId, courseId }) => {
  try {
    const res = await axios.put(`${baseUrl}/api/enrollments/${userId}/${courseId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Course Progress post method
export const CourseProgressPost = async ({ userId, courseId, payload }) => {
  try {
    const res = await axios.post(`${baseUrl}/api/courseProgress/${userId}/${courseId}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Course Progress Get method
export const CourseProgressGet = async ({ userId, courseId }) => {
  try {
    const res = await axios.get(`${baseUrl}/api/courseProgress/${userId}/${courseId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Create or update course progress
export const UpdateCourseProgress = async (userId, courseId, progressData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/courseProgress/${userId}/${courseId}`, progressData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update course progress";
  }
};

// Get course progress for a specific user and course
export const GetCourseProgress = async (userId, courseId) => {
  try {
    const res = await axios.get(`${baseUrl}/api/courseProgress/${userId}/${courseId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch course progress";
  }
};

// Get all course progress for all users and courses
export const GetAllCourseProgress = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/courseProgress`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch all course progress";
  }
};

// Submit answers for a sublesson
export const SubmitAnswers = async ({ courseId, sublessonIndex, payload }) => {
  try {
    const res = await axios.post(`${baseUrl}/api/answers/${courseId}/${sublessonIndex}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error submitting answers for course ${courseId}:`, error);
    throw error.response?.data?.message || error.message || "Failed to submit answers";
  }
};

// Get all test results for the user
export const GetUserTestResults = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const res = await axios.get(`${baseUrl}/api/answers/${userId}`);
    return res.data.answers;
  } catch (error) {
    console.error(`Error fetching test results for user ${userId}:`, error);
    throw error.response?.data?.message || error.message || "Failed to fetch test results";
  }
};

// =================================  course section ========================
//
//
//
//
// =================================  Upload file section ========================

// without type
export const UploadFile = async (file) => {
  try {
    const res = await axios.post(`${baseUrl}/api/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);

    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

// with type
export const UploadFileWithType = async (file) => {
  try {
    const res = await axios.post(`https://z-backend-2xag.onrender.com/api/upload/type`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);

    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
    return error?.response?.data?.message || error.message || "Upload failed";
  }
};

// =================================  Upload file section ========================
//
//
//
//
// ================================= Announcement section ========================

// Create announcement
export const CreateAnnouncement = async (announcementData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/announcements`, announcementData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create announcement";
  }
};

// Get all announcements
export const GetAllAnnouncements = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/announcements/all`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch announcements";
  }
};

// Get announcement by ID
export const GetAnnouncementById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/announcements/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch announcement";
  }
};

// Update announcement
export const UpdateAnnouncement = async (id, updateData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/announcements/${id}`, updateData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update announcement";
  }
};

// ================================= Announcement section ========================
//
//
//
//
// ================================= Forum Section ========================

// Create a new forum post
export const CreateForumPost = async (postData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum/`, postData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create forum post";
  }
};

// Get all forum posts
export const GetAllForumPosts = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/forum/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch forum posts";
  }
};

// Get a single forum post by ID
export const GetForumPostById = async (postId) => {
  try {
    const res = await axios.get(`${baseUrl}/api/forum/${postId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch forum post";
  }
};

// Add a reply to a forum post
export const AddForumReply = async (postId, replyData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum/${postId}/reply`, replyData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add reply";
  }
};

// Update a forum post
export const UpdateForumPost = async (postId, postData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/forum/${postId}`, postData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update forum post";
  }
};

// Update a reply
export const UpdateForumReply = async (postId, replyId, replyData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/forum/${postId}/reply/${replyId}`, replyData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update reply";
  }
};

// Like a forum post
export const LikeForumPost = async (postId) => {
  try {
    const res = await axios.put(`${baseUrl}/api/forum/${postId}/like`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to like forum post";
  }
};

// Delete a forum post
export const DeleteForumPost = async (postId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/forum/${postId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete forum post";
  }
};

// Delete a reply
export const DeleteForumReply = async (postId, replyId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/forum/${postId}/reply/${replyId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete reply";
  }
};

// Toggle forum post approval
export const ToggleForumPostApproval = async (postId, approved) => {
  try {
    const res = await axios.put(`${baseUrl}/api/forum/${postId}/approve`, { approved });
    return res.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Failed to toggle approval status";
  }
};

// ================================= Forum Section ========================
//
//
//
//
// ================================= Calendar section ========================

// Create calendar event
export const CreateCalendarEvent = async (eventData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/calender`, eventData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create calendar event";
  }
};

// Get all calendar events
export const GetAllCalendarEvents = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/calender`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch calendar events";
  }
};

// Get calendar event by ID
export const GetCalendarEventById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/calender/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch calendar event";
  }
};

// Update calendar event by ID
export const UpdateCalendarEventById = async (id, eventData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/calender/${id}`, eventData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update calendar event";
  }
};

// Delete calendar event by ID
export const DeleteCalendarEventById = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/calender/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete calendar event";
  }
};

// ================================= Calendar section ========================
//
//
//
//
// ================================= Query Section ========================

// Get all queries
export const GetAllQueries = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/queries`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch queries";
  }
};

// Create a new query/ticket
export const CreateQuery = async (queryData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/queries`, queryData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create query";
  }
};

// Get a single query by ID
export const GetQueryById = async (queryId) => {
  try {
    const res = await axios.get(`${baseUrl}/api/queries/${queryId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch query";
  }
};

// Get queries from current student
export const GetQueriesByCurrentStudent = async (queryId) => {
  try {
    const res = await axios.get(`${baseUrl}/api/queries/${queryId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch student queries";
  }
};

// Update a query by ID (Accept ticket)
export const UpdateQuery = async (queryId, queryData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/queries/accept/${queryId}`, queryData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update query";
  }
};

// Delete a query by ID
export const DeleteQuery = async (queryId) => {
  try {
    const res = await axios.get(`${baseUrl}/api/queries/${queryId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete query";
  }
};

// ================================= Query Section ========================
//
//
//
//
// ================================= Notification Section ========================

// Create a new notification
export const CreateNotification = async (notificationData, token) => {
  try {
    const res = await axios.post(`${baseUrl}/api/notifications`, notificationData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create notification";
  }
};

// Get all notifications
export const GetAllNotifications = async (token) => {
  try {
    const res = await axios.get(`${baseUrl}/api/notifications`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch notifications";
  }
};

// Mark a notification as read
export const MarkNotificationAsRead = async (notificationId, token) => {
  try {
    const res = await axios.put(`${baseUrl}/api/notifications/${notificationId}`, {});
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to mark notification as read";
  }
};

// ================================= Notification Section ========================
//
//
//
//
// ================================= Task Achievement Section ========================

// Create a new task achievement
export const CreateTaskAchievement = async (achievementData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/taskAchievements`, achievementData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create task achievement";
  }
};

// Get all task achievements
export const GetAllTaskAchievements = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/taskAchievements`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch task achievements";
  }
};

// Get task achievements by user ID
export const GetTaskAchievementsByUserId = async (userId) => {
  try {
    const res = await axios.get(`${baseUrl}/api/taskAchievements/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch task achievements for user";
  }
};

// Update a task achievement by ID
export const UpdateTaskAchievement = async (achievementId, achievementData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/taskAchievements/${achievementId}`, achievementData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update task achievement";
  }
};

// Delete a task achievement by ID
export const DeleteTaskAchievement = async (achievementId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/taskAchievements/${achievementId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete task achievement";
  }
};

// ================================= Task Achievement Section ========================
//
//
//
//
// ================================= Course Achievements section ========================

export const GetCourseAchievementsByUserId = async (userId, token) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!token) throw new Error("Authorization token is required");

    const res = await axios.get(`${baseUrl}/api/courseAchievements/${userId}`, {});
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch course achievements";
  }
};

// ================================= Course Achievements section ========================


// ================================= Task Section ========================

// Create a new task
export const CreateTask = async (taskData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/tasks`, taskData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create task";
  }
};

// Get all tasks
export const GetAllTasks = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/tasks/all`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch tasks";
  }
};

// Upload file
export const UploadFileTask = async (file) => {
  try {
    const res = await axios.post(`${baseUrl}/api/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    return error.message;
  }
};

// Get tasks for a specific user by user ID
export const GetUserTasksById = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const res = await axios.get(`${baseUrl}/api/tasks?userId=${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch user tasks";
  }
}

// Submit a task
export const SubmitTask = async (taskId, submissionData, token) => {
  try {
    if (!taskId) throw new Error("Task ID is required");
    if (!token) throw new Error("Authentication token is required");
    const res = await axios.post(
      `${baseUrl}/api/tasks/submit/${taskId}`,
      submissionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to submit task";
  }
};


export const ReviewSubmission = async (taskId, userId, reviewData, token) => {
  try {
    if (!taskId) throw new Error("Task ID is required");
    if (!userId) throw new Error("User ID is required");
    if (!token) throw new Error("Authentication token is required");
    
    const res = await axios.put(
      `${baseUrl}/api/tasks/review/${taskId}/${userId}`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to review submission";
  }
};

export const GetTaskSubmissions = async (taskId) => {
  try {
    if (!taskId) throw new Error("Task ID is required");

    const token = JSON.parse(localStorage.getItem("loginData"))?.token;
    if (!token) throw new Error("Authentication token not found");

    const response = await axios.get(`${baseUrl}/api/tasks/${taskId}`);
    return response.data.submissions || [];
  } catch (error) {
    console.error('Error fetching task submissions:', error);
    if (error.response?.data?.error === "Invalid token") {
      localStorage.clear(); // Clear invalid token
      throw new Error("Session expired. Please log in again.");
    }
    throw error.response?.data?.message || error.message || 'Failed to fetch task submissions';
  }
};

export const UpdateTask = async (taskId, taskData) => {
  try {
    if (!taskId) throw new Error("Task ID is required");
    const res = await axios.put(`${baseUrl}/api/tasks/${taskId}`, taskData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update task";
  }
};

// ================================= Task Section ========================