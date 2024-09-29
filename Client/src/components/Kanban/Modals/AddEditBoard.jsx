import React, { useState, useEffect } from "react";
import crossIcon from "../../../assets/icon-cross.svg";
import { v4 as uuidv4 } from "uuid";

import { useDispatch } from "react-redux";
import {
  useCreateColumnBoardMutation,
  useUpdateColumnBoardMutation,
} from "../../../redux/slices/api/columnApiSlice";

function AddEditBoardModal({ setIsBoardModalOpen, type, project }) {
  const dispatch = useDispatch();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "Doing", tasks: [], id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);

  const board = project ||{};
  const [createColumnBoard] = useCreateColumnBoardMutation();
  const [updateColumnBoard] = useUpdateColumnBoardMutation();

  useEffect(() => {
    if (type === "edit" && isFirstLoad) {
      setNewColumns(
        board?.columns?.map((col) => ({
          ...col,
          id: uuidv4(),
        })) || []
      );
      setName(board?.title || "");
      setIsFirstLoad(false);
    }
  }, [type, isFirstLoad, board]);

  const validate = () => {
    if (!name.trim()) return false;
    return newColumns.every((col) => col.name.trim());
  };

  const onChange = (id, newValue) => {
    setNewColumns((prevState) =>
      prevState.map((col) =>
        col.id === id ? { ...col, name: newValue } : col
      )
    );
  };

  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = async (type) => {
    setIsBoardModalOpen(false);

    const data = { name, newColumns }; // Create the data object to be sent
    const projectId = board._id;

    // if (type === "add") {
    createColumnBoard({ projectId: projectId, data: data });
    window.location.reload()
    // } else {
    //   updateColumnBoard({ projectId: projectId, data: data });
    // }
  };

  return (
    <div
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>

        {/* Task Name */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">Board Name</label>
          <input
            className="bg-transparent px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
            placeholder="e.g Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
          />
        </div>

        {/* Board Columns */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500">Board Columns</label>

          {newColumns.map((column) => (
            <div key={column.id} className="flex items-center w-full">
              <input
                className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
                onChange={(e) => onChange(column.id, e.target.value)}
                type="text"
                value={column.name}
              />
              <img
                src={crossIcon}
                onClick={() => onDelete(column.id)}
                className="m-4 cursor-pointer"
              />
            </div>
          ))}
          <div>
            <button
              className="w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full"
              onClick={() => {
                setNewColumns((state) => [
                  ...state,
                  { name: "", tasks: [], id: uuidv4() },
                ]);
              }}
            >
              + Add New Column
            </button>
            <button
              onClick={() => {
                if (validate()) onSubmit(type);
              }}
              className="w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
