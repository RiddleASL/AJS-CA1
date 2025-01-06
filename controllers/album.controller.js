const Album = require('../models/album.model');
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');

const User_Albums = require('../models/users_albums.model');
const Artist_Album = require('../models/artists_albums.model');

const readData = (req, res) => {
    Album.find()
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

    Album.findById(id)
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({
                    message: `Album with id: ${id} not found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(400).json({
                    message: `Bad request, ${id} is not a valid id`
                });
            } else {
                res.status(500).json(err);
            }
        });
};

const createData = (req, res) => {
    let body = req.body;

    // Check if artistIds are valid
    Artist.find({ _id: { $in: body.artists } }).then((artists) => {
        if (artists.length !== body.artists.length) {
            return res.status(404).json({
                message: 'One or more artistIds are invalid'
            });
        } else {
            Album.create(body)
                .then((data) => {
                    console.log('New Album Created!', data);
                    body.artists.forEach((artist) => {
                        Artist_Album.create({ artistId: artist, albumId: data._id }).then(
                            (data) => {
                                console.log('Added to Artist_Album', data);
                            }
                        ).catch((err) => {
                            console.error(err);
                        });
                    });
                    res.status(201).json(data);
                })
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        console.error('Validation Error!!', err);
                        res.status(422).json({
                            msg: 'Validation Error',
                            error: err.message
                        });
                    } else {
                        console.error(err);
                        res.status(500).json(err);
                    }
                });
        }
    });
};

const updateData = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Check if artistIds are valid
    Artist.find({ _id: { $in: body.artists } }).then((artists) => {
        if (artists.length !== body.artists.length) {
            return res.status(404).json({
                message: 'One or more artistIds are invalid'
            });
        } else {
            Album.findByIdAndUpdate(id, body, {
                new: false
            })
                .then((data) => {
                    if (data) {
                        res.status(201).json(data);
                    } else {
                        res.status(404).json({
                            message: `Album with id: ${id} not found`
                        });
                    }
                })
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        console.error('Validation Error!!', err);
                        res.status(422).json({
                            msg: 'Validation Error',
                            error: err.message
                        });
                    } else if (err.name === 'CastError') {
                        res.status(400).json({
                            message: `Bad request, ${id} is not a valid id`
                        });
                    } else {
                        console.error(err);
                        res.status(500).json(err);
                    }
                });
        }
    });
};

const deleteData = (req, res) => {
    let id = req.params.id;

    Album.deleteOne({ _id: id })
        .then((data) => {
            if (data.deletedCount) {
                // Delete all songs in the album
                Song.deleteMany({ albumId : id })
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                // Cascade delete from User_Albums and Artist_Album
                User_Albums.deleteMany({ albumId: id }).then((data) => {
                    console.log("Deleted from User_Albums", data);
                });
                Artist_Album.deleteMany({ albumId: id }).then((data) => {
                    console.log("Deleted from Artist_Album", data);
                });                

                res.status(200).json({
                    message: `Album with id: ${id} deleted successfully`
                });
            } else {
                res.status(404).json({
                    message: `Album with id: ${id} not found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(400).json({
                    message: `Bad request, ${id} is not a valid id`
                });
            } else {
                res.status(500).json(err);
            }
        });
};

const addAlbum = (req, res) => {
	const authHeader = req.headers.authorization;
	const token = jwt.verify(authHeader.split(" ")[1], process.env.APP_KEY);
	const userId = token._id;
	const albumId = req.params.id;

	let canAdd = true;

	Album.findById(albumId).then((Album) => {
		if (!Album) {
			return res.status(404).json({
				message: `Album with id: ${albumId} not found`,
			});
		}

		//make sure the Album is not already in the user's list
		User_Albums.findOne({ userId, albumId }).then((data) => {
			if (data) {
				return res.status(409).json({
					message: "Album already in user list",
					canAdd,
					data,
				});
			} else {
				User_Albums.create({ userId, albumId })
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

const removeAlbum = (req, res) => {
	const authHeader = req.headers.authorization;
	const token = jwt.verify(authHeader.split(" ")[1], process.env.APP_KEY);
	const userId = token._id;
	const albumId = req.params.id;

	User_Albums.deleteOne({ userId, albumId })
		.then((data) => {
			if (data.deletedCount) {
				res.status(200).json({
					message: `Album with id: ${albumId} removed from user list`,
				});
			} else {
				res.status(404).json({
					message: `Album with id: ${albumId} not found in user list`,
				});
			}
		})
		.catch((err) => {
			console.error(err);
			if (err.name === "CastError") {
				res.status(400).json({
					message: `Bad request, ${albumId} is not a valid id`,
				});
			} else {
				res.status(500).json(err);
			}
		});
}

const getLikedAlbums = (req, res) => {
    const authHeader = req.headers.authorization;
    const token = jwt.verify(authHeader.split(" ")[1], process.env.APP_KEY);
    const userId = token._id;

    User_Albums.find({ userId })
        .then((data) => {
            if (data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).json({
                    message: "No liked albums found",
                });
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
    addAlbum,
    removeAlbum,
    getLikedAlbums
};
