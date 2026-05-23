export class MainPage {
    render(container: HTMLElement): void {
        container.innerHTML = '';

        const mainPage = document.createElement('div');
        mainPage.className = 'main-page';

        const heading = document.createElement('h1');
        heading.textContent = 'Strategy Game';
        mainPage.appendChild(heading);

        const nav = document.createElement('nav');
        nav.className = 'menu';

        const playBtn = document.createElement('button');
        playBtn.id = 'play-btn';
        playBtn.textContent = 'Play';
        nav.appendChild(playBtn);

        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'settings-btn';
        settingsBtn.textContent = 'Settings';
        nav.appendChild(settingsBtn);

        mainPage.appendChild(nav);
        container.appendChild(mainPage);

        document.getElementById('play-btn')?.addEventListener('click', () => {
            window.location.href = '#/game';
        });

        document.getElementById('settings-btn')?.addEventListener('click', () => {
            window.location.href = '#/settings';
        });
    }
}