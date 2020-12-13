const express = require("express")
const q2m = require("query-to-mongo")
const ProfileModels = require("./schema")
const cloudinary = require('cloudinary')
const profilesRouter = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'public')
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
})
const upload = multer({ storage: storage }).single('file')
profilesRouter.get("/post", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const profiles = await ProfileModels.find(query.criteria)
  
    res.send({
      data: profiles,
      total: profiles.length,
    })
  } catch (error) {
    next(error)
  }
})


profilesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const profile = await ProfileModels.findProfileWithAuthors(id)
    res.send(profile)
  } catch (error) {
    next(error)
  }
})

profilesRouter.post("/post", async (req, res, next) => {
  try {
    const newProfile= new ProfileModels(req.body)
    const { text } = await newProfile.save()

    res.status(201).send(text)
   const newImage= new ProfileModels(req.file.buffer.toJSON)
   const Image= await newImage.save()
 return res.status(201).send(Image)

  } catch (error) {
    next(error)
  }
})

profilesRouter.post('/upload',function(req, res) {
     
  upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }
    return res.status(200).send(req.file)

  })

});

profilesRouter.put("/post", async (req, res, next) => {
  try {
    const profile= await ProfileModels.findOneAndUpdate(req.params.name, req.body)
    if (profile) {
      res.send("Ok")
    } else {
      const error = new Error(`profile with id ${req.params.name} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

profilesRouter.delete("/post", async (req, res, next) => {
  try {
    const profile = await ProfileModels.findOneAndDelete(req.params.name)
    if (profile) {
      res.send("Deleted")
    } else {
      const error = new Error(`profile with id ${req.params.name} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = profilesRouter
