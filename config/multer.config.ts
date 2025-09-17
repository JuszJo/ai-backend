import multer from "multer"

const storageEngine = multer.memoryStorage();

const multerStorage = {
  storage: storageEngine
}

const upload = multer(multerStorage)

export default upload;