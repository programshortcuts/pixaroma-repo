
export function popupLetterNav({isLetterNavEnabled }) {
    const popElLetterNav = document.querySelector('#popElLetterNav')
    // Navigation Mode
        
            document.querySelector('.page-wrapper').classList.toggle('nav-mode-colors')
            popElLetterNav.innerText = `letter navigation : ${isLetterNavEnabled}`
            popElLetterNav.classList.add('animate')
            setTimeout(() => {
                popElLetterNav.classList.remove('animate')
            }, 1000);
            
}