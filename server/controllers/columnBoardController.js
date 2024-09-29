import ColumnBoard from "../models/ColumnBoard.js";
import Project from "../models/project.js";
import boardTask from "../models/boardTask.js";

export const create = async (req, res) => {
  const { projectId } = req.params;
  const { newColumns } = req.body;

  try {
    // Fetch the project to check for existing columns
    const project = await Project.findById(projectId).populate("columns");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Extract column names from the incoming newColumns
    const newColumnNames = newColumns.map((col) => col.name);

    // Find existing columns that are not in the new columns
    const columnsToRemove = project.columns.filter(
      (existingCol) => !newColumnNames.includes(existingCol.name)
    );

    // Remove columns from ColumnBoard
    await Promise.all(
      columnsToRemove.map((col) => ColumnBoard.findByIdAndDelete(col._id))
    );

    // Remove columns from project's columns array
    project.columns = project.columns.filter(
      (existingCol) =>
        !columnsToRemove.some((colToRemove) =>
          colToRemove._id.equals(existingCol._id)
        )
    );

    // Filter out columns that already exist in the project
    const filteredNewColumns = newColumns.filter(
      (col) =>
        !project.columns.some((existingCol) => existingCol.name === col.name)
    );

    // Create new columns for those that don't exist
    const createdColumns = await Promise.all(
      filteredNewColumns.map((col) =>
        ColumnBoard.create({ name: col.name, project: projectId })
      )
    );

    // Append new column IDs to the project's columns array
    project.columns.push(...createdColumns.map((col) => col._id));
    await project.save();

    // Send the response with the created columns
    res.status(201).json(createdColumns);
  } catch (err) {
    console.error("Error in create function:", err); // Improved error logging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const update = async (req, res) => {
  const { columnBoardId } = req.params;
  try {
    const columnBoard = await ColumnBoard.findByIdAndUpdate(columnBoardId, {
      $set: req.body,
    });
    columnBoard._doc.boardTask = [];
    res.status(200).json(columnBoard);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteColumn = async (req, res) => {
  const { columnBoardId } = req.params;
  try {
    // Ensure Task is defined correctly
    await boardTask.deleteMany({ columnBoard: columnBoardId });
    const result = await ColumnBoard.deleteOne({ _id: columnBoardId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Column Board not found" });
    }
    res.status(200).json({ message: "Column Board deleted" });
  } catch (err) {
    console.error("Error in deleteColumn function:", err); // Improved error logging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
