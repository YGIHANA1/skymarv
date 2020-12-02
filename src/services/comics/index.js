const express = require("express")

const { ComicsModel } = require("./schema")

const comicsRouter = express.Router()

comicsRouter.get("/", async (req, res, next) => {
  try {
    const comics = await ComicsModel.find(req.query).populate("authors")
    res.send(comics)
  } catch (error) {
    next(error)
  }
})

comicsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const comic = await ComicsModel.findBookWithAuthors(id)
    res.send(comic)
  } catch (error) {
    next(error)
  }
})

comicsRouter.post("/", async (req, res, next) => {
  try {
    const newcomic = new BooksModel(req.body)
    const { _id } = await newcomic.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

comicsRouter.put("/:id", async (req, res, next) => {
  try {
    const comic = await ComicsModel.findByIdAndUpdate(req.params.id, req.body)
    if (comic) {
      res.send("Ok")
    } else {
      const error = new Error(`book with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

comicsRouter.delete("/:id", async (req, res, next) => {
  try {
    const comic = await ComicsModel.findByIdAndDelete(req.params.id)
    if (comic) {
      res.send("Deleted")
    } else {
      const error = new Error(`book with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = comicsRouter
