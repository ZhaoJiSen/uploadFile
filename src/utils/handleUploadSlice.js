import { generateHash } from './helper/index';
import uploadRequest from '@/api/upload';

(() => {
  const upload7 = document.getElementById('upload7'),
    upload7_inp = upload7.querySelector('.upload_inp'),
    upload7_btn_select = upload7.querySelector('.upload_button.select'),
    upload7_progress = upload7.querySelector('.upload_progress'),
    upload7_value = upload7_progress.querySelector('.value');

  const checkDisable = element => {
    let classList = element.classList;
    return classList.contains('disable') || classList.contains('loading');
  };

  const openSelect = () => {
    const isDisable = checkDisable(upload7_btn_select);

    if (isDisable) return;
    upload7_inp.click();
  };

  const clearState = () => {
    upload7_inp.value = '';
    upload7_btn_select.classList.remove('loading');
    upload7_progress.style.display = 'none';
    upload7_value.style.width = '0%';
  };

  const translateComplete = async (index, counter, hash) => {
    // 管控进度条
    if (index >= counter) {
      upload7_value.style.width = '100%';
      try {
        // 所有切片传递成功，发送合并请求
        const res = await uploadRequest.post(
          '/upload_merge',
          {
            HASH: hash,
            counter
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        if (+res.code === 0) {
          alert('文件上传成功!');
          clearState();
        } else {
          throw res.codeTxt;
        }
      } catch (e) {
        alert(e);
        clearState();
      }
    }
  };

  const handleSelectFile = async e => {
    const file = e.target.files[0];
    let uploaded = [],
      max = 1024 * 100,
      counter = Math.ceil(file.size / max),
      chunks = [],
      index = 0;

    if (!file) return;

    upload7_btn_select.classList.add('loading');
    upload7_progress.style.display = 'block';

    // 获取文件 hash
    let { hash, suffix } = await generateHash(file);

    // 获取已经上传的切片
    try {
      const res = await uploadRequest.get('/upload_already', {
        params: {
          HASH: hash
        }
      });

      if (+res.code === 0) uploaded = res.fileList;
    } catch (e) {}

    // 当分片数量不得大于 100 ，大于等于 100 时重新设置 max 大小
    if (counter >= 100) {
      counter = 100;
      max = file.size / counter;
    }

    // 通过 slice 方法切割
    for (let i = 0; i < counter; i++) {
      chunks.push({
        file: file.slice(i * max, (i + 1) * max),
        filename: `${hash}_${i + 1}.${suffix}`
      });
    }

    for (let chunk of chunks) {
      if (uploaded.length > 0 && uploaded.includes(chunk.filename)) {
        index++;
        upload7_value.style.width = `${(index / counter) * 100}%`;
        continue; // 跳过已上传的切片
      }

      const formData = new FormData();
      formData.append('file', chunk.file);
      formData.append('filename', chunk.filename);

      try {
        const res = await uploadRequest.post('/upload_chunk', formData);

        if (+res.code === 0) {
          index++;
          upload7_value.style.width = `${(index / counter) * 100}%`;
        } else {
          throw res.codeTxt;
        }
      } catch (e) {
        alert('文件上传失败');
        clearState();
        break; // 出现错误，中断上传
      }
    }

    await translateComplete(index, counter, hash);
  };

  upload7_btn_select.addEventListener('click', openSelect, false);
  upload7_inp.addEventListener('change', handleSelectFile, false);
})();
