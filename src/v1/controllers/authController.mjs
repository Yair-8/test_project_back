import User from "../models/user/User.mjs";
import UsersDBService from "../models/user/UsersDBService.mjs";
import TypesDBService from "../models/type/TypesDBService.mjs";
import { prepareToken } from "../../../utils/jwtHelpers.mjs";

class AuthController {
  static async signup(req, res) {
    try {
      const types = await TypesDBService.getList();
      const typeId = await TypesDBService.findOne(
        { title: "guest" },
        { _id: 1 }
      );
      console.log("typeId============", typeId);
      console.log("types=============", types);

      const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        type: typeId._id,
      });
      user.setPassword(req.body.password);
      const savedUser = await user.save();
      console.log("savedUser=============", savedUser);

      // Populate the 'type' field after saving the user
      await savedUser.populate("type"); // Populate the type field (e.g., title)

      console.log("savedUser.type:", savedUser.type); // Log the populated 'type' field
      console.log(
        "savedUser.type.title:",
        savedUser.type ? savedUser.type.title : "No type found"
      );

      const token = prepareToken(
        {
          id: savedUser._id,
          username: savedUser.username,
          type: savedUser.type,
        },

        req.headers
      );
      res.status(201).json({
        result: "Signed up successfully",
        token,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({ error: "Signup error" });
    }
  }

  static async login(req, res) {
    if (!req.body.email) {
      return res.status(401).json({ error: "Email is required" });
    }
    if (!req.body.password) {
      return res.status(401).json({ error: "Password is required" });
    }

    try {
      const user = await UsersDBService.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (!user.validPassword(req.body.password)) {
        return res.status(401).json({ error: "Login error" });
      }
      const token = prepareToken(
        {
          id: user._id,
          username: user.username,
        },
        req.headers
      );
      res.json({
        result: "Authorized",
        token,
      });
    } catch (err) {
      res.status(401).json({ error: "Login error" });
    }
  }
}

export default AuthController;
