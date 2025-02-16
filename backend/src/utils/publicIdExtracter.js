export const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  // Extract the part after "/upload/" and remove file extension
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^/.]+)(?:\.[^.]+)?$/);
  
  return matches ? matches[1] : null;
};
