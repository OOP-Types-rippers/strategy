export class MainPage {
    render(container: HTMLElement): void {
        container.innerHTML = `
      <div class="main-page">
        <h1>Strategy Game</h1>
        <nav class="menu">
          <button id="play-btn">Play</button>
          <button id="settings-btn">Settings</button>
        </nav>
      </div>
    `;

        document.getElementById('play-btn')?.addEventListener('click', () => {
            window.location.href = '#/game';
        });

        document.getElementById('settings-btn')?.addEventListener('click', () => {
            window.location.href = '#/settings';
        });
    }
}