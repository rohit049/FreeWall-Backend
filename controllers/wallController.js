const Wall = require('./../models/wallModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopWalls = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,description';
  next();
};

exports.getAllWalls = async (req, res) => {
  try {
    // console.log(req.query);

    const features = new APIFeatures(Wall.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //EXECUTE QUERY
    const walls = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: walls.length,
      data: {
        walls,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: 'fail',
      message: err,
    });
  }
};

exports.getWall = async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        wall,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: 'fail',
      message: err,
    });
  }
};

exports.createWall = async (req, res) => {
  try {
    const newWall = await Wall.create(req.body);

    res.status(200).send({
      status: 'success',
      data: {
        newWall,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateWall = async (req, res) => {
  try {
    const wall = await Wall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        wall,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteWall = async (req, res) => {
  try {
    await Wall.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      message: err,
    });
  }
};

exports.getWallStats = async (req, res) => {
  try {
    const stats = await Wall.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$color' },
          numWalls: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
        },
      },
    ]);

    res.status(200).send({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      message: err,
    });
  }
};
