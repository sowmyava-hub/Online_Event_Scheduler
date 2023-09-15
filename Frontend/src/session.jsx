var UserProfile = (function () {
  var full_name = "";
  var user_id = "";
  var getName = function () {
    return full_name;
  };

  var getId = function () {
    return user_id;
  };

  var setId = function (id) {
    user_id = id;

  };

  var setName = function (name) {
    full_name = name;

  };
  return {
    getName: getName,
    getId: getId,
    setName: setName,
    setId: setId

  }

})();

export default UserProfile;