const Post = require("../models/post");

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "mymessageimages",
  api_key: "819225954293853",
  api_secret: "xlpw7rouF0PKsjrOhNzmyD_JE6g"
});

exports.createPost = (req, res, next) => {
  cloudinary.uploader.upload(req.files.image.path, function(result) {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: result.url,
      creator: req.userData.userId
    });
    post
      .save()
      .then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Creating a post failed!"
        });
      });
  });
};
//
// exports.createPost = (req, res, next) => {
//   const url = req.protocol + "://" + req.get("host");
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content,
//     imagePath: url + "/images/" + req.file.filename,
//     creator: req.userData.userId
//   });
//   post
//     .save()
//     .then(createdPost => {
//       res.status(201).json({
//         message: "Post added successfully",
//         post: {
//           ...createdPost,
//           id: createdPost._id
//         }
//       });
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: "Creating a post failed!"
//       });
//     });
// };

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};

// exports.putF = (req, res, next) => {
//   gfsEasy.putFile(req.files.file.path,
//     req.files.file.name,
//     function (err, file) {
//       if (err) next(err);
//       res.json(file);
//     })
// };
//
//
//   exports.getF = (req, res, next) => {
//     gfsEasy.getImageById('5ab417d36900a33288af587e', function (err, base64) {
//       if (err) {}
//
//       //send the image to the client
//       // make use of 'image' in HTML( e.g. <img  src={{image}}> )
//       else { res.json({image: base64}); }
//     })
//   };
