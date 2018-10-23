const express = require("express");

const PostsController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const router = express.Router();

router.post("", checkAuth,multipartMiddleware,  PostsController.createPost);

router.put("/:id", checkAuth, multipartMiddleware, PostsController.updatePost);

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPost);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
