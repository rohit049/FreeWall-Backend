const mongoose = require('mongoose');
const slugify = require('slugify');

const wallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A wallpaper must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        20,
        'A wallpaper name must have less or equal then 20 characters!',
      ],
      minLength: [
        5,
        'A wallpaper name must have more or equal then 5 characters!',
      ],
    },
    brand: {
      type: String,
      default: 'Unknown',
    },
    height: {
      type: Number,
      required: [true, 'A wallpaper must have a height'],
    },
    width: {
      type: Number,
      required: [true, 'A wallpaper must have a width'],
    },
    color: String,
    likes: Number,
    views: Number,
    downloads: Number,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    urls: {
      type: String,
      required: [true, 'A wallpaper must have a url'],
    },
    created_at: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretWall: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

wallSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

wallSchema.pre(/^find/, function (next) {
  this.find({ secretWall: { $ne: true } });
  this.start = Date.now();
  next();
});

wallSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

wallSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretWall: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Wall = new mongoose.model('Wall', wallSchema);

module.exports = Wall;
