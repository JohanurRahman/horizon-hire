export function validateImageFile(fileType) {
  const pattern = /image\/*/;

  return fileType.match(pattern);

}
