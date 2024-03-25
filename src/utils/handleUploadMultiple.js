import { classControl } from './helper/index';
import uploadRequest from '@/api/upload';

(() => {
  const upload5 = document.getElementById('upload5'),
    upload5_inp = upload5.querySelector('.upload_inp'),
    upload5_list = upload5.querySelector('.upload_list'),
    upload5_btn_select = upload5.querySelector('.upload_button.select'),
    upload5_btn_upload = upload5.querySelector('.upload_button.upload');

  let _files = [];

  const handleSelect = () => {
    if (upload5_btn_select.classList.contains('disable')) return;
    upload5_inp.click();
  };

  // 获取唯一值
  const createRandom = () => {
    return (Math.random() * new Date()).toString(16).replace('.', '');
  };

  const handleSelectFile = e => {
    _files = Array.from(e.target.files);
    if (_files.length === 0) return;

    //! 重构集合属性，使得在删除某一项时，files 中的文件对象也可以得到删除
    _files = _files.map(file => {
      return {
        file,
        filename: file.name,
        key: createRandom()
      };
    });

    let str = ``;
    _files.forEach((item, index) => {
      str += `
        <li key="${item.key}">
          <span>文件${index + 1}: ${item.filename}</span>
          <span><em>移除</em></span>
        </li>
      `;
    });

    upload5_list.innerHTML = str;
    upload5_list.style.display = 'block';
  };

  const handleReset = () => {
    upload5_list.style.display = 'none';

    upload5_list.innerHTML = '';
    _files = null;

    upload5_inp.value = '';
  };

  const handleRemove = e => {
    let target = e.target,
      currentLi = null,
      key;

    if (target.tagName === 'EM') {
      currentLi = target.parentNode.parentNode;
      if (!currentLi) return;
      upload5_list.removeChild(currentLi);
      key = currentLi.getAttribute('key');

      _files = _files.filter(item => item.key !== key);

      if (_files.length === 0) {
        upload5_list.style.display = 'none';
      }
    }
  };

  const handleUpload = async () => {
    if (upload5_btn_upload.classList.contains('loading')) return;

    console.log(_files);
    if (_files.length === 0) return alert('请选择需要上传的文件!');

    classControl(upload5_btn_upload, upload5_btn_select, true);

    let upload_list_arr = Array.from(upload5_list.querySelectorAll('li'));

    // 循环发送请求，并且监听每一个进度
    _files = _files.map(item => {
      let formData = new FormData();
      let currentLi = upload_list_arr.find(lis => lis.getAttribute('key') === item.key);
      let currentSpan = currentLi ? currentLi.querySelector('span:nth-last-child(1)') : null;

      formData.append('file', item.file);
      formData.append('filename', item.filename)
      
      return uploadRequest
        .post('/upload_single', formData, {
          onUploadProgress(e) {
            let { loaded, total } = e;

            if (currentSpan) {
              currentSpan.innerHTML = `${((loaded / total) * 100).toFixed(2)}% `;
            }
          }
        })
        .then(res => {
          if (+res.code === 0) {
            if (currentSpan) {
              currentSpan.innerHTML = `100% `;
            }
            return;
          }

          return Promise.reject(res.codeTxt);
        });
    });

    Promise.all(_files)
      .then(() => {
        alert('全部文件上传成功');
      })
      .catch(() => {
        alert('上传过程中出现问题，请重试');
      })
      .finally(() => {
        _files = [];
        handleReset();
        classControl(upload5_btn_upload, upload5_btn_select, false);
      });
  };

  upload5_btn_select.addEventListener('click', handleSelect, false);
  upload5_inp.addEventListener('change', handleSelectFile, false);
  upload5_list.addEventListener('click', handleRemove, false);
  upload5_btn_upload.addEventListener('click', handleUpload, false);
})();
