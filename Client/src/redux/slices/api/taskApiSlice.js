import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";
const USERS_URL = "/user"

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query for fetching dashboard statistics related to tasks
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getUsersByProject: builder.query({
      query: (projectId) => ({
        url: `${USERS_URL}/project/${projectId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    // Query for fetching all tasks
    getAllTasks: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Mutation for creating a new task
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Mutation for updating the position of a task
    updateTaskPosition: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/update-position`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Mutation for deleting a task
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `${TASKS_URL}/${taskId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    // Mutation for updating a task
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data.taskId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    toggleSubtaskCompletion: builder.mutation({
      query: ({ taskId, subtaskId, isCompleted }) => ({
        url: `${TASKS_URL}/${taskId}/subtask/${subtaskId}/toggle`,
        method: "PATCH",
        body: { isCompleted },
        credentials: "include",
      }),
    }),
    
    changeTaskColumnBoard: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/changeColumnBoard`, // Adjust the endpoint URL as necessary
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    
  }),
});

// Export hooks for the queries and mutations
export const {
  useGetDashboardStatsQuery,
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskPositionMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useChangeTaskColumnBoardMutation,
  useGetUsersByProjectQuery,
  useToggleSubtaskCompletionMutation,
  
} = taskApiSlice;
