const error = require('../../middlewares/errorHandling/errorConstants');
const { User } = require('../../models/user');
const { isValidId } = require('../../lib/misc');


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

exports.getUser = async (req, res) => {
  const user = await User.find({ id: req.params.id });
  const currentUser = req.params.id, friendsOfFriendsIds = [], suggestedFriendsIds = [];
  const usersFriend = await User.find({ id: { "$in": user[0].friends } });

  if (!user) throw new Error('There is no user');

  for (var i in usersFriend) {
    for (var j in usersFriend[i].friends) {
      const friendsOfUsersFriend = usersFriend[i].friends[j];
      if (
        // Fof can't be the current user
        friendsOfUsersFriend != currentUser &&
        // Fof can't be the current users friends
        !user[0].friends.includes(friendsOfUsersFriend)) {
        friendsOfFriendsIds.push(friendsOfUsersFriend);
      }
    }
  }

  const secondUser = await User.find({ id: { '$in': friendsOfFriendsIds } });
  for (var i in secondUser) {
    for (var j in secondUser[i].friends) {
      const friendsOfUsersFriend = secondUser[i].friends[j];
      if (
        !user[0].friends.includes(friendsOfUsersFriend) &&
        !friendsOfFriendsIds.includes(friendsOfUsersFriend)) {
        suggestedFriendsIds.push(friendsOfUsersFriend);
      }
    }
  }

  const thirdUser = await User.find({ id: { '$in': suggestedFriendsIds } });

  const results =
  {
    id: user[0].id,
    name: user[0].firstName + ' ' + user[0].surname,
    age: user[0].age,
    gender: user[0].gender,
    usersFriend: usersFriend
      .map((friend) => {
        return {
          id: friend.id,
          name: friend.firstName + ' ' + friend.surname,
          age: friend.age,
          gender: friend.gender,
        }
      })
      // Sorting by Id of friends
      .sort((x, y) => { return x.id - y.id; }),
    usersFriendsOfFriends: secondUser
      .map((friend) => {
        return {
          id: friend.id,
          name: friend.firstName + ' ' + friend.surname,
          age: friend.age,
          gender: friend.gender,
        }
      })
      // Sorting by Id of friends
      .sort((x, y) => { return x.id - y.id; }),
    suggestedFriends: thirdUser
      .map((friend) => {
        return {
          id: friend.id,
          name: friend.firstName + ' ' + friend.surname,
          age: friend.age,
          gender: friend.gender,
        }
      })
      // Sorting by Id of friends
      .sort((x, y) => { return x.id - y.id; }),
  };

  return res.status(200).send({
    status: 'Successfully fetched',
    results
  });
};

function showResults(user) {
  const results =
  {
    friends: user
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
  };
  return results;
}

exports.userFriends = async (req, res) => {
  const user = await User.find({ id: req.params.id });

  if (!user) throw new Error('There is no user');

  const friends = await User.find({ id: { "$in": user[0].friends } });

  return res.status(200).send({
    status: 'Successfully fetched',
    results: showResults(friends)
  });
};

exports.friendsOfFriends = async (req, res) => {
  const user = await User.find({ id: req.params.id });
  const friendsOfFriendsIds = [], currentUser = req.params.id;
  const usersFriend = await User.find({ id: { "$in": user[0].friends } });

  if (!user) throw new Error('There is no user');

  for (var i in usersFriend) {
    for (var j in usersFriend[i].friends) {
      const friendsOfUsersFriend = usersFriend[i].friends[j];
      if (
        // Fof can't be the current user
        friendsOfUsersFriend != currentUser &&
        // Fof can't be the current users friends
        !user[0].friends.includes(friendsOfUsersFriend)) {
        friendsOfFriendsIds.push(friendsOfUsersFriend);
      }
    }
  }


  const secondUser = await User.find({ id: { '$in': friendsOfFriendsIds } });

  return res.status(200).send({
    status: 'Successfully fetched',
    results: showResults(secondUser)
  });
};

exports.suggestedFriends = async (req, res) => {
  const user = await User.find({ id: req.params.id });
  const currentUser = req.params.id, friendsOfFriendsIds = [], suggestedFriendsIds = [];
  const usersFriend = await User.find({ id: { "$in": user[0].friends } });

  if (!user) throw new Error('There is no user');

  for (var i in usersFriend) {
    for (var j in usersFriend[i].friends) {
      const friendsOfUsersFriend = usersFriend[i].friends[j];
      if (
        // Fof can't be the current user
        friendsOfUsersFriend != currentUser &&
        // Fof can't be the current users friends
        !user[0].friends.includes(friendsOfUsersFriend)) {
        friendsOfFriendsIds.push(friendsOfUsersFriend);
      }
    }
  }

  const secondUser = await User.find({ id: { '$in': friendsOfFriendsIds } });
  for (var i in secondUser) {
    for (var j in secondUser[i].friends) {
      const friendsOfUsersFriend = secondUser[i].friends[j];
      if (
        !user[0].friends.includes(friendsOfUsersFriend) &&
        !friendsOfFriendsIds.includes(friendsOfUsersFriend)) {
        suggestedFriendsIds.push(friendsOfUsersFriend);
      }
    }
  }
  const thirdUser = await User.find({ id: { '$in': suggestedFriendsIds } });

  return res.status(200).send({
    status: 'Successfully fetched',
    results: showResults(thirdUser)
  });
};
