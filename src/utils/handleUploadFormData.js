import { limitSize } from './helper/index';
import uploadRequest from '@/api/upload';

(() => {
    const upload1 = document.getElementById('upload1'),
        upload1_inp = upload1.querySelector('.upload_inp'),
        upload1_tip = upload1.querySelector('.upload_tip'),
        upload1_list = upload1.querySelector('.upload_list'),
        upload1_btn_select = upload1.querySelector('.upload_button.select'),
        upload1_btn_upload = upload1.querySelector('.upload_button.upload');
    
    let _file = null;
    
    /**
     * @Description 点击选择文件按钮，触发上传文件事件
     * @date 2024/3/23 - 14:01:13
     */
    const handleSelect = () => {
        //! 防止上传时点击
        if (upload1_btn_select.classList.contains('disable')) return
        upload1_inp.click();
    };
    
    /**
     * @Description 获取用户选择的文件对象
     * @date 2024/3/23 - 14:04:43
     * @param {Event} e
     */
    const handleSelectFile = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const approval = limitSize(file.size);
        _file = file;
        
        // 展示上传文件信息
        if (approval) {
            upload1_tip.style.display = 'none';
            upload1_list.style.display = 'block';
            
            upload1_list.innerHTML = `
        <li>
          <span>文件: ${ file.name }</span>
          <span><em>移除</em></span>
        </li>
      `;
        }
    };
    
    const handleReset = () => {
        upload1_tip.style.display = 'block';
        upload1_list.style.display = 'none';
        
        upload1_list.innerHTML = '';
        _file = null;
        
        //! 由于 input 元素会记录下次选择的文件，如果下一次选择了同一个文件浏览器认为这并没有引起状态的改变，不会触发 change 事件
        upload1_inp.value = '';
    };
    
    const handleRemove = e => {
        let target = e.target;
        
        if (target.tagName === 'EM') handleReset();
    };
    
    // 按钮状态
    const classControl = (flag) => {
        if (flag) {
            upload1_btn_upload.classList.add('loading');
            upload1_btn_select.classList.add('disable');
        } else {
            upload1_btn_upload.classList.remove('loading');
            upload1_btn_select.classList.remove('disable');
        }
    }
    
    const handleUpload = async () => {
        //! 防止上传时再次点击
        if (upload1_btn_upload.classList.contains('loading')) return;
        
        if (!_file) return alert('请选择需要上传的文件!');
        
        classControl(true);
        
        // 把文件上传到服务器
        // 把选择的 File 对象基于 FormData 的格式传递给服务器
        let formData = new FormData();
        formData.append('file', _file);
        formData.append('file_name', _file.name);
        
        try {
            const res = await uploadRequest.post('/upload_single', formData);
            
            if (+res.code === 0) {
                alert(`文件上传成功! 可以通过 ${ res.servicePath } 进行访问`);
                
                // 状态还原
                handleReset();
                classControl(false);
                
                return;
            }
            
            throw res.codeText;
            
        } catch (e) {
            alert('文件上传失败，请重试!');
            // 状态还原
            handleReset();
            classControl(false);
        }
        
    };
    
    upload1_btn_select.addEventListener('click', handleSelect, false);
    upload1_inp.addEventListener('change', handleSelectFile, false);
    
    //! 通过事件委托的方式来让 upload1_list 内部的 span 点击时触发
    upload1_list.addEventListener('click', handleRemove, false);
    upload1_btn_upload.addEventListener('click', handleUpload, false);
})();
