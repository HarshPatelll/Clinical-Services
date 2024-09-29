import Notice from "../models/notification.js";
import Project from "../models/project.js";
import ColumnBoard from "../models/ColumnBoard.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const createProject = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, team,  date, priority, assets } = req.body;

    // Initial text message
    let text = "New project has been assigned to you";
    if (team.length > 1) {
      text += ` and ${team.length - 1} others.`;
    }

    text += ` The bug priority is set as ${priority} priority, so check and act accordingly. The bug date is ${new Date(
      date
    ).toDateString()}.
    Thank you!!!`;

    // Create the project
    const project = await Project.create({
      title,
      team,
      date,
      assets,
    });

    // Create the default "ToDo" column for the new project
    const columnBoard = await ColumnBoard.create({
      name: "ToDo",
      project: project._id,
    });

    // Link the column to the project
    project.columns.push(columnBoard._id);
    await project.save();

    // Create the notice
    await Notice.create({
      team,
      text,
      project: project._id,
    });

    res.status(200).json({
      status: true,
      project,
      message: "Project created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    const newProject = await Project.create({
      ...project,
      title: project.title + " - Duplicate",
    });

    newProject.team = project.team;
    newProject.subProjects = project.subProjects;
    newProject.assets = project.assets;
    newProject.priority = project.priority;
    newProject.stage = project.stage;

    await newProject.save();

    //alert users of the project
    let text = "New project has been assigned to you";
    if (project.team.length > 1) {
      text = text + ` and ${project.team.length - 1} others.`;
    }

    text =
      text +
      ` The project priority is set a ${
        project.priority
      } priority, so check and act accordingly. The project date is ${project.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: project.team,
      text,
      project: newProject._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Project duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postProjectActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const project = await Project.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    project.activities.push(data);

    await project.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allProjects = isAdmin
      ? await Project.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Project.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group project by stage and calculate counts
    const groupProjectks = allProjects.reduce((result, project) => {
      const stage = project.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }


      return result;
    }, {});

    // Group projects by priority
    const groupData = Object.entries(
      allProjects.reduce((result, project) => {
        const { priority } = project;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total projects
    const totalProjects = allProjects?.length;
    const last10Project = allProjects?.slice(0, 10);

    const summary = {
      totalProjects,
      last10Project,
      users: isAdmin ? users : [],
      projects: groupProjectks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;

    }

    let queryResult = Project.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          select: "title description status subtasks", // Adjust selection as needed
        },
      })
      .sort({ _id: -1 });

    const projects = await queryResult;

    res.status(200).json({
      status: true,
      projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};



export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid project ID." });
    }

    const project = await Project.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          select: "title description status subtasks",
        },
      })
      .sort({ _id: -1 });

    if (!project) {
      return res.status(404).json({ status: false, message: "Project not found." });
    }

    res.status(200).json({
      status: true,
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubProject = async (req, res) => {
  try {
    const { title, tag, date } = req.body;

    const { id } = req.params;

    const newSubProject = {
      title,
      date,
      tag,
    };

    const project = await Project.findById(id);

    project.subProjects.push(newSubProject);

    await project.save();

    res
      .status(200)
      .json({ status: true, message: "SubProject added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const project = await Project.findById(id);

    project.title = title;
    project.date = date;
    project.priority = priority?.toLowerCase();
    project.assets = assets;
    project.stage = stage?.toLowerCase();
    project.team = team;

    await project.save();

    res
      .status(200)
      .json({ status: true, message: "Project updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    project.isTrashed = true;

    await project.save();

    res.status(200).json({
      status: true,
      message: `Project trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Project.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Project.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Project.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Project.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
