import { apiSlice } from "../apiSlice";

const PROJECTS_URL = "/project";
export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${PROJECTS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllProject: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${PROJECTS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    duplicateProject: builder.mutation({
      query: (id) => ({
        url: `${PROJECTS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    updateProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    trashProject: builder.mutation({
      query: ({ id }) => ({
        url: `${PROJECTS_URL}/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    createSubProject: builder.mutation({
      query: ({ data, id }) => ({
        url: `${PROJECTS_URL}/create-subproject/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getSingleProject: builder.query({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    postProjectActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${PROJECTS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    deleteRestoreProject: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${PROJECTS_URL}/delete-restore/${id}/?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    getProjectAssignedUsers: builder.query({
      query: (id) => ({
          url : `${PROJECTS_URL}/${id}/assigned-users`,
          method: "GET",
          credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllProjectQuery,
  useCreateProjectMutation,
  useDuplicateProjectMutation,
  useUpdateProjectMutation,
  useTrashProjectMutation,
  useCreateSubProjectMutation,
  useGetSingleProjectQuery,
  usePostProjectActivityMutation,
  useDeleteRestoreProjectMutation,
  useGetProjectAssignedUsersQuery
} = projectApiSlice;
