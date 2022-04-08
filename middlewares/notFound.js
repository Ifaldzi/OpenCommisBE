const notFound = (req, res, next) => {
    return res.status(404).json("Route doesn't exist")
}

module.exports = notFound