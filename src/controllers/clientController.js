const express = require("express");
const Client = require("../models/client");
const _ = require("lodash");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/store", async (req, res) => {
  const errors = [];
  const date_birth = _.get(req.body, "date_birth", "");

  if (_.get(req.body, "first_name", "").length == 0)
    errors.push("First_name is Required");

  if (_.get(req.body, "last_name", "").length == 0)
    errors.push("Last_name is Required");

  if (_.get(req.body, "age", "").length == 0) errors.push("age is Required");

  if (date_birth.length == 0) errors.push("date_birth Required");

  if (new Date(date_birth) == "Invalid Date")
    errors.push("date_birth format is YYYY-MM-DD");

  if (errors.length > 0)
    return res.status(400).send({ "Please, fix these errors": errors });

  try {
    req.body.date_birth = date_birth;
    const client = await Client.create(req.body);
    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ "Please, fix the erros bellow ": err });
  }
});

router.put("/update/:id", async (req, res) => {
  const conditions = { _id: req.params.id };

  const errors = [];

  if (_.get(req.body, "first_name", "").length == 0)
    errors.push("First Name is Required");
  if (_.get(req.body, "last_name", "").length == 0)
    errors.push("Last Name is Required");

  if (errors.length > 0)
    return res.status(400).send({ "Please, fix these errors": errors });

  try {
    let client = await Client.updateOne(conditions, req.body);
    client = await Client.findById(conditions);
    return res.send({ client });
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
  const hex = /[0-9A-Fa-f]{6}/g;
  try {
    const clientRegex = new RegExp(`.*${searched}.*`);

    if (hex.test(searched)) {
      const id = mongoose.Types.ObjectId(searched);
      client = await Client.find({
        _id: id,
      });

      return res.send({ client });
    }

    client = await Client.find({
      $or: [
        { first_name: { $regex: clientRegex, $options: "i" } },
        { last_name: { $regex: clientRegex, $options: "i" } },
      ],
    });

    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ "Please, fix the erros bellow ": err });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const param = { _id: req.params.id };
  const hex = /[0-9A-Fa-f]{6}/g;
  if (!hex.test(param._id)) {
    return res.end("Please send a valid ObjectId to remove this content");
  }
  const deleted_at = {deleted_at: new Date()}

  try {
    const id = mongoose.Types.ObjectId(param._id);
    let client = await Client.updateOne({_id: id}, deleted_at );
    client = await Client.findById(id);
    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ "Please, fix the erros bellow ": err });
  }
});
module.exports = (app) => app.use("/client", router);
