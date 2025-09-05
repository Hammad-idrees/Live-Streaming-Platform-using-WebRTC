function roleCheck(roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, data: null, error: "Forbidden" });
    }
    next();
  };
}

const isAdmin = roleCheck(["admin"]);
const isStreamer = roleCheck(["streamer"]);
const isUser = roleCheck(["user"]);

module.exports = roleCheck;
module.exports.isAdmin = isAdmin;
module.exports.isStreamer = isStreamer;
module.exports.isUser = isUser;
