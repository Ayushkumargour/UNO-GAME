/**
 * UNO Game Logic
 * Handles game state, turn management, and rule enforcement
 */
class Game {
    constructor() {
        this.deck = new Deck();
        this.discardPile = [];
        this.players = [
            { id: 1, name: 'You', hand: [], isBot: false },
            { id: 2, name: 'Bot', hand: [], isBot: true }
        ];
        this.currentPlayerIndex = 0;
        this.direction = 1; // 1 for clockwise, -1 for counter-clockwise
        this.gameOver = false;
        this.winner = null;
        this.currentColor = null;
        this.unoCalled = false;
        this.lastPlayedCard = null;
        this.stats = this.loadStats();
        this.gameHistory = [];
    }

    /**
     * Load game statistics from LocalStorage
     */
    loadStats() {
        const defaultStats = { wins: 0, losses: 0 };
        try {
            const savedStats = localStorage.getItem('unoStats');
            return savedStats ? JSON.parse(savedStats) : defaultStats;
        } catch (error) {
            console.warn('Failed to load stats from LocalStorage:', error);
            return defaultStats;
        }
    }

    /**
     * Save game statistics to LocalStorage
     */
    saveStats() {
        try {
            localStorage.setItem('unoStats', JSON.stringify(this.stats));
        } catch (error) {
            console.warn('Failed to save stats to LocalStorage:', error);
        }
    }

    /**
     * Update statistics when game ends
     */
    updateStats(isWin) {
        if (isWin) {
            this.stats.wins++;
        } else {
            this.stats.losses++;
        }
        this.saveStats();
    }

    /**
     * Initialize a new game
     */
    startNewGame() {
        this.deck.reset();
        this.discardPile = [];
        this.players.forEach(player => player.hand = []);
        this.currentPlayerIndex = 0;
        this.direction = 1;
        this.gameOver = false;
        this.winner = null;
        this.unoCalled = false;
        this.lastPlayedCard = null;
        this.gameHistory = [];

        // Deal initial cards (7 each)
        this.players.forEach(player => {
            for (let i = 0; i < 7; i++) {
                const card = this.deck.drawCard();
                if (card) player.hand.push(card);
            }
        });

        // Start with a non-action card on the discard pile
        let startCard;
        do {
            startCard = this.deck.drawCard();
            if (startCard && startCard.type === 'number') {
                this.discardPile.push(startCard);
                this.currentColor = startCard.color;
                this.lastPlayedCard = startCard;
                break;
            } else if (startCard) {
                // If it's an action card, put it back and draw again
                this.deck.cards.unshift(startCard);
            }
        } while (this.deck.getRemainingCards() > 0);

        // If we couldn't find a number card, use the first card
        if (!startCard) {
            startCard = this.deck.drawCard();
            if (startCard) {
                this.discardPile.push(startCard);
                this.currentColor = startCard.color;
                this.lastPlayedCard = startCard;
            }
        }

        // Log game start
        this.logGameEvent('Game started');
    }

