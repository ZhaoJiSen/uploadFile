import { limitSize } from './helper/index';
import uploadRequest from '@/api/upload';

(() => {
    const upload2 = document.getElementById('upload2'),
        upload2_inp = upload2.querySelector('.upload_inp'),
        upload2_tip = upload2.querySelector('.upload_tip'),
        upload2_btn_select = upload2.querySelector('.upload_button.select');
    
    const checkDisable = element => {
        let classList = element.classList;
        
        return classList.contains('disable') || classList.contains('loading');
    };
    
    const handleSelect = () => {
        const isDisable = checkDisable(upload2_btn_select);
        
        if (isDisable) return;
        upload2_inp.click();
    };
    
    const transBase64 = file => {
        return new Promise(resolve => {
            // 基于 FileReader
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = e => {
                resolve(e.target.result);
            };
        });
    };
    
    const handleSelectFile = async e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const approval = limitSize(file.size);
        
        if (approval) {
            upload2_tip.style.display = 'none';
            upload2_btn_select.classList.add('loading');
            
            const base64 = await transBase64(file);
            
            try {
                 const res = await uploadRequest.post('/upload_single_base64', {
                     // 使用 encodeURIComponent 对特殊字符编码，防止传输过程中出现乱码
                     file: encodeURIComponent(base64),
                     filename: file.name
                 }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                if (+res.code === 0) return alert(`文件上传成功! 可以通过 ${ res.servicePath } 进行访问`);

                throw res.codeText;
                
            } catch (e) {
                console.log(e);
                alert('文件上传失败，请重试!');
            } finally {
                upload2_inp.value = '';
                upload2_tip.style.display = 'block';
                upload2_btn_select.classList.remove('loading');
            }
        }
    };
    
    upload2_btn_select.addEventListener('click', handleSelect, false);
    upload2_inp.addEventListener('change', handleSelectFile, false);
})();
