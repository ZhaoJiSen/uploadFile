import SparkMD5 from 'spark-md5';

export const limitSize = size => {
  if (size > 2 * 1024 * 1024) {
    return alert('您上传的文件超过最大限制，请重新上传');
  }

  return true;
};

export const classControl = (el1, el2, flag) => {
  if (flag) {
    el1.classList.add('loading');
    el2.classList.add('disable');
  } else {
    el1.classList.remove('loading');
    el2.classList.remove('disable');
  }
};

export const transBase64 = file => {
  const fileReader = new FileReader();
  return new Promise(resolve => {
    fileReader.readAsDataURL(file);

    fileReader.onload = e => {
      resolve(e.target.result);
    };
  });
};

export const generateHash = file => {
  const fileReader = new FileReader();

  const spark = new SparkMD5();
  let hash, suffix, buffer;

  return new Promise(resolve => {
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = e => {
      buffer = e.target.result;
      spark.append(buffer);
      hash = spark.end();

      // 通过原始文件名生成后缀
      suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      resolve({
        buffer,
        hash,
        suffix,
        filename: `${hash}.${suffix}`
      });
    };
  });
};
