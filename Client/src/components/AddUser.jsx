import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import {
  useGetTeamListQuery,
  useUpdateUserMutation,
} from "../redux/slices/api/userApiSlice";
import {
  setCredentials,
  updateUserInList,
  addUserToList,
} from "../redux/slices/authSlice";
import SelectList from "./SelectList";

const ROLE = ["EMPLOYEE", "INTERN", "ADMIN"];

const AddUser = ({ open, setOpen, userData, isUpdate, setIsUpdate }) => {
  const defaultValues = isUpdate ? userData : {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const dispatch = useDispatch();
  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { refetch } = useGetTeamListQuery();
  const [role, setRole] = useState(defaultValues?.role?.toUpperCase() || ROLE[0]);

  const handleOnSubmit = async (formData) => {
    try {
      let result;
      formData.role = role; // Assign the selected role to the form data

      if (isUpdate) {
        result = await updateUser(formData).unwrap();
        toast.success("Profile updated successfully");
        dispatch(updateUserInList(result.user));

        if (userData._id === user._id) {
          dispatch(setCredentials(result.user));
        }
      } else {
        result = await addNewUser({
          ...formData,
          password: formData.email, // Set password as email or use a different logic
        }).unwrap();
        toast.success("New User added successfully");
        dispatch(addUserToList(result.user));
      }

      refetch();

      setTimeout(() => {
        setOpen(false);
        setIsUpdate(false);
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {isUpdate ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />
            <SelectList
              label="Role"
              lists={ROLE}
              selected={role}
              setSelected={setRole}
            />
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-8 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                label="Submit"
              />
              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => {
                  setOpen(false);
                  setIsUpdate(false);
                }}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
