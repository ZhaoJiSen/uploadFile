import uploadRequest from '@/api/upload';
import { generateHash } from './helper/index'

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
    
    const fileSlice = () => {
    
    }
    const handleSelectFile = async e => {
        const file = e.target.files[0];
        if (!file) return;
        
        upload7_btn_select.classList.add('loading');
        
        // 获取已经上传
       
    };
    
    upload7_btn_select.addEventListener('click', openSelect, false);
    upload7_inp.addEventListener('change', handleSelectFile, false);
})();
