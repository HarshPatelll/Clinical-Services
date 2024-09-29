import ColumnBoard from "../models/ColumnBoard.js";
import boardTask from "../models/boardTask.js";


export const create = async (req, res) => {
  const { columnBoardId, title, description, startDate, endDate } = req.body;
  console.log({ columnBoardId, title, description, startDate, endDate }); // Log individual fields

  try {
    const columnBoard = await ColumnBoard.findById(columnBoardId);
    const tasksCount = await boardTask.countDocuments({
      columnBoard: columnBoardId,
    });
    const task = await boardTask.create({
      title,
      description,
      startDate: new Date(startDate), // Ensure correct format
      endDate: new Date(endDate),     // Ensure correct format
      columnBoard: columnBoardId,
      position: tasksCount > 0 ? tasksCount : 0,
    });

    columnBoard.tasks.push(task._id);
    await columnBoard.save();

    task._doc.columnBoard = columnBoard;
    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const update_task = async (req, res) => {
  const { taskId } = req.params;
  const { columnBoardId, ...updateData } = req.body;

  try {
    const task = await boardTask.findById(taskId).populate('subtasks');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldColumnBoardId = task.columnBoard.toString();

    if (columnBoardId && columnBoardId !== oldColumnBoardId) {
      await ColumnBoard.findByIdAndUpdate(oldColumnBoardId, {
        $pull: { tasks: taskId },
      });

      await ColumnBoard.findByIdAndUpdate(columnBoardId, {
        $push: { tasks: taskId },
      });

      task.columnBoard = columnBoardId;
    }

    Object.assign(task, updateData);
    if (updateData.startDate) task.startDate = new Date(updateData.startDate); // Ensure correct format
    if (updateData.endDate) task.endDate = new Date(updateData.endDate);     // Ensure correct format
    await task.save();

    const updatedTask = await boardTask.findById(taskId).populate('subtasks');
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};


export const delete_task = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the task by ID to get its columnBoard reference
    const currentTask = await boardTask.findById(taskId);
    if (!currentTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete the task from the boardTask collection
    await boardTask.deleteOne({ _id: taskId });

    // Remove the task ID reference from the columnBoard's tasks array
    await ColumnBoard.findByIdAndUpdate(currentTask.columnBoard, {
      $pull: { tasks: taskId },
    });

    // Retrieve all tasks in the same columnBoard and update their positions
    const tasks = await boardTask
      .find({ columnBoard: currentTask.columnBoard })
      .sort("position");

    for (let i = 0; i < tasks.length; i++) {
      await boardTask.findByIdAndUpdate(tasks[i]._id, {
        $set: { position: i },
      });
    }

    res.status(200).json("Task deleted successfully");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task", details: err });
  }
};

export const changeTaskColumnBoard = async (req, res) => {
  const { taskId, newColId } = req.body;

  try {
    // Find the task by ID
    const task = await boardTask.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Get the current and new ColumnBoards
    const currentColumnBoard = await ColumnBoard.findById(task.columnBoard[0]);
    const newColumnBoard = await ColumnBoard.findById(newColId);

    if (!newColumnBoard) {
      return res.status(404).json({ error: "New ColumnBoard not found" });
    }

    // Remove the task ID from the current ColumnBoard's tasks array
    if (currentColumnBoard) {
      currentColumnBoard.tasks.pull(task._id);
      await currentColumnBoard.save();
    }

    // Add the task ID to the new ColumnBoard's tasks array
    newColumnBoard.tasks.push(task._id);
    await newColumnBoard.save();

    // Update the task's columnBoard reference
    task.columnBoard = newColId;
    await task.save();

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to change task columnBoard",
      details: err.message,
    });
  }
};

export const updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceColumnBoardId,
    destinationColumnBoardId,
  } = req.body;

  const resourceListReverse = resourceList.reverse();
  const destinationListReverse = destinationList.reverse();

  try {
    // Update the positions and columnBoard for tasks in the original column
    for (const [index, task] of resourceListReverse.entries()) {
      await boardTask.findByIdAndUpdate(task.id, {
        $set: {
          columnBoard: resourceColumnBoardId,
          position: index,
        },
      });
    }

    // Update the positions and columnBoard for tasks in the destination column
    for (const [index, task] of destinationListReverse.entries()) {
      await boardTask.findByIdAndUpdate(task.id, {
        $set: {
          columnBoard: destinationColumnBoardId,
          position: index,
        },
      });
    }

    res.status(200).json("Positions updated successfully");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to update task positions", details: err });
  }
};
