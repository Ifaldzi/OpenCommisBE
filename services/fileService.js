const fs = require('fs').promises

const moveFile = async (file, path) => {
    const filepath = path + file.filename
    await fs.rename(file.path, 'public/' + filepath)

    return filepath
}

const moveFileWithPath = async (from, to) => {
    const fileName = from.split('\\').pop()
    const newPath = to + fileName
    console.log(fileName, newPath);

    await fs.rename(from, `public/${newPath}`)

    return newPath
}

const deleteFile = async (path) => {
    await fs.unlink('public/' + path)
}

module.exports = {moveFile, deleteFile, moveFileWithPath}