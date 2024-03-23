export const limitSize = size => {
  if (size > 2 * 1024 * 1024) {
    return alert('您上传的文件超过最大限制，请重新上传');
  }

  return true;
};
