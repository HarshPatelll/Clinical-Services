import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "../task/UserList";
import Button from "../Button";
import { dateFormatter } from "../../utils";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../redux/slices/api/projectApiSlice";



const PRIORITY = ["HIGH", "MEDIUM", "LOW"];

const AddProject = ({ open, setOpen, project }) => {
  const defaultValues = {
    title: project?.title || "",
    date: dateFormatter(project?.date || new Date()),
    team: project?.team || [],
    priority: project?.priority ? project.priority.toUpperCase() : PRIORITY[2],
    assets: project?.assets || [],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const [team, setTeam] = useState(defaultValues.team);
 
  const [priority, setPriority] = useState(defaultValues.priority);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      setTeam(project?.team || []);
      setPriority(defaultValues.priority);
      setAssets([]);
    }
  }, [open]);
 

  const submitHandler = async (data) => {
    try {
      const newData = {
        ...data,
        assets: [...project?.assets || [], ...assets],
        team,
        priority,
      };
      window.location.reload();

      const res = project?._id
        ? await updateProject({ ...newData, _id: project._id }).unwrap()
        : await createProject(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          {project ? "UPDATE PROJECT" : "ADD PROJECT"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Project Title"
            type="text"
            name="title"
            label="Project Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          {/* Pass the existing team data to the UserList component */}
          <UserList setTeam={setTeam} team={team} />

          <div className="flex gap-4">
            <div className="w-full">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Project Date"
                className="w-full rounded"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {/* Priority selection logic here */}
          </div>

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4 mb-50">
            {uploading ? (
              <span className="text-sm py-2 text-red-500">
                Uploading assets
              </span>
            ) : (
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto "
              />
              
            )}

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddProject;
