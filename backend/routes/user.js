const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require("../models/User");

// Get all the users
router.get('/', async (req, res) => {
  try {
    const user = await User.find();
    if (user.length > 0) {
      res.json(user);
    } else {
      res.json({ message: 'No user exist' });
    }
  } catch (error) {
    res.json({ message: err });
  }
});

// Get a specific user and that user's friends
router.get('/id/:id', async (req, res) => {
  try {
    const user = await User.find({ id: req.params.id });
    if (user.length > 0) {
      const friends = await User.find({ id: { "$in": user[0].friends } }); // user[0].friends
      res.json({ name: user[0].firstName, surname: user[0].surname, friends: friends.map((f) => { return { name: f.firstName, surname: f.surname } }) });
    }
  } catch (error) {
    res.json({ message: "User not found " + error });
  }
});


// Get specific user's friends, friends of friends and suggested friends
router.get('/:id', async (req, res) => {
  try {
    const user = await User.find({ id: req.params.id }); // Current user

    if (user.length > 0) {
      const friends = await User.find({ id: { "$in": user[0].friends } }); // Current user's friends

      const fofIds = []; // Empty array for current user's friends of friends
      for (var i in friends) {
        for (var j in friends[i].friends) {
          if (friends[i].friends[j] != req.params.id && !user[0].friends.includes(friends[i].friends[j])) //Not including unnecessary users
            fofIds.push(friends[i].friends[j]); // Friends of friends added into the array
        }
      }

      const secondUser = await User.find({ id: { '$in': fofIds } }); // Current users friends of friends

      const sfIds = []; // Empty array for current user's suggested friends
      for (var i in secondUser) {
        for (var j in secondUser[i].friends) {
          if (secondUser[i].friends[j] != req.params.id && !user[0].friends.includes(secondUser[i].friends[j]) && !fofIds.includes(secondUser[i].friends[j])) // Not including unnecessary users
            sfIds.push(secondUser[i].friends[j]); // Suggested friends added into the array
        }
      }
      const thirdUser = await User.find({ id: { '$in': sfIds } }); // Friends of current user's friend's friends

      res.json(
        {
          id: user[0].id, // Current User Info
        name: user[0].firstName, surname: user[0].surname,
        friendsOfUser: friends.map((f) => { return { name: f.firstName, surname: f.surname } }),
        friendOfFriends: secondUser.map((f) => { return { id: f.id, name: f.firstName, surname: f.surname } }),
        suggestedFriends: thirdUser.map((f) => { return { id: f.id, name: f.firstName, surname: f.surname } })
        }
      );
    } else {
      res.json({ message: "Current user not found" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Get the names and surnames of a user's friends
router.get('/friends/:id', async (req, res) => {
  try {
    const user = await User.find({ id: req.params.id });
    if (user.length > 0) {
      const friends = await User.find({ id: { "$in": user[0].friends } });
      res.json({ friends: friends.map((f) => { return { name: f.firstName, surname: f.surname } }) });
    } else {
      res.json({ message: "Current user not found" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Friends of Friends
//Get the names and surnames of friends of a user's friends
router.get('/fof/:id', async (req, res) => {
  try {
    const user = await User.find({ id: req.params.id });
    if (user.length > 0) {
      const friends = await User.find({ id: { "$in": user[0].friends } });
      const fofIds = [];
      for (var i in friends) {
        for (var j in friends[i].friends) {
          if (friends[i].friends[j] != req.params.id && !user[0].friends.includes(friends[i].friends[j]))
            fofIds.push(friends[i].friends[j]);
        }
      }
      const secondUser = await User.find({ id: { '$in': fofIds } });
      res.json({ friends: secondUser.map((f) => { return { id: f.id, name: f.firstName, surname: f.surname } }) });

    } else {
      res.json({ message: "Current user not found" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Suggested Friends
// Get the names and surnames of a user's suggested friends
router.get('/sf/:id', async (req, res) => {
  try {

    const currentUser = await User.find({ id: req.params.id });
    if (currentUser.length > 0) {
      const friends = await User.find({ id: { "$in": currentUser[0].friends } });
      const fofIds = [];
      for (var i in friends) {
        for (var j in friends[i].friends) {
          if (friends[i].friends[j] != req.params.id && !currentUser[0].friends.includes(friends[i].friends[j]))
            fofIds.push(friends[i].friends[j]);
        }
      }

      const seconduser = await User.find({ id: { '$in': fofIds } });
      const sfIds = [];
      for (var i in seconduser) {
        for (var j in seconduser[i].friends) {
          if (seconduser[i].friends[j] != req.params.id && !currentUser[0].friends.includes(seconduser[i].friends[j]) && !fofIds.includes(seconduser[i].friends[j]))
            sfIds.push(seconduser[i].friends[j]);
        }
      }

      const thirdUser = await User.find({ id: { '$in': sfIds } });
      res.json({ friends: thirdUser.map((f) => { return { id: f.id, name: f.firstName, surname: f.surname } }) });

    } else {
      res.json({ message: "Current user not found" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
