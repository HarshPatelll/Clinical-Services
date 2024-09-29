import Notice from "../models/notification.js";
import Bug from "../models/bug.js";
import User from "../models/user.js";

export const createBug = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, team, stage, date, priority, assets, projectId } = req.body;

    let text = "New bug has been assigned to you";
    if (team?.length > 1) {
      text += ` and ${team?.length - 1} others.`;
    }

    text += ` The bug priority is set as ${priority} priority, so check and act accordingly. The bug date is ${new Date(date).toDateString()}.
    Thank you!!!`;

    const bug = await Bug.create({
      title,
      team,
      stage: stage?.toLowerCase(),
      date,
      priority: priority?.toLowerCase(),
      assets,
      projectId,
      activities: [{
        type: "assigned",
        activity: text,
        by: userId
      }]
    });

    await Notice.create({
      title,
      team,
      text,
      bug: bug._id,
      
    });

    res.status(200).json({ status: true, bug, message: "Bug created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const duplicateBug = async (req, res) => {
    try {
      const { id } = req.params;
  
      const bug = await Bug.findById(id);
  
      const newBug = await Bug.create({
        ...bug,
        title: bug.title + " - Duplicate",
      });
  
      newBug.team = bug.team;
      newBug.subBugs = bug.subBugs;
      newBug.assets = bug.assets;
      newBug.priority = bug.priority;
      newBug.stage = bug.stage;
  
      await newBug.save();
  
      //alert users of the bug
      let text = "New bug has been assigned to you";
      if (bug.team.length > 1) {
        text = text + ` and ${bug.team.length - 1} others.`;
      }
  
      text =
        text +
        ` The bug priority is set a ${
          bug.priority
        } priority, so check and act accordingly. The bug date is ${bug.date.toDateString()}. Thank you!!!`;
  
      await Notice.create({
        team: bug.team,
        text,
        bug: newBug._id,
      });
  
      res
        .status(200)
        .json({ status: true, message: "Bug duplicated successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const postBugActivity = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const { type, activity } = req.body;
  
      const bug = await Bug.findById(id);
  
      const data = {
        type,
        activity,
        by: userId,
      };
  
      bug.activities.push(data);
  
      await bug.save();
  
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
  
      const allBugs = isAdmin
        ? await Bug.find({
            isTrashed: false,
          })
            .populate({
              path: "team",
              select: "name role title email",
            })
            .sort({ _id: -1 })
        : await Bug.find({
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
  
      //   group bug by stage and calculate counts
      const groupBugks = allBugs.reduce((result, bug) => {
        const stage = bug.stage;
  
        if (!result[stage]) {
          result[stage] = 1;
        } else {
          result[stage] += 1;
        }
  
        return result;
      }, {});
  
      // Group bugs by priority
      const groupData = Object.entries(
        allBugs.reduce((result, bug) => {
          const { priority } = bug;
  
          result[priority] = (result[priority] || 0) + 1;
          return result;
        }, {})
      ).map(([name, total]) => ({ name, total }));
  
      // calculate total bugs
      const totalBugs = allBugs?.length;
      const last10Bug = allBugs?.slice(0, 10);
  
      const summary = {
        totalBugs,
        last10Bug,
        users: isAdmin ? users : [],
        bugs: groupBugks,
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
  
  export const getBugs = async (req, res) => {
    try {
      const { stage, isTrashed, projectId } = req.query;
  
      let query = { isTrashed: isTrashed ? true : false };
      if (stage) {
        query.stage = stage;
      }
      if (projectId && projectId !== 'undefined') { // Ensure projectId is not 'undefined'
        query.projectId = projectId; 
      }
  
      const bugs = await Bug.find(query)
        .populate({
          path: "team",
          select: "name title email",
        })
        .sort({ _id: -1 });
  
      res.status(200).json({
        status: true,
        bugs,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  
  export const getBug = async (req, res) => {
    try {
      const { id } = req.params;
  
      const bug = await Bug.findById(id)
        .populate({
          path: "team",
          select: "name title role email",
        })
        .populate({
          path: "activities.by",
          select: "name",
        });
  
      res.status(200).json({
        status: true,
        bug,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const createSubBug = async (req, res) => {
    try {
      const { title, tag, date } = req.body;
  
      const { id } = req.params;
  
      const newSubBug = {
        title,
        date,
        tag,
      };
  
      const bug = await Bug.findById(id);
  
      bug.subBugs.push(newSubBug);
  
      await bug.save();
  
      res
        .status(200)
        .json({ status: true, message: "SubBug added successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const updateBug = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date, team, stage, priority, assets } = req.body;
  
      const bug = await Bug.findById(id);
  
      bug.title = title;
      bug.date = date;
      bug.priority = priority?.toLowerCase();
      bug.assets = assets;
      bug.stage = stage?.toLowerCase();
      bug.team = team;
  
      await bug.save();
  
      res
        .status(200)
        .json({ status: true, message: "Bug Updated successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const trashBug = async (req, res) => {
    try {
      const { id } = req.params;
  
      const bug = await Bug.findById(id);
  
      bug.isTrashed = true;
  
      await bug.save();
  
      res.status(200).json({
        status: true,
        message: `Bug trashed successfully.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const deleteRestoreBug = async (req, res) => {
    try {
      const { id } = req.params;
      const { actionType } = req.query;
  
      if (actionType === "delete") {
        await Bug.findByIdAndDelete(id);
      } else if (actionType === "deleteAll") {
        await Bug.deleteMany({ isTrashed: true });
      } else if (actionType === "restore") {
        const resp = await Bug.findById(id);
  
        resp.isTrashed = false;
        resp.save();
      } else if (actionType === "restoreAll") {
        await Bug.updateMany(
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