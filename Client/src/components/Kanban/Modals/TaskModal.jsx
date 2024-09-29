import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ElipsisMenu from "../ElipsisMenu";
import elipsis from "../../../assets/icon-vertical-ellipsis.svg";
import {
  useUpdateTaskInBoardMutation,
  useDeleteTaskFromBoardMutation,
} from "../../../redux/slices/api/boardSlice";
// import Subtask from "../SubTask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import {
  useChangeTaskColumnBoardMutation,
  useDeleteTaskMutation,
} from "../../../redux/slices/api/taskApiSlice";

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen, project }) {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const board = project;
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const subtasks = task.subtasks || []; // Ensure subtasks is an array


  const [updateTaskInBoard] = useUpdateTaskInBoardMutation();
  const [deleteTaskFromBoard] = useDeleteTaskFromBoardMutation();

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const [status, setStatus] = useState(col._id); // Set initial status to current column's ID
  const [newColId, setNewColId] = useState(col._id); // Use ID instead of index

  const onChange = (e) => {
    const selectedColId = e.target.value;
    const selectedCol = columns.find((column) => column._id === selectedColId);
    setStatus(selectedColId); // Update the selected status to the new column ID
    setNewColId(selectedColId); // Store the ID of the selected column
  };


  const [changeTaskColumnBoard] = useChangeTaskColumnBoardMutation();

  const onClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    const taskId = task?._id;
    changeTaskColumnBoard({
      taskId,
      newColId, // Send the column ID instead of the index
    });

    setIsTaskModalOpen(false);
  };

  const [deleteTask] = useDeleteTaskMutation();

  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      deleteTask(task?._id);

      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
    window.location.reload();
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown"
    >
      {/* MODAL SECTION */}
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white  text-black  font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
      <div className="relative flex justify-between w-full items-center">
          <h1 className="text-lg">{task.title}</h1>

          <img
            onClick={() => {
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="elipsis"
            className="cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
          {task.description}
        </p>
        

        {/* <p className="pt-6 text-gray-500 tracking-widest text-sm">
          Subtasks ({completed} of {subtasks.length})
        </p> */}

        {/* subtasks section */}
        {/* <div className="mt-3 space-y-2">
          {subtasks.map((subtask, index) => {
            return (
              <Subtask
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
              />
            );
          })}
        </div> */}

        {/* Current Status Section */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm  text-gray-500">
            Current Status
          </label>
          <select
            className="select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"

            value={status} // Make sure the select uses the current status (column ID)

            onChange={onChange}
          >
            {columns.map((col) => (
              <option value={col._id} key={col._id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          setIsDeleteModalOpen={setIsDeleteModalOpen} // Pass the prop correctly here
          type="task"
          title={task.title}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
          project={project}
        />
      )}
    </div>
  );
}

export default TaskModal;



