/**
 * UNO User Interface Management
 * Handles DOM rendering, user interactions, and visual feedback
 */
class UI {
    constructor(game) {
        this.game = game;
        this.selectedCardIndex = -1;
        this.colorPickerVisible = false;
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.elements = {
            humanHand: document.getElementById('human-hand'),
            botHand: document.getElementById('bot-hand'),
            drawPile: document.getElementById('draw-pile'),
            discardPile: document.getElementById('discard-pile'),
            topCard: document.getElementById('top-card'),
            turnIndicator: document.getElementById('turn-indicator'),
            turnText: document.querySelector('.turn-text'),
            humanCardCount: document.getElementById('human-card-count'),
            botCardCount: document.getElementById('bot-card-count'),
            deckCount: document.getElementById('deck-count'),
            gameMessages: document.getElementById('game-messages'),
            drawBtn: document.getElementById('draw-btn'),
            unoBtn: document.getElementById('uno-btn'),
            restartBtn: document.getElementById('restart-btn'),
            winsDisplay: document.getElementById('wins'),
            lossesDisplay: document.getElementById('losses'),
            colorPickerModal: document.getElementById('color-picker-modal'),
            gameOverModal: document.getElementById('game-over-modal'),
            gameOverTitle: document.getElementById('game-over-title'),
            gameOverMessage: document.getElementById('game-over-message'),
            playAgainBtn: document.getElementById('play-again-btn'),
            closeModalBtn: document.getElementById('close-modal-btn')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.elements.drawBtn.addEventListener('click', () => this.handleDrawCard());
        this.elements.unoBtn.addEventListener('click', () => this.handleCallUno());
        this.elements.restartBtn.addEventListener('click', () => this.handleNewGame());
        this.elements.playAgainBtn.addEventListener('click', () => this.handlePlayAgain());
        this.elements.closeModalBtn.addEventListener('click', () => this.hideGameOverModal());

        // Color picker events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.color-btn')) {
                const colorBtn = e.target.closest('.color-btn');
                const color = colorBtn.dataset.color;
                this.handleColorSelection(color);
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideColorPicker();
                this.hideGameOverModal();
            }
        });
    }

    /**
     * Update the entire game display
     */
    updateDisplay() {
        const gameState = this.game.getGameState();
        
        this.updatePlayerHands();
        this.updateTopCard();
        this.updateGameInfo(gameState);
        this.updateButtons(gameState);
        this.updateStats(gameState);
        this.highlightPlayableCards();
    }

    /**
     * Update player hands display
     */
    updatePlayerHands() {
        const gameState = this.game.getGameState();
        
        // Update human hand
        this.renderHand(this.elements.humanHand, gameState.players[0].hand, false);
        
        // Update bot hand (show card backs)
        this.renderHand(this.elements.botHand, gameState.players[1].hand, true);
        
        // Update card counts
        this.elements.humanCardCount.textContent = `${gameState.players[0].hand.length} cards`;
        this.elements.botCardCount.textContent = `${gameState.players[1].hand.length} cards`;
    }

    /**
     * Render a player's hand
     */
    renderHand(container, hand, isHidden) {
        container.innerHTML = '';
        
        hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index, isHidden);
            container.appendChild(cardElement);
        });
    }

    /**
     * Create a card element
     */
    createCardElement(card, index, isHidden = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = index;
        
        if (isHidden) {
            // Show card back for bot
            cardDiv.innerHTML = '<div class="card-pattern"></div>';
        } else {
            // Show actual card
            cardDiv.className += ` ${card.color}`;
            cardDiv.innerHTML = `
                <div class="card-content">
                    <div class="card-value">${card.symbol || card.display}</div>
                </div>
            `;
            
            // Add click event for human player cards
            cardDiv.addEventListener('click', () => this.handleCardClick(index));
        }
        
        return cardDiv;
    }

    /**
     * Update the top card on the discard pile
     */
    updateTopCard() {
        const gameState = this.game.getGameState();
        const topCard = gameState.lastPlayedCard;
        
        if (topCard) {
            this.elements.topCard.className = `card ${topCard.color}`;
            this.elements.topCard.innerHTML = `
                <div class="card-content">
                    <div class="card-value">${topCard.symbol || topCard.display}</div>
                </div>
            `;
        }
    }

    /**
     * Update game information display
     */
    updateGameInfo(gameState) {
        const currentPlayer = gameState.currentPlayer;
        const turnText = currentPlayer.isBot ? `${currentPlayer.name}'s Turn` : 'Your Turn';
        this.elements.turnText.textContent = turnText;
        
        // Update deck count
        this.elements.deckCount.textContent = gameState.deckSize;
        
        // Update turn indicator style
        if (currentPlayer.isBot) {
            this.elements.turnIndicator.style.background = 'linear-gradient(135deg, #e67e22, #d35400)';
        } else {
            this.elements.turnIndicator.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }
    }

    /**
     * Update button states
     */
    updateButtons(gameState) {
        const currentPlayer = gameState.currentPlayer;
        const isHumanTurn = !currentPlayer.isBot;
        
        // Show/hide UNO button
        if (isHumanTurn && currentPlayer.hand.length === 1 && !gameState.unoCalled) {
            this.elements.unoBtn.style.display = 'flex';
        } else {
            this.elements.unoBtn.style.display = 'none';
        }
        
        // Enable/disable draw button
        this.elements.drawBtn.disabled = !isHumanTurn || gameState.gameOver;
        
        // Show game over modal if game is over
        if (gameState.gameOver) {
            this.showGameOverModal(gameState);
        }
    }

    /**
     * Update statistics display
     */
    updateStats(gameState) {
        this.elements.winsDisplay.textContent = gameState.stats.wins;
        this.elements.lossesDisplay.textContent = gameState.stats.losses;
    }

    /**
     * Highlight playable cards
     */
    highlightPlayableCards() {
        const gameState = this.game.getGameState();
        const currentPlayer = gameState.currentPlayer;
        
        if (!currentPlayer.isBot) {
            const playableCards = this.game.getPlayableCards();
            const cardElements = this.elements.humanHand.querySelectorAll('.card');
            
            cardElements.forEach((cardElement, index) => {
                const card = currentPlayer.hand[index];
                if (card && playableCards.includes(card)) {
                    cardElement.classList.add('playable');
                } else {
                    cardElement.classList.remove('playable');
                }
            });
        }
    }

    /**
     * Handle card click
     */
    handleCardClick(index) {
        const gameState = this.game.getGameState();
        const currentPlayer = gameState.currentPlayer;
        
        if (currentPlayer.isBot || gameState.gameOver) return;
        
        const card = currentPlayer.hand[index];
        if (!card) return;
        
        if (this.game.canPlayCard(card)) {
            if (card.type === 'wild') {
                this.showColorPicker(index);
            } else {
                this.playCard(index);
            }
        } else {
            this.showMessage('Invalid card selection', 'error');
        }
    }

    /**
     * Show color picker for wild cards
     */
    showColorPicker(cardIndex) {
        this.colorPickerVisible = true;
        this.selectedCardIndex = cardIndex;
        this.elements.colorPickerModal.style.display = 'flex';
    }

    /**
     * Hide color picker
     */
    hideColorPicker() {
        this.colorPickerVisible = false;
        this.selectedCardIndex = -1;
        this.elements.colorPickerModal.style.display = 'none';
    }

    /**
     * Handle color selection
     */
    handleColorSelection(color) {
        if (this.selectedCardIndex !== -1) {
            this.playCard(this.selectedCardIndex, color);
            this.hideColorPicker();
        }
    }

    /**
     * Play a card
     */
    playCard(cardIndex, chosenColor = null) {
        const result = this.game.playCard(cardIndex, chosenColor);
        
        if (result.success) {
            this.showMessage(result.message, 'success');
            this.updateDisplay();
            
            // If it's still the bot's turn, make bot move
            setTimeout(() => {
                if (this.game.getCurrentPlayer().isBot && !this.game.gameOver) {
                    this.makeBotMove();
                }
            }, 1000);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Make bot move
     */
    makeBotMove() {
        const result = this.game.makeBotMove();
        this.showMessage(`${this.game.getCurrentPlayer().name}: ${result.message}`, 'info');
        this.updateDisplay();
        
        // Continue bot turns if needed
        setTimeout(() => {
            if (this.game.getCurrentPlayer().isBot && !this.game.gameOver) {
                this.makeBotMove();
            }
        }, 1000);
    }

    /**
     * Handle draw card button
     */
    handleDrawCard() {
        const gameState = this.game.getGameState();
        if (gameState.gameOver || gameState.currentPlayer.isBot) return;
        
        const result = this.game.drawCard();
        if (result.success) {
            this.showMessage('Card drawn', 'info');
            this.updateDisplay();
            
            // If it's now the bot's turn, make bot move
            setTimeout(() => {
                if (this.game.getCurrentPlayer().isBot && !this.game.gameOver) {
                    this.makeBotMove();
                }
            }, 1000);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Handle UNO button
     */
    handleCallUno() {
        const result = this.game.callUno();
        this.showMessage(result.message, result.success ? 'success' : 'error');
        this.updateDisplay();
    }

    /**
     * Handle new game button
     */
    handleNewGame() {
        this.game.startNewGame();
        this.updateDisplay();
        this.showMessage('New game started!', 'success');
    }

    /**
     * Handle play again button
     */
    handlePlayAgain() {
        this.hideGameOverModal();
        this.handleNewGame();
    }

    /**
     * Show game over modal
     */
    showGameOverModal(gameState) {
        const winner = gameState.winner;
        const isWin = !winner.isBot;
        
        this.elements.gameOverTitle.textContent = isWin ? 'You Win!' : 'You Lose!';
        this.elements.gameOverMessage.textContent = `${winner.name} won the game!`;
        this.elements.gameOverModal.style.display = 'flex';
    }

    /**
     * Hide game over modal
     */
    hideGameOverModal() {
        this.elements.gameOverModal.style.display = 'none';
    }

    /**
     * Show a message
     */
    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        this.elements.gameMessages.appendChild(messageElement);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    /**
     * Animate card play
     */
    animateCardPlay(cardElement) {
        cardElement.classList.add('playing');
        setTimeout(() => {
            cardElement.classList.remove('playing');
        }, 600);
    }

    /**
     * Animate card draw
     */
    animateCardDraw(cardElement) {
        cardElement.classList.add('drawing');
        setTimeout(() => {
            cardElement.classList.remove('drawing');
        }, 400);
    }

    /**
     * Get UI instance for debugging
     */
    getUI() {
        return this;
    }
}

// Export for use in other modules
window.UI = UI; 