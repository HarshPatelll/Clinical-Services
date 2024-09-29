import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import crossIcon from "../../../assets/icon-cross.svg";
import * as boardSlice from "../../../redux/slices/api/boardSlice";
import { projectApiSlice } from "../../../redux/slices/api/projectApiSlice";
import {
  taskApiSlice,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../../redux/slices/api/taskApiSlice";
import UserList from "../../task/UserList"; // Import the TeamUserList component
import TeamUserList from "../../TeamUserList";

function AddEditTaskModal({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
  project,
}) {
  const dispatch = useDispatch();
  const { id: projectId } = useParams(); // Extract projectId from the URL
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [subtasks, setSubtasks] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]); // State for assigned users

  const board = project || {};
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const columns = board?.columns || [];
  const col = columns.find((col, index) => index === prevColIndex);
  const task = col ? col.tasks.find((task, index) => index === taskIndex) : null;

  useEffect(() => {
    if (type === "edit" && isFirstLoad && task) {
      setSubtasks(
        task.subtasks.map((subtask) => ({
          ...subtask,
          id: uuidv4(),
        }))
      );
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStartDate(task.startDate || ""); // Default to empty string if undefined
      setEndDate(task.endDate || ""); // Default to empty string if undefined
      setStatus(columns[prevColIndex]?.name || "");
      setAssignedUsers(task.assignedUsers || []); // Set assigned users in edit mode
      setIsFirstLoad(false);
    }
  }, [type, isFirstLoad, task, columns, prevColIndex]);

  const onChangeSubtasks = (id, newValue) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      if (subtask) subtask.title = newValue;
      return newState;
    });
  };
  const onChangeDate = (field) => (e) => {
  // field can be either 'startDate' or 'endDate'
  if (field === 'startDate') {
    setStartDate(e.target.value);
  } else if (field === 'endDate') {
    setEndDate(e.target.value);
  }
};
  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const validate = () => {
    setIsValid(false);
    
    // Validate title
    if (!title.trim()) {
      return false;
    }
    
    // Validate subtasks only if they exist
    if (subtasks.length > 0) {
      for (let i = 0; i < subtasks.length; i++) {
        if (!subtasks[i].title.trim()) {
          return false;
        }
      }
    }
    
    setIsValid(true);
    return true;
  };
  

  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = async (type) => {
    const selectedColumn = columns[newColIndex];
    const columnBoardId = selectedColumn?._id;

    try {
      if (type === "add") {
        await createTask({
          title,
          description,
          subtasks,
          status,
          columnBoardId,
          startDate,
          endDate,
          assignedUsers, // Include assigned users
        }).unwrap();
        
      }else if (subtasks.length > 0) {
        taskData.subtasks = subtasks;
      }
       else if (task) {
        const taskId = task._id;
        await updateTask({
          taskId,
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
          columnBoardId,
          startDate,
          endDate,
          assignedUsers, // Include assigned users
        }).unwrap();
      }
      setIsAddTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
    window.location.reload();
  };
  

  return (
    <div
      className={
        device === "mobile"
          ? " py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 dropdown "
          : " py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 dropdown "
      }
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      {/* Modal Section */}
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white text-black font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>

        {/* Task Name */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">Task Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-name-input"
            type="text"
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
            placeholder="e.g Take coffee break"
          />
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className="bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </div>

        {/* Start Date */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">Start Date</label>
          <input
            value={startDate}
            onChangeDate={(e) => setStartDate(e.target.value)}
            type="date"
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
          />
        </div>

        {/* End Date */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">End Date</label>
          <input
            value={endDate}
            onChangeDate={(e) => setEndDate(e.target.value)}
            type="date"
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
          />
        </div>

        {/* Status */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">Status</label>
          <select
            value={status}
            onChange={(e) => onChangeStatus(e)}
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
          >
            {columns.map((col, index) => (
              <option key={index} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subtasks */}
        <div className="mt-8 flex flex-col space-y-1">
          {/* <label className="text-sm text-gray-500">Subtasks</label> */}
          {subtasks.map((subtask, index) => (
            <div key={index} className="mt-4 flex flex-col space-y-1">
              <input
                value={subtask.title}
                onChange={(e) => onChangeSubtasks(subtask.id, e.target.value)}
                type="text"
                className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
                placeholder="e.g Make coffee"
              />
              {/* <button onClick={() => onDelete(subtask.id)}> */}
                {/* <img src={crossIcon} alt="delete" /> */}
              {/* </button> */}
            </div>
          ))}
          {/* <button
            onClick={() => setSubtasks([...subtasks, { title: "", isCompleted: false, id: uuidv4() }])}
            className="mt-4 px-4 py-2 bg-transparent outline-none rounded-md text-sm border-[0.5px] border-[#635fc7] text-[#635fc7] hover:bg-[#635fc7] hover:text-white"
          >
            + Add New Subtask
          </button> */}
        </div>

        {/* Assigned Users */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">Assigned Users</label>
          <TeamUserList
            projectId={projectId} // Pass projectId prop to TeamUserList
            selectedUsers={assignedUsers}
            onUserSelect={setAssignedUsers} // Handle user selection
          />
        </div>

        <button
          onClick={() => {
            if (validate()) {
              onSubmit(type);
            }
          }}
          className="mt-8 w-full px-4 py-2 bg-[#635fc7] text-white outline-none rounded-md text-sm hover:bg-[#4b3cd8]"
        >
          {type === "edit" ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
