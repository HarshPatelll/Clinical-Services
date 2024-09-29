import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import { useGetAllProjectQuery } from "../redux/slices/api/projectApiSlice";
import ProjectBoardView from "../components/ProjectBoardView";
import AddProject from "../components/Project/AddProject";
import ProjectTable from "../components/Project/ProjectTable";

const TABS = [{ title: "List View", icon: <FaList /> }];


const Project = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";

  const { data, isLoading, refetch } = useGetAllProjectQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  useEffect(() => {
    refetch();
  }, [data, open]);

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Project` : "Projects"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Add Project"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected !== 0 ? (
          <ProjectBoardView projects={data?.projects} />
        ) : (
          <div className="w-full">
            <ProjectTable projects={data?.projects} />
          </div>
        )}
      </Tabs>

      <AddProject open={open} setOpen={setOpen} />
    </div>
  );
};

export default Project;
