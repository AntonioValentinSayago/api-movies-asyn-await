const popup = document.getElementById('media');

popup.addEventListener('click', (e) => {

    if (e.target.closest('button')) {
        popup.classList.remove('media--active');
    }

});