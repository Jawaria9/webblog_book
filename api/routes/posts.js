const express = require("express");
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const cors = require("cors");

router.use(cors());
router.use(express.json());

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }

});


//GET POST
router.get("/:id", async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);  
    
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }

});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
 
  try {
    const page = parseInt(req.query.page || "0");
    let posts;
    const total = await Post.countDocuments({});
    
    const pagesize = 3
    if (username) {
      posts = await Post.find({ username }).limit(pagesize).skip(pagesize * page);
    }  else {
     
      posts = await Post.find().limit(pagesize).skip(pagesize * page);
    }
    
    res.status(200).json({totalpage:Math.ceil(total / pagesize) ,posts});


  } catch (err) {
    res.status(500).json(err);
  }
});






module.exports = router;