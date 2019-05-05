const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const { Story } = require("../models/Story");
const { User } = require("../models/User")

// Stories Index
router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .sort({ date: "desc" })
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories
      });
    });
});

// Add Story Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

// Edit Story Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    res.render("stories/edit", {
      story: story
    });
  });
});

//post a new story
router.post("/", (req, res) => {
  let allowComments;
  console.log(req.body.allowComments);

  if (req.body.allowComments == "on") {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user
  };

  new Story(newStory).save().then(story => {
    console.log(story);
    res.redirect(`/stories/show/${story.id}`);
  });
});

//show single story
router.get("/show/:id", (req, res) => {
  Story.findById(req.params.id)
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      res.render("stories/show", { story });
    });
});

//list story from a user
router.get("/user/:userId", (req, res) => {
  Story.find({ user: req.params.userId, status: "public" })
    .populate("user")
    .then(stories => {
      res.render("stories/index", { stories });
    });
});

//logged in users stories
router.get("/my", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate("user")
    .then(stories => {
      res.render("stories/index", { stories });
    });
});

//edit a story
router.put("/edit/:id", (req, res) => {
  let allowComment;
  if (req.body.allowComment) {
    allowComment = true;
  } else {
    allowComment = false;
  }
  let body = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComment
  };
  Story.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).then(
    story => {
      res.redirect("/dashboard");
    }
  );
});

//delete a story
router.delete("/delete/:id", (req, res) => {
  Story.findByIdAndRemove(req.params.id).then(() => {
    res.redirect("/dashboard");
  });
});

//post a comment
router.post("/comment/:id", (req, res) => {



  Story.findById(req.params.id).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    story.comments.unshift(newComment);
    story.save().then(() => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
  let child = require("child_process").spawn

  let process = child('python', ["./Spam_and_Toxic/spam_and_toxic.py",
    req.body.commentBody
  ])


  process.stdout.on('data', (data) => {

    let status = JSON.parse(data.toString());

    warningArray = []

    for (let i in status) {
      if (status.hasOwnProperty(i)) {
        if (status[i] === 1) {
          warningArray.push(i)
        }
      }
    }
    if (warningArray.length > 0) {
      User.findById(req.user.id).then(doc => {
        doc.warnings = doc.warnings + 1;
        let warningDetails = {
          warningFor: warningArray,
          originalComment: req.body.commentBody

        }
        let newWarningArray = doc.warned_for;
        newWarningArray.push(warningDetails)
        doc.warned_for = newWarningArray

        doc.save().then(result => {
          console.log("User has been warned");
        }).catch(e => {
          console.log("error in warning the user");
          console.log(e)
        })
      }).catch(e => {
        console.log(e)
      })
    }
  })

});

module.exports = router;
