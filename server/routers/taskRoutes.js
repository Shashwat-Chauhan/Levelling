import express from "express";
import { Task } from "../models.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId || !title)
      return res.status(400).json({ message: "userId and title required" });

    const task = await Task.create({ userId, title });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:taskId", async (req, res) => {
 

  try {
    const { secondsWorked, title } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update title if provided
    if (typeof title === "string") {
      task.title = title.trim();
    }

    // Update time worked if provided
    if (typeof secondsWorked === "number") {
      task.totalTimeWorked += secondsWorked;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
