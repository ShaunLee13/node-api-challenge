const express = require('express')
const Projects = require('../data/helpers/projectModel')
const Actions = require('../data/helpers/actionModel')

const router = express.Router()

router.get("/", (req, res) => {
    Projects.getProjectActions(req.id)
      .then(posts => {
        res.status(200).json(posts)
      })
      .catch(error => {
        res.status(500).json({ errorMessage : "Error retrieving posts"})
      })
})
router.post("/", validateActionObj, (req, res) => {
    Actions.insert(req.body)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({errorMessage:"There was an error while adding this action."})
    })
})


router.get("/:id", validateActionId, (req, res) => {
    res.status(200).json(req.action)
})
router.put("/:id", validateActionId, validateActionObj, (req, res) => {
    const update = req.body
    const id = req.params.id
    Actions.update(id, update)
      .then(success => {
          res.status(200).json(success)
      })
      .catch(error => {
          console.log(error)
          res.status(500).json({errorMessage: "Error while saving changes. Please try again"})
      })
})
router.delete("/:id", validateActionId, (req, res) => {
    Actions.remove(req.params.id)
    .then(success => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({errorMessage: "Error while deleting project. Please try again."})
    }) 
})


//MiddleWare
function validateActionId(req, res, next) {
    Actions.get(req.params.id)
        .then(action => {
        if(action !== null){
            if(action.project_id == req.id){
                req.action = action
                next()
            } else{
                res.status(400).json({errorMessage:"The requested action is not available on this project"})
            }
        }else {
            res.status(404).json({ message: "Invalid Action ID" })
        }
        })
        .catch(error => {
        console.log(error)
        res.status(500).json({ message: "Unable to retrieve that action. Please try again." })
        })
    }
function validateActionObj(req, res, next) {
    //req.id = projects id #
    const newAction = req.body
    if(!newAction){
        res.status(400).json({ message: "Please include an action to complete" })
        } else{
        if(!newAction.notes || !newAction.description){
            res.status(400).json({ message: "Please make sure to include notes and a description for your project" })
        }else{
            newAction.project_id = req.id
            next()
        }
        }
}
module.exports = router