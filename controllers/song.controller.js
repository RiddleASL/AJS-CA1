const jwt = require("jsonwebtoken");

const Song = require("../models/song.model");
const Album = require("../models/album.model");
const Artist = require("../models/artist.model");

const User_Songs = require("../models/users_songs.model");
const Artist_Song = require("../models/artists_songs.model");

const readData = (req, res) => {
	Song.find()
		.then((data) => {
			console.log(data);
			if (data.length > 0) {
				res.status(200).json(data);
			} else {
				res.status(404).json([]);
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
};

const readOne = (req, res) => {
	let id = req.params.id;

	Song.findById(id)
		.then((data) => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(404).json({
					message: `Song with id: ${id} not found`,
				});
			}
		})
		.catch((err) => {
			console.error(err);
			if (err.name === "CastError") {
				res.status(400).json({
					message: `Bad request, ${id} is not a valid id`,
				});
			} else {
				res.status(500).json(err);
			}
		});
};

const createData = (req, res) => {
	//check if albumId is valid
	let body = req.body;

	Album.findById(body.albumId).then((album) => {
		if (!album) {
			return res.status(404).json({
				message: `Album with id: ${body.albumId} not found`,
			});
		} else {
			//check if artistIds are valid
			body.artists.forEach((artistId) => {
				Artist.findById(artistId).then((artist) => {
					if (!artist) {
						return res.status(404).json({
							message: `Artist with id: ${artistId} not found`,
						});
					} else {
						Song.create(body)
							.then((data) => {
								//add to Artist_Songs
								data.artists.forEach((artistId) => {
									Artist_Song.create({ artistId, songId: data._id }).then(
										(data) => {
											console.log("Added to Artist_Songs", data);
										}
									).catch((err) => {
										console.error(err);
									});
								});

								console.log("New Song Created!", data);
								res.status(201).json(data);
							})
							.catch((err) => {
								if (err.name === "ValidationError") {
									console.error("Validation Error!!", err);
									res.status(422).json({
										msg: "Validation Error",
										error: err.message,
									});
								} else {
									console.error(err);
									res.status(500).json(err);
								}
							}
						);
					}
				});
			});
		}
	});
};

const updateData = (req, res) => {
	let id = req.params.id;
	let body = req.body;

	//check if albumId is valid
	Album.findById(body.albumId).then((album) => {
		if (!album) {
			return res.status(404).json({
				message: `Album with id: ${body.albumId} not found`,
			});
		} else {
			//check if artistIds are valid
			body.artists.forEach((artistId) => {
				Artist.findById(artistId).then((artist) => {
					if (!artist) {
						return res.status(404).json({
							message: `Artist with id: ${artistId} not found`,
						});
					} else {
						Song.findByIdAndUpdate(id, body, {
							new: false,
						})
							.then((data) => {
								if (data) {
									//update Artist_Songs
									Artist_Song.deleteMany({ songId: id }).then((data) => {
										console.log("Deleted from Artist_Songs", data);
									});

									body.artists.forEach((artistId) => {
										Artist_Song.create({ artistId, songId: id }).then(
											(data) => {
												console.log("Added to Artist_Songs", data);
											}
										).catch((err) => {
											console.error(err);
										});
									});

									res.status(201).json(data);
								} else {
									res.status(404).json({
										message: `Song with id: ${id} not found`,
									});
								}
							})
							.catch((err) => {
								console.error(err);
								if (err.name === "CastError") {
									res.status(400).json({
										message: `Bad request, ${id} is not a valid id`,
									});
								} else {
									res.status(500).json(err);
								}
							}
						);
					}
				});
			});
		}
	});
};

const deleteData = (req, res) => {
	let id = req.params.id;

	Song.deleteOne({ _id: id })
		.then((data) => {
			if (data.deletedCount) {
				//Cascade delete from User_Songs and Artist_Songs
				User_Songs.deleteMany({ songId: id }).then((data) => {
					console.log("Deleted from User_Songs", data);
				});
				Artist_Song.deleteMany({ songId: id }).then((data) => {
					console.log("Deleted from Artist_Songs", data);
				});

				res.status(200).json({
					message: `Song with id: ${id} deleted successfully`,
				});
			} else {
				res.status(404).json({
					message: `Song with id: ${id} not found`,
				});
			}
		})
		.catch((err) => {
			console.error(err);
			if (err.name === "CastError") {
				res.status(400).json({
					message: `Bad request, ${id} is not a valid id`,
				});
			} else {
				res.status(500).json(err);
			}
		});
};

const addSong = (req, res) => {
	const authHeader = req.headers.authorization;
	const token = jwt.verify(authHeader.split(" ")[1], process.env.APP_KEY);
	const userId = token._id;
	const songId = req.params.id;

	Song.findById(songId).then((song) => {
		if (!song) {
			return res.status(404).json({
				message: `Song with id: ${songId} not found`,
			});
		}

		//make sure the song is not already in the user's list
		User_Songs.findOne({ userId, songId }).then((data) => {
			if (data) {
				return res.status(409).json({
					message: "Song already in user list"
				});
			} else {
				User_Songs.create({ userId, songId })
					.then((data) => {
						res.status(201).json(data);
					})
					.catch((err) => {
						if (err.name === "ValidationError") {
							console.error("Validation Error!!", err);
							res.status(422).json({
								msg: "Validation Error",
								error: err.message,
							});
						} else {
							console.error(err);
							res.status(500).json(err);
						}
					});
			}
		});
	});
};

const removeSong = (req, res) => {
	const authHeader = req.headers.authorization;
	const token = jwt.verify(authHeader.split(" ")[1], process.env.APP_KEY);
	const userId = token._id;
	const songId = req.params.id;

	User_Songs.deleteOne({ userId, songId })
		.then((data) => {
			if (data.deletedCount) {
				res.status(200).json({
					message: `Song with id: ${songId} removed from user list`,
				});
			} else {
				res.status(404).json({
					message: `Song with id: ${songId} not found in user list`,
				});
			}
		})
		.catch((err) => {
			console.error(err);
			if (err.name === "CastError") {
				res.status(400).json({
					message: `Bad request, ${songId} is not a valid id`,
				});
			} else {
				res.status(500).json(err);
			}
		});
}

const getLikedSongs = (req, res) => {
	const authHeader = req.headers.authorization;
	const token = jwt.verify(authHeader.split(" ")[1], process.env.APP_KEY);
	const userId = token._id;

	User_Songs.find({ userId })
		.then((data) => {
			if (data.length > 0) {
				res.status(200).json(data);
			} else {
				res.status(404).json({msg: "No liked songs found" });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json(err);
		});
}


module.exports = {
	readData,
	readOne,
	createData,
	updateData,
	deleteData,
	addSong,
	removeSong,
	getLikedSongs
};
