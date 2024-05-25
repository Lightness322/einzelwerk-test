export function isExtensionValid(fileName: string, extensions: string[]) {
  const fileExtension = fileName.slice(fileName.lastIndexOf("."));

  for (const extension of extensions) {
    if (fileExtension.includes(extension)) return true;
  }

  return false;
}

export function createFileList(arr: File[]) {
  const fileList = new DataTransfer();

  arr.forEach((file) => {
    fileList.items.add(file);
  });

  return fileList;
}
