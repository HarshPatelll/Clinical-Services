import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Home from "./Home";
import EmptyBoard from "./EmptyBoard";

import {
  useGetAllProjectQuery,
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} from "../../redux/slices/api/projectApiSlice";
import { useParams } from "react-router-dom";
import Loading from "../Loader";

function Main() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  // Fetch all projects
  const { data: projects = [], isLoading } = useGetSingleProjectQuery(id);

  const [updateProject] = useUpdateProjectMutation();

  // Select the active project
  const activeProject = projects.project;

  useEffect(() => {
    // Set the first project as active if none is active
    if (!activeProject && projects?.length > 0) {
      const firstProjectId = projects[0]._id;
      updateProject({ _id: firstProjectId, isActive: true });
    }
  }, [activeProject, projects, updateProject]);

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <div className="overflow-hidden overflow-x-scroll">
      <>

        {activeProject ? (
          <>
            <Header
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
              project={activeProject}
            />
            <Home
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
              project={activeProject}
            />
          </>
        ) : (
          <EmptyBoard type="add" />
        )}
      </>
    </div>
  );
}

export default Main;
