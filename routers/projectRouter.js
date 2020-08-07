const express = require('express')

const Projects = require('../data/helpers/projectModel')
const actionRouter = require('./actionRouter')

const router = express.Router()

router.get("/", (req, res) => {
    Projects.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
        console.log(error)
        res.status(500).json({ error: "Project information could not be retrieved." })
        })
})
router.post("/", validateProjectObj, (req, res) => {
    Projects.insert(req.body)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({errorMessage:"There was an error while saving this project."})
        })
})

router.get("/:id", validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})
router.put("/:id", validateProjectId, validateProjectObj, (req, res) => {
    const update = req.body
    const id = req.params.id
    Projects.update(id, update)
      .then(success => {
          res.status(200).json(success)
      })
      .catch(error => {
          console.log(error)
          res.status(500).json({errorMessage: "Error while saving changes. Please try again"})
      })
})
router.delete("/:id", validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
    .then(success => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({errorMessage: "Error while deleting project. Please try again."})
    }) 
})

router.use("/:id/actions", validateProjectId, actionRouter)

//MiddleWare
function validateProjectId(req, res, next) {
    Projects.get(req.params.id)
      .then(project => {
        if(project !== null){
            req.id = req.params.id
            req.project = project
            next()
        }else {
            res.status(404).json({ message: "Project does not exist" })
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({ message: "Unable to retrieve that project. Please try again." })
      })
  } 
function validateProjectObj(req, res, next) {
if(!req.body){
    res.status(400).json({ message: "Please include a project" })
    } else{
    if(!req.body.name || !req.body.description){
        res.status(400).json({ message: "Please make sure to include a name and description for your project" })
    }else{
        next()
    }
    }
}


module.exports = router