require("dotenv").config();
const Jwt = require("jsonwebtoken");
const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const {
  ROLES,
  EMAIL_EXIST,
  BAD_REQUEST,
  NOT_FOUND,
  VALIDATION_ERROR,
  ROLE_MERCHANT,
} = require("../../utils/constants");

const APIError = require("../../utils/APIError");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: { type: String },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: "Merchant",
    default: null,
  },
  provider: {
    type: String,
    required: true,
    default: "email",
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },

  avatar: {
    type: String,
    default: "./img.png",
  },
  role: {
    type: String,
    enum: ROLES,
    default: "member",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: String,
  },
  update: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, Number(10));
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.transform = function transfrom() {
  const transfromed = {};
  const fields = [
    "id",
    "email",
    "firstName",
    "lastName",
    "password",
    "marchant",
    "provider",
    "googleId",
    "facebookId",
    "avatar",
    "role",
    "resetPasswordToken",
    "resetPasswordExprires",
    "update",
    "created",
  ];
  fields.forEach((field) => {
    transfromed[field] = this.field;
  });
  return transfromed;
};
UserSchema.methods.token = function token() {
  const playload = {
    exp: moment().add(10, "minunes").unix(),
    iat: moment().unix(),
    sub: this._id,
  };
  return Jwt.sign(playload, process.env.JWT_SECRET);
};
UserSchema.methods.matchPassword = async (password) => {
  return bcrypt.compare(password, this.password);
};

UserSchema.static = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [
          {
            field: "id",
            location: "params",
            messages: "Please enter valid User ID",
          },
        ],
        status: NOT_FOUND,
      });
    }
    const user = await this.findById(id).exec();
    if (!user)
      throw new APIError({ message: NO_RECORD_FOUND, status: NOT_FOUND });
    return user;
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {Object} options - User Object
   * @param options.email - User Email
   * @param options.password - User password
   * @returns { Promise<User | APIError> }
   */
  async ValidateUserAndGenerateToken(options) {
    const { email, password } = options;
    const user = await this.findOne({ email }).exec();
    if (!user) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: UNAUTHORIZED,
      });
    }
    if (!(await user.matchPassword(password))) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: UNAUTHORIZED,
      });
    }
    return { user: user.transform(), accessToken: user.token() };
  },

  /**
   * Return Validation Error
   * If error is a mongoose duplication key error
   *
   * @param {Error} error
   * @returns { Error | APIError }
   */
};

module.exports = model("User", UserSchema);
