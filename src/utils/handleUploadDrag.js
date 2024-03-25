import uploadRequest from '@/api/upload';

(() => {
    const upload6 = document.getElementById('upload6'),
        upload6_inp = upload6.querySelector('.upload_inp'),
        upload6_submit = upload6.querySelector('.upload_submit'),
        upload6_mark = upload6.querySelector('.upload_mark');
    
    let isRun = false;
    
    const openSelect = () => {
        upload6_inp.click();
    };
    
    const fileUpload = async (file) => {
        if (!isRun) return;
        isRun = true;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        upload6_mark.style.display = 'block';
        
        try {
            const res = await uploadRequest.post('upload_single', formData);
            if (+res.code === 0) return alert('文件上传成功!');
            
            throw res.codeTxt;
            
        } catch (e) {
            alert('文件上传失败，请重试!');
        } finally {
            upload6_mark.style.display = 'none';
            isRun = false;
        }
    };
    const getFile = async (e) => {
        let file = e.target.files[0];
        if (!file) return;
        
        await fileUpload(file);
    };
    
    const fileEnter = () => {
    };
    
    const fileLeave = () => {
    };
    
    const fileOver = (e) => {
        // 阻止浏览器默认预览的行为
        e.preventDefault();
    };
    
    const fileDrop = async (e) => {
        // 阻止浏览器默认预览的行为
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        
        await fileUpload(file);
        
    };
    
    
    upload6_submit.addEventListener('click', openSelect, false);
    upload6_inp.addEventListener('change', getFile, false);
    
    
    upload6.addEventListener('dragenter', fileEnter, false);
    upload6.addEventListener('dragleave', fileLeave, false);
    upload6.addEventListener('dragover', fileOver, false);
    upload6.addEventListener('drop', fileDrop, false);
})();