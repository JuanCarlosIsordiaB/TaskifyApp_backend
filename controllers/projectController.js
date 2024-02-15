import Project from "../models/Project.js";
import Task from "../models/Task.js";

const getProjects = async (req, res) => {
  const projects = await Project.find()
    .where("creator")
    .equals(req.user)
    .select("-tasks");

  res.json(projects);
};

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectStored = await project.save();
    res.json(projectStored);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  if (id.length === 24) {
    const project = await Project.findById(id).populate("tasks");
    if (!project) {
      const error = new Error("Not Found");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Error! Invalid Action");
      return res.status(404).json({ msg: error.message });
    }

    res.json(project);
  } else {
    return res.status(404).json({ msg: "Not Found" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const { name, client, description, deliverDate } = req.body;

  if (id.length === 24) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error("Not Found");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Error! Invalid Action");
      return res.status(404).json({ msg: error.message });
    }
    project.name = name || project.name;
    project.client = client || project.client;
    project.description = description || project.description;
    project.deliverDate = deliverDate || project.deliverDate;

    try {
      const projectStored = await project.save();
      res.json(projectStored);
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(404).json({ msg: "Not Found" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (id.length === 24) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error("Not Found");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Error! Invalid Action");
      return res.status(404).json({ msg: error.message });
    }

    try {
      await project.deleteOne();
      res.json({ msg: "Project Deleted" });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(404).json({ msg: "Not Found" });
  }
};

const addCollaborator = async (req, res) => {};

const deleteCollaborator = async (req, res) => {};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
};
