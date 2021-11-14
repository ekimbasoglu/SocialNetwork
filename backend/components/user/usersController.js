const error = require('../../middlewares/errorHandling/errorConstants');
const { User } = require('../../models/user');
const { isValidId } = require('../../lib/misc');


// eslint-disable-next-line arrow-body-style
exports.getAllUser = async (req, res) => {

  // const user = await User.find();
  const user = await User.find();
  user.sort((x, y) => { return x.id - y.id; }); // Sorting users by id
  let results = [];

  for (let i = 0; i < user.length; i++) {
    let friends = await User.find({ id: { "$in": user[i].friends } });
    results
      .push(
        {
          id: user[i].id,
          name: user[i].firstName + ' ' + user[i].surname,
          age: user[i].age,
          gender: user[i].gender,
          friends: friends
            .map((friend) => {
              return {
                id: friend.id,
                name: friend.firstName + ' ' + friend.surname,
                age: friend.age,
                gender: friend.gender,
              }
            })
            // Sorting by Id of friends
            .sort((x, y) => { return x.id - y.id; })
        });
  }

  if (!user) throw new Error('There is no user');

  return res.status(200).send({
    status: 'Successfully fetched',
    results
  });

};

// eslint-disable-next-line arrow-body-style
exports.getUser = async (req, res) => {
  try {
    const user = await User.find({ id: req.params.id });

    if (!user) throw new Error('User not found!');

    const friends = await User.find({ id: { "$in": user[0].friends } }); // user[0].friends
    const results = { name: user[0].firstName, surname: user[0].surname, friends: friends.map((f) => { return { name: f.firstName, surname: f.surname } }) };

    return res.status(200).send({
      message: 'User successfully fetched',
      results
    });

  } catch (error) {
    res.json({ message: "User not found " + error });
  }
};

// eslint-disable-next-line arrow-body-style
exports.getUserFriends = async (req, res) => {
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
};

// eslint-disable-next-line arrow-body-style
exports.getUserFof = async (req, res) => {
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
};

// eslint-disable-next-line arrow-body-style
exports.getUserSf = async (req, res) => {
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
};
