const { Schema, model, Types, default: mongoose } = require("mongoose");
const slug = require("mongoose-slug-generator");
const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};
mongoose.plugin(slug, options);

const BrandSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    slug: "name",
    unique: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: "Merchant",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Brand", BrandSchema);
