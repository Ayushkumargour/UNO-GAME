// Bootstraps the UNO game and UI

window.addEventListener('DOMContentLoaded', () => {
	const game = new Game();
	game.startNewGame();

	const ui = new UI(game);
	ui.updateDisplay();

	// Expose for console debugging if needed
	window.__UNO__ = { game, ui };
});

