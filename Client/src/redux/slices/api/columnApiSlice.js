import { apiSlice } from "../apiSlice";

const COLUMN_BOARD_URL = "/column";
export const columnBoardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new ColumnBoard
    createColumnBoard: builder.mutation({
      query: ({ projectId, data }) => ({
        url: `${COLUMN_BOARD_URL}/${projectId}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Update an existing ColumnBoard
    updateColumnBoard: builder.mutation({
      query: ({ columnBoardId, data }) => ({
        url: `${COLUMN_BOARD_URL}/${columnBoardId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Delete a ColumnBoard and its associated tasks
    deleteColumnBoard: builder.mutation({
      query: ({ columnBoardId }) => ({
        url: `${COLUMN_BOARD_URL}/${columnBoardId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateColumnBoardMutation,
  useUpdateColumnBoardMutation,
  useDeleteColumnBoardMutation,
} = columnBoardApiSlice;
