import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "../task/UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../utils/firebase";
import {
  useCreateBugMutation,
  useUpdateBugMutation,
} from "../../redux/slices/api/bugApiSlice";
import { dateFormatter } from "../../utils";
import { useGetNotificationQuery } from "../../redux/slices/api/userApiSlice";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "LOW"];

const AddBug = ({ open, setOpen, bug, onAddBug, projectId }) => {
  const defaultValues = {
    title: bug?.title || "",
    date: dateFormatter(bug?.date || new Date()),
    team: bug?.team || [],
    stage: bug?.stage?.toUpperCase() || LISTS[0],
    priority: bug?.priority.toUpperCase() || PRIORITY[2],
    assets: bug?.assets || [],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const [team, setTeam] = useState(defaultValues.team);
  const [stage, setStage] = useState(defaultValues.stage);
  const [priority, setPriority] = useState(defaultValues.priority);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [createBug] = useCreateBugMutation();
  const [updateBug] = useUpdateBugMutation();
  const { refetch } = useGetNotificationQuery();
  const URLs = bug?.assets ? [...bug.assets] : [];

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      setTeam(bug?.team || []);
      setStage(defaultValues.stage);
      setPriority(defaultValues.priority);
      setAssets([]);
      refetch(); // Refetch data when the modal is closed
    }
  }, [open]);

  const submitHandler = async (data) => {
    try {
      setUploading(true);
      if (!data.title) {
        throw new Error("Title is required.");
      }

      // Upload all files concurrently
      const uploadedFiles = await Promise.all(
        Array.from(assets).map((file) => uploadFile(file))
      );

      const newData = {
        ...data,
        assets: [...URLs, ...uploadedFiles],
        team,
        stage,
        priority,
        projectId, // Use the projectId prop directly
      };

      const res = bug?._id
        ? await updateBug({ ...newData, _id: bug._id }).unwrap()
        : await createBug({ data: newData, projectId }).unwrap();
      refetch();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
        refetch(); // Refetch data after successful submission
        if (onAddBug) onAddBug(); // Notify parent component
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);
    const uploadBug = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadBug.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadBug.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          {bug ? "UPDATE BUG" : "ADD BUG"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Bug Title"
            type="text"
            name="title"
            label="Bug Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="flex gap-4">
            <SelectList
              label="Bug Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <div className="w-full">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Bug Date"
                className="w-full rounded"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              className="overflow-auto"
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />

            <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
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
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
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

export default AddBug;