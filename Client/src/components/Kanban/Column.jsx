import { shuffle } from "lodash";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useUpdateTaskPositionMutation } from "../../redux/slices/api/taskApiSlice";

import Task from "./Task";
import { useDragTaskMutation } from "../../redux/slices/api/boardSlice";

function Column({ colIndex, project }) {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];

  const dispatch = useDispatch();
  const [color, setColor] = useState(null);

  const col = project?.columns[colIndex]; // Directly access the column by index
  const [updateTaskPosition] = useUpdateTaskPositionMutation();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);


  const handleOnDrop = (e) => {
    e.preventDefault();

    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    if (colIndex !== prevColIndex) {

      // Create the payload to send to the backend
      const resourceColumnBoardId = project.columns[prevColIndex]._id;
      const destinationColumnBoardId = project.columns[colIndex]._id;

      const resourceList = project.columns[prevColIndex].tasks.filter(
        (_, i) => i !== taskIndex
      );
      const destinationList = [
        ...project.columns[colIndex].tasks,
        project.columns[prevColIndex].tasks[taskIndex],
      ];

      // Update the positions in the backend
      updateTaskPosition({
        resourceList,
        destinationList,
        resourceColumnBoardId,
        destinationColumnBoardId,
      });

    }
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  return (

    <div className="scrollbar-hide mx-5 pt-[50px] min-w-[280px]">

      <p className="font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <div className={`rounded-full w-4 h-4 ${color}`} />
        {col.name} ({col.tasks.length})
      </p>

      {col.tasks.map((task, index) => (
        <Task
          key={index}
          taskIndex={index}
          colIndex={colIndex}
          project={project}
        />
      ))}
    </div>
  );
}

export default Column;
