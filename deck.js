/**
 * UNO Deck Management
 * Handles card generation, shuffling, and deck operations
 */
class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    /**
     * Initialize a complete UNO deck with all standard cards
     * Total: 108 cards (4 colors × 25 cards + 8 wild cards)
     */
    initializeDeck() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const actionCards = ['skip', 'reverse', 'draw2'];
        const wildCards = ['wild', 'wild4'];

        // Add number cards for each color
        colors.forEach(color => {
            // One zero card per color
            this.cards.push({
                type: 'number',
                value: 0,
                color: color,
                display: '0',
                symbol: '0'
            });

            // Two of each number 1-9 per color
            for (let i = 1; i <= 9; i++) {
                for (let j = 0; j < 2; j++) {
                    this.cards.push({
                        type: 'number',
                        value: i,
                        color: color,
                        display: `${i}`,
                        symbol: `${i}`
                    });
                }
            }

            // Add action cards (2 of each per color)
            actionCards.forEach(action => {
                for (let i = 0; i < 2; i++) {
                    this.cards.push({
                        type: 'action',
                        value: action,
                        color: color,
                        display: this.getActionDisplay(action),
                        symbol: this.getActionSymbol(action)
                    });
                }
            });
        });

        // Add wild cards (4 of each)
        wildCards.forEach(wild => {
            for (let i = 0; i < 4; i++) {
                this.cards.push({
                    type: 'wild',
                    value: wild,
                    color: 'black',
                    display: wild === 'wild' ? 'WILD' : '+4',
                    symbol: wild === 'wild' ? 'W' : '+4',
                    isWild4: wild === 'wild4'
                });
            }
        });
    }

    /**
     * Get display text for action cards
     */
    getActionDisplay(action) {
        const displays = {
            'skip': 'SKIP',
            'reverse': 'REVERSE',
            'draw2': '+2'
        };
        return displays[action] || action;
    }

    /**
     * Get symbol for action cards
     */
    getActionSymbol(action) {
        const symbols = {
            'skip': '⏭',
            'reverse': '↻',
            'draw2': '+2'
        };
        return symbols[action] || action;
    }

    /**
     * Shuffle the deck using Fisher-Yates algorithm
     * This ensures a truly random distribution
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    /**
     * Draw a single card from the top of the deck
     * @returns {Object|null} The drawn card or null if deck is empty
     */
    drawCard() {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards.pop();
    }

    /**
     * Draw multiple cards
     * @param {number} count - Number of cards to draw
     * @returns {Array} Array of drawn cards
     */
    drawCards(count) {
        const drawnCards = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            const card = this.drawCard();
            if (card) drawnCards.push(card);
        }
        return drawnCards;
    }

    /**
     * Get the number of cards remaining in the deck
     * @returns {number} Number of cards left
     */
    getRemainingCards() {
        return this.cards.length;
    }

    /**
     * Check if deck is empty
     * @returns {boolean} True if deck is empty
     */
    isEmpty() {
        return this.cards.length === 0;
    }

    /**
     * Reset the deck for a new game
     * Reinitializes and shuffles the deck
     */
    reset() {
        this.cards = [];
        this.initializeDeck();
        this.shuffle();
    }

    /**
     * Add cards back to the deck (for reshuffling)
     * @param {Array} cards - Cards to add back
     */
    addCards(cards) {
        this.cards.push(...cards);
    }

    /**
     * Get a copy of the current deck state
     * @returns {Array} Copy of the cards array
     */
    getDeckState() {
        return [...this.cards];
    }

    /**
     * Validate that the deck has the correct number of cards
     * @returns {boolean} True if deck is valid
     */
    validateDeck() {
        const expectedCount = 108; // Standard UNO deck
        if (this.cards.length !== expectedCount) {
            console.warn(`Deck validation failed: Expected ${expectedCount} cards, got ${this.cards.length}`);
            return false;
        }

        // Count cards by type and color
        const counts = {};
        this.cards.forEach(card => {
            const key = `${card.type}-${card.color}-${card.value}`;
            counts[key] = (counts[key] || 0) + 1;
        });

        // Validate counts (simplified validation)
        const numberCards = this.cards.filter(card => card.type === 'number').length;
        const actionCards = this.cards.filter(card => card.type === 'action').length;
        const wildCards = this.cards.filter(card => card.type === 'wild').length;

        const isValid = numberCards === 76 && actionCards === 24 && wildCards === 8;
        
        if (!isValid) {
            console.warn('Deck validation failed: Incorrect card distribution');
            return false;
        }

        return true;
    }
}

// Export for use in other modules
window.Deck = Deck; 