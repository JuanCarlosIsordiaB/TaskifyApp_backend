import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;

  const existsProject = await Project.findById(project);

  if (!existsProject) {
    const error = new Error("No project Found");
    return res.status(404).json({ msg: error.message });
  }
  if (existsProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You cant add Tasks ");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const taskStored = await Task.create(req.body);
    //Store ID in the project
    existsProject.tasks.push(taskStored._id);
    await existsProject.save();
    res.json(taskStored);
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {
  const { id } = req.params; //Params = /:id

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("No task found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("No Task Found ");
    return res.status(403).json({ msg: error.message });
  }

  res.json(task);
};

const updateTask = async (req, res) => {
  const { id } = req.params; //Params = /:id

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("No task found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("No Task Found ");
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deliverDate = req.body.deliverDate || task.deliverDate;

  try {
    const taskStored = await task.save();
    res.json(taskStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params; //Params = /:id

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("No task found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("No Task Found ");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);
    
    await Promise.allSettled([project.save(), task.deleteOne()]);
    res.json({ msg: "Task Deleted" });
  } catch (error) {
    console.log(error);
  }
};

const changeStateTask = async (req, res) => {
  const { id } = req.params; //Params = /:id

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("No task found");
    return res.status(404).json({ msg: error.message });
  }

  task.state = !task.state;
  await task.save();
  res.json(task);
};

export { addTask, getTask, updateTask, deleteTask, changeStateTask };
