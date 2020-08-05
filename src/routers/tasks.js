const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth');

const router = express.Router()

router.route('/tasks')
  .post(auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
    try {
      await task.save()
      res.status(201).send(task)
    } catch (e) {
      res.status(400).send(e)
    }
  })

  // get /tasks?completed=[true|false]
  // limit and skip for pagination
  // GET /tasks?limit=X&skip=Y
  // GET /tasks?sortBy=createdAt_[asc|desc]
  .get(auth, async (req, res) => {
    try {
      const match = {};
      if (req.query.completed) {
        match.completed = req.query.completed == 'true'
      }
      const sort = {}
      if (req.query.sortBy) {
        let parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
      }
      await req.user.populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      }).execPopulate()
      res.status(200).send(req.user.tasks)
    } catch (e) {
      res.status(500).send(e)
    }
  })

router.route('/tasks/:id')
  .get(auth, async (req, res) => {
    const _id = req.params.id
    try {
      // const task = await Task.findById(_id)
      const task = await Task.findOne({_id, owner: req.user._id})
      if (!task) {
        return res.status(404).send()
      }
      res.status(200).send(task)
    } catch (error) {
      res.status(404).send(error)
    }
  })
  .patch(auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
      res.status(400).send({error: 'Invalid Updates'})
    }
    try {
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
      if (!task) {
        return res.status(404).send()
      }
      updates.forEach((update) => {task[update] = req.body[update]})
      await task.save()
      res.send(task)
    } catch (error) {
      res.status(400).send(error)
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
      if (!task) {
        return res.status(400).send()
      }
      res.send(task)
    } catch (error) {
      res.status(500).send(error)
    }
  })

module.exports = router
