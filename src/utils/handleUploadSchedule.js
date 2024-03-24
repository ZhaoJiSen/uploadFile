import { limitSize } from './helper/index';
import uploadRequest from '@/api/upload';

(() => {
  const upload4 = document.getElementById('upload4'),
    upload4_inp = upload4.querySelector('.upload_inp'),
    upload4_btn_select = upload4.querySelector('.upload_button.select'),
    upload4_progress = upload4.querySelector('.upload_progress'),
    upload4_value = upload4_progress.querySelector('.value');

  const checkDisable = element => {
    let classList = element.classList;

    return classList.contains('disable') || classList.contains('loading');
  };

  const handleSelect = () => {
    const isDisable = checkDisable(upload4_btn_select);

    if (isDisable) return;
    upload4_inp.click();
  };

  const handleSelectFile = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const approval = limitSize(file.size);

    if (approval) {
      upload4_btn_select.classList.add('loading');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      try {
        const res = await uploadRequest.post('/upload_single', formData, {
          onUploadProgress(e) {
            let { loaded, total } = e;
            upload4_progress.style.display = 'block';
            upload4_value.style.width = `${(loaded / total) * 100}% `;
          }
        });

        if (+res.code === 0) {
          upload4_value.style.width = '100%';
          setTimeout(() => {
            return alert(`文件上传成功! 可以通过 ${res.servicePath} 进行访问`);
          });

          return;
        }

        throw res.codeText;
      } catch (e) {
        alert('文件上传失败，请重试!');
      } finally {
        upload4_inp.value = '';
        upload4_progress.style.display = 'none';
        upload4_value.style.width = '';
        upload4_btn_select.classList.remove('loading');
      }
    }
  };

  upload4_btn_select.addEventListener('click', handleSelect, false);
  upload4_inp.addEventListener('change', handleSelectFile, false);
})();
