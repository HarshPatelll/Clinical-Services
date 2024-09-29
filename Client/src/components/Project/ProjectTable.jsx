import React, { useState } from "react";
import { toast } from "sonner";
import { BGS, formatDate } from "../../utils";
import clsx from "clsx";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import AddProject from "./AddProject";
import { useDuplicateProjectMutation, useTrashProjectMutation } from "../../redux/slices/api/projectApiSlice";
import { Link } from "react-router-dom";

const ProjectTable = ({ projects }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [trashProject] = useTrashProjectMutation();
  const [duplicateProject] = useDuplicateProjectMutation();

  const toggleDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editProjectHandler = (project) => {
    setSelected(project);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const result = await trashProject({ id: selected, isTrash: "trash" }).unwrap();
      toast.success(result?.message);
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const duplicateHandler = async (project) => {
    try {
      const res = await duplicateProject(project._id).unwrap();
      toast.success(res?.message);
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black text-left">
        <th className="py-2 px-4">Project Title</th>
        <th className="py-2 px-4 line-clamp-1">Created At</th>
        <th className="py-2 px-4">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ project }) => (
    <>
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
        <td className="py-2 px-4">
          <div className="flex items-center gap-2">
            <button
              className="w-full text-left"
              onClick={() => toggleDropdown(project._id)}
            >
              <p className="w-full line-clamp-2 text-base text-black">
                {project?.title}
              </p>
            </button>
          </div>
        </td>

        <td className="py-2 px-4">
          <span className="text-sm text-gray-600">
            {formatDate(new Date(project?.date))}
          </span>
        </td>

        <td className="py-2 px-4">
          <div className="flex">
            {project?.team?.map((m, index) => (
              <div
                key={m._id}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>

        <td className="py-2 px-4 flex gap-2 md:gap-4 justify-end">
          <Button
            className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
            label="Duplicate"
            type="button"
            onClick={() => duplicateHandler(project)}
          />
          <Button
            className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
            label="Edit"
            type="button"
            onClick={() => editProjectHandler(project)}
          />
          <Button
            className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
            label="Delete"
            type="button"
            onClick={() => deleteClicks(project._id)}
          />
        </td>
      </tr>

      {activeDropdown === project._id && (
        <tr>
          <td colSpan="5" className="px-4 py-2">
            <div className="transition-all duration-500 ease-in-out transform delay-200">
              <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg shadow-md">
                <Link to={`/project/${project._id}/bugs`} className="text-blue-600 hover:text-blue-500">
                  Bug Reports
                </Link>
                <Link to={`/project/${project._id}/tasks`} className="text-blue-600 hover:text-blue-500">
                  Tasks
                </Link>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <>
      <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {projects?.map((project, index) => (
                <TableRow key={index} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddProject
        open={openEdit}
        setOpen={setOpenEdit}
        project={selected}
        key={new Date().getTime()}
      />
    </>
  );
};

export default ProjectTable;