    /**
     * Get current player
     */
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * Get next player index
     */
    getNextPlayerIndex() {
        let nextIndex = this.currentPlayerIndex + this.direction;
        if (nextIndex >= this.players.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = this.players.length - 1;
        return nextIndex;
    }

    /**
     * Check if a card can be played
     */
    canPlayCard(card) {
        if (!this.lastPlayedCard) return true;

        // Wild cards can always be played
        if (card.type === 'wild') return true;

        // Check color match
        if (card.color === this.currentColor) return true;

        // Check number match
        if (card.type === 'number' && this.lastPlayedCard.type === 'number') {
            if (card.value === this.lastPlayedCard.value) return true;
        }

        // Check action card match
        if (card.type === 'action' && this.lastPlayedCard.type === 'action') {
            if (card.value === this.lastPlayedCard.value) return true;
        }

        return false;
    }

    /**
     * Get playable cards for current player
     */
    getPlayableCards() {
        const currentPlayer = this.getCurrentPlayer();
        return currentPlayer.hand.filter(card => this.canPlayCard(card));
    }

    /**
     * Play a card
     */
    playCard(cardIndex, chosenColor = null) {
        const currentPlayer = this.getCurrentPlayer();
        const card = currentPlayer.hand[cardIndex];

        if (!card || !this.canPlayCard(card)) {
            return { success: false, message: 'Invalid card selection' };
        }

        // Remove card from hand
        currentPlayer.hand.splice(cardIndex, 1);

        // Add to discard pile
        this.discardPile.push(card);
        this.lastPlayedCard = card;

        // Handle wild card color selection
        if (card.type === 'wild') {
            this.currentColor = chosenColor || 'red'; // Default to red if no color chosen
        } else {
            this.currentColor = card.color;
        }

        // Log the play
        this.logGameEvent(`${currentPlayer.name} played ${card.display} (${card.color})`);

        // Handle action cards
        this.handleActionCard(card);

        // Check for UNO
        if (currentPlayer.hand.length === 1) {
            this.unoCalled = false; // Reset for next player
        }

        // Check for win
        if (currentPlayer.hand.length === 0) {
            this.gameOver = true;
            this.winner = currentPlayer;
            this.updateStats(!currentPlayer.isBot);
            this.logGameEvent(`${currentPlayer.name} wins!`);
            return { success: true, message: `${currentPlayer.name} wins!` };
        }

        // Move to next player (unless skip was played)
        if (card.type !== 'action' || card.value !== 'skip') {
            this.moveToNextPlayer();
        }

        return { success: true, message: 'Card played successfully' };
    }

    /**
     * Handle action card effects
     */
    handleActionCard(card) {
        switch (card.value) {
            case 'skip':
                this.logGameEvent('Skip turn!');
                break;
            case 'reverse':
                this.direction *= -1;
                this.logGameEvent('Direction reversed!');
                break;
            case 'draw2':
                this.drawCardsForNextPlayer(2);
                this.moveToNextPlayer();
                this.logGameEvent('Next player draws 2 cards!');
                break;
            case 'wild4':
                this.drawCardsForNextPlayer(4);
                this.moveToNextPlayer();
                this.logGameEvent('Next player draws 4 cards!');
                break;
        }
    }

    /**
     * Draw cards for the next player
     */
    drawCardsForNextPlayer(count) {
        const nextPlayerIndex = this.getNextPlayerIndex();
        const nextPlayer = this.players[nextPlayerIndex];
        
        for (let i = 0; i < count; i++) {
            const card = this.deck.drawCard();
            if (card) nextPlayer.hand.push(card);
        }
    }

    /**
     * Move to next player
     */
    moveToNextPlayer() {
        this.currentPlayerIndex = this.getNextPlayerIndex();
        const nextPlayer = this.getCurrentPlayer();
        this.logGameEvent(`${nextPlayer.name}'s turn`);
    }

    /**
     * Draw a card for current player
     */
    drawCard() {
        const currentPlayer = this.getCurrentPlayer();
        const card = this.deck.drawCard();
        
        if (card) {
            currentPlayer.hand.push(card);
            this.logGameEvent(`${currentPlayer.name} drew a card`);
            this.moveToNextPlayer();
            return { success: true, card: card };
        } else {
            // If deck is empty, reshuffle discard pile
            this.reshuffleDiscardPile();
            const newCard = this.deck.drawCard();
            if (newCard) {
                currentPlayer.hand.push(newCard);
                this.logGameEvent(`${currentPlayer.name} drew a card (reshuffled deck)`);
                this.moveToNextPlayer();
                return { success: true, card: newCard };
            }
            return { success: false, message: 'No cards available' };
        }
    }

    /**
     * Reshuffle discard pile when deck is empty
     */
    reshuffleDiscardPile() {
        if (this.discardPile.length <= 1) return;

        // Keep the top card
        const topCard = this.discardPile.pop();
        
        // Shuffle the rest back into the deck
        const cardsToReshuffle = this.discardPile;
        this.discardPile = [topCard];
        
        this.deck.addCards(cardsToReshuffle);
        this.deck.shuffle();
        this.logGameEvent('Deck reshuffled');
    }

    /**
     * Bot AI - make a move with improved strategy
     */
    makeBotMove() {
        const currentPlayer = this.getCurrentPlayer();
        const playableCards = this.getPlayableCards();

        if (playableCards.length > 0) {
            // Improved bot strategy: prefer action cards and wild cards
            const actionCards = playableCards.filter(card => card.type === 'action');
            const wildCards = playableCards.filter(card => card.type === 'wild');
            const numberCards = playableCards.filter(card => card.type === 'number');

            let cardToPlay;
            
            // Prefer action cards if available
            if (actionCards.length > 0) {
                cardToPlay = actionCards[Math.floor(Math.random() * actionCards.length)];
            } else if (wildCards.length > 0) {
                cardToPlay = wildCards[Math.floor(Math.random() * wildCards.length)];
            } else {
                cardToPlay = numberCards[Math.floor(Math.random() * numberCards.length)];
            }

            const cardIndex = currentPlayer.hand.findIndex(card => 
                card === cardToPlay
            );

            // Choose a color for wild cards (prefer colors the bot has)
            const colors = ['red', 'green', 'blue', 'yellow'];
            let chosenColor = null;
            
            if (cardToPlay.type === 'wild') {
                // Choose color based on bot's hand
                const colorCounts = {};
                colors.forEach(color => {
                    colorCounts[color] = currentPlayer.hand.filter(card => card.color === color).length;
                });
                
                // Choose the color the bot has most of
                const maxColor = Object.keys(colorCounts).reduce((a, b) => 
                    colorCounts[a] > colorCounts[b] ? a : b
                );
                chosenColor = maxColor;
            }

            return this.playCard(cardIndex, chosenColor);
        } else {
            // No playable cards, draw a card
            return this.drawCard();
        }
    }

    /**
     * Call UNO
     */
    callUno() {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.hand.length === 1) {
            this.unoCalled = true;
            this.logGameEvent(`${currentPlayer.name} called UNO!`);
            return { success: true, message: 'UNO called!' };
        }
        return { success: false, message: 'Can only call UNO with one card' };
    }

    /**
     * Log game events for debugging
     */
    logGameEvent(event) {
        this.gameHistory.push({
            timestamp: new Date().toISOString(),
            event: event,
            player: this.getCurrentPlayer().name,
            cardsInHand: this.getCurrentPlayer().hand.length
        });
        
        // Keep only last 50 events
        if (this.gameHistory.length > 50) {
            this.gameHistory = this.gameHistory.slice(-50);
        }
    }

    /**
     * Get game state for UI updates
     */
    getGameState() {
        return {
            currentPlayer: this.getCurrentPlayer(),
            players: this.players,
            currentColor: this.currentColor,
            lastPlayedCard: this.lastPlayedCard,
            deckSize: this.deck.getRemainingCards(),
            gameOver: this.gameOver,
            winner: this.winner,
            direction: this.direction,
            unoCalled: this.unoCalled,
            stats: this.stats,
            gameHistory: this.gameHistory
        };
    }

    /**
     * Get game statistics
     */
    getStats() {
        return this.stats;
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = { wins: 0, losses: 0 };
        this.saveStats();
    }
}

// Export for use in other modules
window.Game = Game; 