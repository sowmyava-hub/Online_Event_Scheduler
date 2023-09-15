var UserProfile = (function () {
  var full_name = "";
  var user_id = "";
  var time_zone = "";
  var enddate;
  var recurr_enddate;
  var user_data;
  var getName = function () {
    return full_name;
  };


  var getId = function () {
    return user_id;
  };

  var getTimezone = function () {
    return time_zone;
  };

  var getEnddate = function () {
    return enddate;
  };
  var getRecurr_enddate = function () {
    return enddate;
  };
  var getUserData = function () {
    return user_data;
  };

  var setId = function (id) {
    user_id = id;

  };

  var setName = function (name) {
    full_name = name;

  };

  var setTimezone = function (val) {
    time_zone = val;
  };

  var setEnddate = function (val) {
    enddate = new Date(val);
  }
  var setRecurr_enddate = function (val) {
    enddate = new Date(val);
  }
  var setUserData = function (val) {
    user_data = val;
  }

  return {
    getName: getName,
    getId: getId,
    setName: setName,
    setId: setId,
    getTimezone: getTimezone,
    setTimezone: setTimezone,
    getEnddate: getEnddate,
    setEnddate: setEnddate,
    getRecurr_enddate: getRecurr_enddate,
    setRecurr_enddate: setRecurr_enddate,
    getUserData: getUserData,
    setUserData: setUserData

  }

})();

export default UserProfile;