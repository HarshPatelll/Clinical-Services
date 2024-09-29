import { apiSlice } from "../apiSlice";

const BOARDS_URL = "/boards";

export const boardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBoards: builder.query({
      query: ({ search, isArchived }) => ({
        url: `${BOARDS_URL}?search=${search}&isArchived=${isArchived}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getBoardById: builder.query({
      query: (id) => ({
        url: `${BOARDS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    addBoard: builder.mutation({
      query: (data) => ({
        url: `${BOARDS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    editBoard: builder.mutation({
      query: (data) => ({
        url: `${BOARDS_URL}/update/${data.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    deleteBoard: builder.mutation({
      query: (id) => ({
        url: `${BOARDS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    addTaskToBoard: builder.mutation({
      query: ({ boardId, taskData }) => ({
        url: `${BOARDS_URL}/${boardId}/tasks`,
        method: "POST",
        body: taskData,
        credentials: "include",
      }),
    }),

    updateTaskInBoard: builder.mutation({
      query: ({ boardId, taskId, taskData }) => ({
        url: `${BOARDS_URL}/${boardId}/tasks/${taskId}`,
        method: "PUT",
        body: taskData,
        credentials: "include",
      }),
    }),

    deleteTaskFromBoard: builder.mutation({
      query: ({ boardId, taskId }) => ({
        url: `${BOARDS_URL}/${boardId}/tasks/${taskId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    dragTask: builder.mutation({
      query: ({ boardId, taskId, sourceColumnId, destinationColumnId, newIndex }) => ({
        url: `${BOARDS_URL}/${boardId}/tasks/${taskId}/drag`,
        method: "PUT",
        body: { sourceColumnId, destinationColumnId, newIndex },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllBoardsQuery,
  useGetBoardByIdQuery,
  useAddBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
  useAddTaskToBoardMutation,
  useUpdateTaskInBoardMutation,
  useDeleteTaskFromBoardMutation,
  useDragTaskMutation
} = boardSlice;
