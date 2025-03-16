// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("Hong's Portfolio Loaded!");

    // 내비게이션 링크 활성화
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        // 클릭 이벤트: 클릭 시 모든 링크에서 'active' 제거 후 현재 링크에 추가
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 클릭 후 일정 시간(예: 1초) 뒤에 'active' 클래스 제거
            setTimeout(() => {
                link.classList.remove('active');
            }, 1000); // 1000ms = 1초, 필요에 따라 시간 조정 가능
        });

        // 마우스 오버 이벤트: 마우스가 올라가면 'active' 추가
        link.addEventListener('mouseover', () => {
            link.classList.add('active');
        });

        // 마우스 아웃 이벤트: 마우스가 벗어나면 'active' 제거
        link.addEventListener('mouseout', () => {
            link.classList.remove('active');
        });
    });
});

    // 모달 창 기능
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const closeModal = document.querySelector('.modal-close');

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

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });