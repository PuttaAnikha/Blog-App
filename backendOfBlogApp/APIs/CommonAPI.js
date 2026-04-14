import exp from "express";
import { UserModel } from "../models/userModel.js";
import { hash, compare } from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
const { sign } = jwt;
export const commonApp = exp.Router();
config();


//Route for register
commonApp.post("/users", upload.single("profileImage"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const allowedRoles = ["USER", "AUTHOR"];
    
    // Diagnostic logging
    console.log("-----------------------------------------");
    console.log("📩 Registration request received");
    console.log("Body:", req.body);
    console.log("File:", req.file ? `Present (${req.file.mimetype})` : "Missing");

    const newUser = req.body;

    // Check if body is empty (might happen if content-type is wrong)
    if (!newUser || Object.keys(newUser).length === 0) {
      return res.status(400).json({
        message: "Registration failed",
        error: "No form data received. Ensure you are sending fields as multipart/form-data.",
      });
    }

    // Basic validation
    const requiredFields = ["firstName", "email", "password", "role"];
    const missingFields = requiredFields.filter(field => !newUser[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Registration failed",
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Normalize email
    newUser.email = newUser.email.trim().toLowerCase();

    // Check role
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Registration failed", error: "Invalid role selected" });
    }

    // Upload image to cloudinary if present
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      newUser.profileImageUrl = cloudinaryResult.secure_url;
    }

    // hash password
    newUser.password = await hash(newUser.password, 12);

    // create New user document
    const newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    console.log("✅ User created successfully:", newUser.email);
    console.log("-----------------------------------------");
    res.status(201).json({ message: "User created successfully", payload: newUserDoc });
  } catch (err) {
    console.error("❌ Registration error:", err);
    // Delete image from cloudinary if DB save failed
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id).catch(e => console.error("Cloudinary cleanup failed:", e));
    }

    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists", error: "An account with this email already exists" });
    }
    
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", error: errors.join(", ") });
    }

    res.status(500).json({ message: "Registration failed", error: err.message || "Server error during registration" });
  }
});


//Route for Login(USER, AUTHOR and ADMIN)
commonApp.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Login failed", 
        error: "Email and password are required" 
      });
    }

    email = email.trim().toLowerCase();

    // find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Login failed", error: "Invalid email or password" });
    }

    // if user is inactive
    if (user.isUserActive === false) {
      return res.status(403).json({ message: "Login failed", error: "Your account has been deactivated. Please contact admin." });
    }

    // compare password
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Login failed", error: "Invalid email or password" });
    }

    // create jwt
    const signedToken = sign(
      {
        id: user._id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl 
      }, 
      process.env.SECRET_KEY, 
      { expiresIn: "1d" }
    );

    // set cookie
    res.cookie("token", signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    let userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ message: "Login successful", token: signedToken, payload: userObj });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed", error: "Internal server error" });
  }
});

//Check auth status
commonApp.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  //req.user is available here from verifyToken middleware
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  let userObj = user.toObject();
  delete userObj.password;
  res.status(200).json({ message: "authenticated", payload: userObj });
});

//Route for Logout
commonApp.get("/logout",  (req, res) => {
  //delete token from cookie storage
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  //send res
  res.status(200).json({message:"Logout success"})
});



//change password
commonApp.put("/password",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
  //get the body from the req
  const {newPassword,currPassword}=req.body
   //check current and new pass are same
   if(newPassword===currPassword){
     return res.status(400).json({message:"new password cannot be same as current password"});
   }
   //get current pass of user/admin/author
   const user=await UserModel.findOne({_id:req.user.id})
   //check the current pass of rqst and user are not same
   const isMatched=await compare(currPassword,user.password)
   if(!isMatched){
    return res.status(400).json({message:"Current password is incorrect"});
   }
   //hash new password
   const hashedPass=await hash(newPassword,12);
   //replace current password of the user with the hashed new password
   user.password=hashedPass
   //save
   await user.save()
   //send response
   res.status(200).json({message:"password updated"})

})