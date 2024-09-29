import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import BugBoardView from "../components/BugBoardView";
import BugTable from "../components/bug/BugTable";
import AddBug from "../components/bug/AddBug";
import { MdGridView } from "react-icons/md";
import { FaList } from "react-icons/fa";
import {
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} from "../redux/slices/api/projectApiSlice";
import { useGetAllBugQuery } from "../redux/slices/api/bugApiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Bugs = () => {
  const { projectId } = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  // Fetch the project
  const {
    data: projectData,
    isLoading: projectLoading,
    error: projectError,
  } = useGetSingleProjectQuery(projectId);

  // Fetch bugs based on the projectId
  const {
    data: bugsData,
    isLoading: bugsLoading,
    error: bugsError,
    refetch: refetchBugs,
  } = useGetAllBugQuery({
    strQuery: "",
    isTrashed: "",
    search: "",
    projectId: projectId || "",
  });

  const [updateProject] = useUpdateProjectMutation();

  // Select the active project
  const activeProject = projectData?.project;

  useEffect(() => {
    // Set the project as active if it's not already
    if (activeProject && !activeProject.isActive) {
      updateProject({ _id: activeProject._id, isActive: true });
    }
  }, [activeProject, updateProject]);

  useEffect(() => {
    if (projectId) {
      refetchBugs(); // Refetch bugs when projectId changes
    }
  }, [projectId, refetchBugs]);

  if (projectLoading || bugsLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (projectError || bugsError) {
    return (
      <div className="py-10">
        <p className="text-red-500">
          Error loading data: {projectError?.message || bugsError?.message}
        </p>
      </div>
    );
  }

  // Check if bugsData exists and has bugs
  const bugs = bugsData?.bugs || [];

  const handleAddBug = () => {
    refetchBugs(); // Refetch bugs after adding a new bug
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title="Bug Tracker" />
        <Button
          onClick={() => setOpen(true)}
          label="Report bug"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
        />
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        <div className="w-full">
          {selected !== 1 ? (
            <BugBoardView key={bugs.length} bugs={bugs} refetch={refetchBugs} />
          ) : (
            <div className="w-full">
              {bugs.length > 0 ? (
                <BugTable bugs={bugs} />
              ) : (
                <p className="text-gray-500">
                  No bugs available for this project.
                </p>
              )}
            </div>
          )}
        </div>
      </Tabs>

      <AddBug
        open={open}
        setOpen={setOpen}
        onAddBug={handleAddBug}
        projectId={projectId}
      />
    </div>
  );
};

export default Bugs;