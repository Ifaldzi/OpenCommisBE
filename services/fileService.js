const fs = require('fs').promises

const moveFile = async (file, path) => {
    const filepath = path + file.filename
    await fs.rename(file.path, 'public/' + filepath)

    return filepath
}

const deleteFile = async (path) => {
    await fs.unlink('public/' + path)
}

module.exports = {moveFile, deleteFile}