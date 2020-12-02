const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const uniqid = require("uniqid")

const router = express.Router()

const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

router.get("/:id", (req, res) => {
  const imagesDB = readFile("images.json")
  const newImage = imagesDB.filter((image) => image.ID === req.params.id)
  res.send(newImage)
})

router.get("/", (req, res) => {
  const imagesDB = readFile("images.json")
  if (req.query && req.query.name) {
    const filteredImages = imagesDB.filter(
      (image) =>
       image.hasOwnProperty("name") &&
        image.name.toLowerCase() === req.query.name.toLowerCase()
    )
    res.send(filteredImages)
  } else {
    res.send(imagesDB)
  }
})

router.post(
  "/",

  (req, res) => {
    const imagesDB = readFile("images.json")
    const newImage = {
      ...req.body,
      ID: uniqid(),
      createdAt: new Date(),
    }

    imagesDB.push(newImage)

    fs.writeFileSync(
      path.join(__dirname, "images.json"),
      JSON.stringify(imagesDB)
    )

    res.status(201).send(imagesDB)
  }
)

router.delete("/:id", (req, res) => {
  const imagesDB = readFile("images.json")
  const newDb = imagesDB.filter((x) => x.ID !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "images.json"), JSON.stringify(newDb))

  res.send(newDb)
})

router.put("/:id", (req, res) => {
  const imagesDB = readFile("images.json")
  const newDb = imagesDB.filter((x) => x.ID !== req.params.id) //removing previous item
  const images = req.body
  images.ID = req.params.id
  newDb.push(images) //adding new item
  fs.writeFileSync(path.join(__dirname, "images.json"), JSON.stringify(newDb))

  res.send(newDb)
})

module.exports = router
