import { limitSize, classControl, transBase64, generateHash } from './helper/index';
import uploadRequest from '@/api/upload';

(() => {
  const upload3 = document.getElementById('upload3'),
    upload3_inp = upload3.querySelector('.upload_inp'),
    upload3_btn_select = upload3.querySelector('.upload_button.select'),
    upload3_btn_upload = upload3.querySelector('.upload_button.upload'),
    upload3_abbre = upload3.querySelector('.upload_abbre'),
    upload3_abbre_img = upload3_abbre.querySelector('img');

  let _file = null;

  const handleSelect = () => {
    if (upload3_btn_select.classList.contains('disable')) return;
    upload3_inp.click();
  };

  const handleSelectFile = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const approval = limitSize(file.size);
    _file = file;

    if (approval) {
      classControl(upload3_btn_upload, upload3_btn_select, true);
      const base64 = await transBase64(file);

      if (base64) {
        classControl(upload3_btn_upload, upload3_btn_select, false);
        upload3_abbre.style.display = 'block';
        upload3_abbre_img.src = base64;
      }
    }
  };

  const handleUpload = async () => {
    if (upload3_btn_upload.classList.contains('loading')) return;

    if (!_file) return alert('请选择需要上传的文件!');

    classControl(upload3_btn_upload, upload3_btn_select, true);

    // 处理 base64
    const { filename } = await generateHash(_file);

    let formData = new FormData();
    formData.append('file', _file);
    formData.append('filename', filename);

    try {
      const res = await uploadRequest.post('/upload_single_name', formData);

      if (+res.code === 0) return alert('文件上传成功!');

      return new Promise.reject(res.codeText);
    } catch (e) {
      alert('文件上传失败,请重试');
    } finally {
      _file = null;
      upload3_inp.value = '';
      upload3_abbre.style.display = 'none';
      upload3_abbre_img.src = '';
      classControl(upload3_btn_upload, upload3_btn_select, false);
    }
  };

  upload3_btn_select.addEventListener('click', handleSelect, false);
  upload3_inp.addEventListener('change', handleSelectFile, false);

  upload3_btn_upload.addEventListener('click', handleUpload, false);
})();
