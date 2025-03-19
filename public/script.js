document.addEventListener('DOMContentLoaded', () => {
    console.log("Hong's Portfolio Loaded!");

    // 내비게이션 링크 활성화
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            setTimeout(() => link.classList.remove('active'), 1000);
        });
        link.addEventListener('mouseover', () => link.classList.add('ac     tive'));
        link.addEventListener('mouseout', () => link.classList.remove('active'));
    });

    // 모달 창 기본 기능
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.modal-close');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.getAttribute('data-modal');
            let content = '';
            switch (modalId) {
                case 'project1':
                    content = '<h3>프로젝트 1</h3><p>이 프로젝트는 최신 웹 디자인 트렌드를 반영한 작업입니다.</p>';
                    break;
                case 'project2':
                    content = '<h3>프로젝트 2</h3><p>모바일과 데스크톱에서 모두 완벽히 작동하는 반응형 웹사이트입니다.</p>';
                    break;
                case 'project3':
                    content = '<h3>프로젝트 3</h3><p>사용자 경험을 개선한 UI/UX 프로토타입입니다.</p>';
                    break;
            }
            modalBody.innerHTML = content;
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // 업로드/다운로드 기능
    const uploadButton = document.getElementById('Upload');
    const downloadButton = document.getElementById('Download');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    // 업로드 기능
    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('파일을 선택해주세요!');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                alert(`업로드 성공! 파일 ID: ${result.file_id}`);
            } else {
                alert(`업로드 실패: ${result.error}`);
            }
        } catch (error) {
            console.error('업로드 실패:', error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    });

    // 파일 목록 표시 함수
    async function showFileList() {
        try {
            const response = await fetch('/api/list');
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            // 모달 내용 초기화 및 파일 목록 추가
            modalBody.innerHTML = '<h3>구글 드라이브 파일 목록</h3><div id="fileList" class="file-list"></div>';
            const fileList = modalBody.querySelector('#fileList');

            result.files.forEach(file => {
                const div = document.createElement('div');
                div.className = 'file-item';
                div.innerHTML = `
                    <span>${file.name} (ID: ${file.id})</span>
                    <button class="download-btn" data-fileid="${file.id}" data-filename="${file.name}">다운로드</button>
                `;
                fileList.appendChild(div);
            });

            // 다운로드 버튼 이벤트 adding
            const downloadButtons = fileList.querySelectorAll('.download-btn');
            downloadButtons.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const fileId = btn.getAttribute('data-fileid');
                    const filename = btn.getAttribute('data-filename');
                    await downloadFile(fileId, filename);
                });
            });

            modal.style.display = 'block';
        } catch (error) {
            console.error('목록 오류:', error);
            alert('파일 목록을 가져오는 데 실패했습니다.');
        }
    }

    // 다운로드 함수
    async function downloadFile(fileId, filename) {
        try {
            const response = await fetch(`/api/download?fileId=${fileId}`);
            if (!response.ok) throw new Error('다운로드 실패');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'downloaded_file';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('다운로드 실패:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        }
    }

    // 파일 목록 표시
    downloadButton.addEventListener('click', showFileList);
});