const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ComicSchema = new Schema(
  {
    _id: {
      type: String,
      validate: {
        validator: async (value) => {
          const asinExists = await ComicsModel.findOne({ _id: value })
          if (asinExists) {
            throw new Error("ASIN already in database")
          }
        },
      },
    },
    imageUrl:String,
    title: String,
    description: String,
    year: Number,
    genre: Array,
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
  },
  { _id: false }
)

ComicSchema.static("findComicWithAuthors", async function (id) {
  const comic = await ComicsModel.findOne({ _id: id }).populate("authors")
  return comic
})

ComicSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
})

ComicSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"))
  } else {
    next()
  }
})

const ComicsModel = mongoose.model("Comic", ComicSchema)
module.exports = { ComicsModel, ComicSchema }
