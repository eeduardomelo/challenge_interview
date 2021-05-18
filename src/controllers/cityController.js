const express = require("express");
const City = require("../models/city");
const _ = require("lodash");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/store", async (req, res) => {
  const errors = [];

  if (_.get(req.body, "name", "").length == 0) errors.push("Name is Required");

  if (_.get(req.body, "state", "").length == 0)
    errors.push("State is Required");

  if (errors.length > 0)
    return res.status(400).send({ "Please, fix these errors": errors });

  const nameRegex = new RegExp(`.*${req.body.name}.*`);

  const cityExists = await City.find({
    $or: [{ name: { $regex: nameRegex, $options: "i" } }],
  });

  if (cityExists.length > 0)
    return res
      .status(400)
      .send("This City is already stored in the database! ");

  try {
    const city = await City.create(req.body);
    return res.send({ city });
  } catch (err) {
    return res.status(400).send({ "Please, fix the erros bellow ": err });
  }
});

router.get("/search", async (req, res) => {
  const errors = [];

  if (_.get(req.body, "search", "").length == 0)
    errors.push("Search is Required");

  if (errors.length > 0)
    return res.status(400).send({ "Please, fix these errors": errors });

  const searched = req.body.search;
  try {
    const hex = /[0-9A-Fa-f]{6}/g;

    if (hex.test(searched)) {
      const id = mongoose.Types.ObjectId(searched);
      client = await City.find({
        _id: id,
      });

      return res.send({ client });
    }

    const searchedRegex = new RegExp(`.*${searched}.*`);

    client = await City.find({
      $or: [
        { name: { $regex: searchedRegex, $options: "i" } },
        { state: { $regex: searchedRegex, $options: "i" } },
      ],
    });

    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ "Please, fix the erros bellow ": err });
  }
});

module.exports = (app) => app.use("/city", router);
