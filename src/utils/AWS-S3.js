import { Storage } from "aws-amplify";

const s3Upload = async file => {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });

  // return key to storing obj from s3
  // which is file name; date-file_name
  return stored.key;
}

const s3Remove = async fileName => {
  await Storage.vault.remove(fileName)
}

export {
  s3Upload,
  s3Remove
}