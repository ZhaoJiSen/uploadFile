import { classControl, limitSize } from './helper/index';
import uploadRequest from '@/api/upload';

// 单一文件使用 formData 格式上传
(() => {
  const upload1 = document.getElementById('upload1'),
    upload1_inp = upload1.querySelector('.upload_inp'),
    upload1_tip = upload1.querySelector('.upload_tip'),
    upload1_list = upload1.querySelector('.upload_list'),
    upload1_btn_select = upload1.querySelector('.upload_button.select'),
    upload1_btn_upload = upload1.querySelector('.upload_button.upload');

  let _file = null;

  /**
   * @Description 重设样式
   * @date 2024/3/25 - 15:54:09
   */
  const reset = () => {
    upload1_tip.style.display = 'block';
    upload1_list.style.display = 'none';

    upload1_list.innerHTML = '';
    _file = null;

    //! 由于 input 元素会记录下次选择的文件，如果下一次选择了同一个文件浏览器认为这并没有引起状态的改变，不会触发 change 事件
    upload1_inp.value = '';
  };

  /**
   * @Description 移除按键所对应的事件处理函数
   * @date 2024/3/25 - 15:54:33
   * @param {Event} e
   */
  const remove = e => {
    let target = e.target;
    if (target.tagName === 'EM') reset();
  };

  /**
   * @Description 由于隐藏了 input:file 的文件上传按钮，所以使用了一个单独的按钮来调用 file 的文件选择
   * @date 2024/3/25 - 15:55:11
   */
  const openSelect = () => {
    //! 防止上传时点击
    if (upload1_btn_select.classList.contains('disable')) return;
    upload1_inp.click();
  };

  /**
   * @Description 获取用户所选择的文件
   * @date 2024/3/25 - 15:56:10
   * @param {Event} e
   */
  const fileSelect = e => {
    _file = e.target.files[0];
    if (!_file) return;

    const approval = limitSize(_file.size);

    // 展示上传文件信息
    if (approval) {
      upload1_tip.style.display = 'none';
      upload1_list.style.display = 'block';

      upload1_list.innerHTML = `
        <li>
          <span>文件: ${_file.name}</span>
          <span><em>移除</em></span>
        </li>
      `;
    }
  };

  /**
   * @Description 点击上传所对应的事件处理函数
   * @date 2024/3/25 - 15:56:42
   * @async
   * @returns {unknown}
   */
  const handleUpload = async () => {
    //! 防止上传时再次点击
    if (upload1_btn_upload.classList.contains('loading')) return;

    if (!_file) return alert('请选择需要上传的文件!');

    classControl(upload1_btn_upload, upload1_btn_select, true);

    let formData = new FormData();
    formData.append('file', _file);
    formData.append('file_name', _file.name);

    try {
      const res = await uploadRequest.post('/upload_single', formData);

      if (+res.code === 0) return alert(`文件上传成功! 可以通过 ${res.servicePath} 进行访问`);

      throw new Error(res.codeText);
    } catch (e) {
      alert('文件上传失败，请重试!');
    } finally {
      // 状态还原
      reset();
      classControl(upload1_btn_upload, upload1_btn_select, false);
    }
  };

  upload1_list.addEventListener('click', remove, false); //! 通过事件委托的方式来让 upload1_list 内部的 span 点击时触发
  upload1_inp.addEventListener('change', fileSelect, false);
  upload1_btn_select.addEventListener('click', openSelect, false);
  upload1_btn_upload.addEventListener('click', handleUpload, false);
})();
