import { apiSlice } from "../apiSlice";

const BUGS_URL = "/bug";
export const bugApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${BUGS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllBug: builder.query({
      query: ({ strQuery, isTrashed, search, projectId }) => {
        const queryParams = new URLSearchParams();
        if (strQuery) queryParams.append('stage', strQuery);
        if (isTrashed !== undefined) queryParams.append('isTrashed', isTrashed);
        if (search) queryParams.append('search', search);
        if (projectId) queryParams.append('projectId', projectId);

        return {
          url: `${BUGS_URL}?${queryParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    createBug: builder.mutation({
      query: ({ data, projectId }) => ({
        url: `${BUGS_URL}/create?projectId=${projectId}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    duplicateBug: builder.mutation({
      query: (id) => ({
        url: `${BUGS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    updateBug: builder.mutation({
      query: ( data ) => ({
        url: `${BUGS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    trashBug: builder.mutation({
      query: ({ id }) => ({
        url: `${BUGS_URL}/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    createSubBug: builder.mutation({
      query: ({ data, id }) => ({
        url: `${BUGS_URL}/create-subbug/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getSingleBug: builder.query({
      query: (id) => ({
        url: `${BUGS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    postBugActivity: builder.mutation({
      query: ({data, id}) => ({
        url: `${BUGS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    deleteRestoreBug: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${BUGS_URL}/delete-restore/${id}/?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllBugQuery,
  useCreateBugMutation,
  useDuplicateBugMutation,
  useUpdateBugMutation,
  useTrashBugMutation,
  useCreateSubBugMutation,
  useGetSingleBugQuery,
  usePostBugActivityMutation,
  useDeleteRestoreBugMutation,
} = bugApiSlice;