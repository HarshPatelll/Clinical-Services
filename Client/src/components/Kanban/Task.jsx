import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "./Modals/TaskModal";

function Task({ colIndex, taskIndex, project }) {
  const boards = useSelector((state) => state.boards);
  const board = project;
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col?.tasks?.find((task, i) => i === taskIndex);

  // Debugging: Log the task object to verify startDate and endDate
  console.log('Task data:', task);

  // Ensure `task` is defined before proceeding
  if (!task) {
    return <p>Task not found</p>;
  }

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  let completed = 0;
  let subtasks = task.subtasks || []; // Ensure subtasks is an array
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  const formatDate = (date) => {
    if (!date) return "No date set";
    try {
      // Ensure date is parsed correctly
      const parsedDate = new Date(date);
      console.log('Parsed Date:', parsedDate); // Debugging line
      if (isNaN(parsedDate)) return "Invalid date";
      return parsedDate.toLocaleDateString(); // Format date as local date string
    } catch (error) {
      console.error('Date formatting error:', error);
      return "Invalid date";
    }
  };

  console.log('Task startDate:', task.startDate); // Debugging line
  console.log('Task endDate:', task.endDate); // Debugging line

  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className="w-[280px] first:my-5 rounded-lg bg-white shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] cursor-pointer"
      >
        <p className="font-bold tracking-wide">{task.title}</p>
        <p className="text-xs text-gray-500 mt-1">{`Start Date: ${formatDate(task.startDate)}`}</p>
        <p className="text-xs text-gray-500 mt-1">{`End Date: ${formatDate(task.endDate)}`}</p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
          project={project}
        />
      )}
    </div>
  );
}

export default Task;
