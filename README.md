# UNO Card Game

A polished, fully functional UNO card game built with vanilla HTML, CSS, and JavaScript. Features a modern UI inspired by the official UNO mobile app with custom design and smooth animations.

## 🎮 Features

### Core Game Features
- **Complete UNO Deck**: All 108 standard UNO cards including:
  - Number cards (0-9) in 4 colors: Red, Green, Blue, Yellow
  - Action cards: Skip, Reverse, Draw Two
  - Wild cards: Wild and Wild Draw Four
- **Two Player Game**: Human vs Bot gameplay with intelligent AI
- **Full Game Logic**: All official UNO rules implemented:
  - Color and number matching
  - Action card effects (Skip, Reverse, Draw Two)
  - Wild card color selection with modal
  - UNO calling when down to one card
  - Automatic deck reshuffling when empty
  - Turn-based gameplay with visual indicators

### UI/UX Features
- **Modern Design**: Beautiful gradient backgrounds and glass-morphism effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Card play, draw, and hover animations
- **Interactive Elements**: Clickable cards, buttons, and color picker
- **Real-time Updates**: Live game state, turn indicators, and card counts
- **Visual Feedback**: Highlighted playable cards and game status
- **Modal Dialogs**: Color picker for wild cards and game over screen

### Technical Features
- **LocalStorage Integration**: Persistent win/loss statistics
- **Modular Architecture**: Clean separation of concerns:
  - `js/deck.js` - Card deck management and shuffling
  - `js/game.js` - Game logic, rules, and bot AI
  - `js/ui.js` - User interface and DOM manipulation
  - `js/main.js` - Application coordination
- **Enhanced Bot AI**: Smart card selection strategy
- **Game History Logging**: Debug-friendly event tracking
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 How to Play

1. **Start the Game**: Open `index.html` in your web browser
2. **Your Turn**: Click on highlighted (gold) cards to play them
3. **Wild Cards**: When playing a wild card, choose a color from the popup modal
4. **Draw Card**: Click "Draw Card" if you can't play any cards
5. **Call UNO**: When you have one card left, click the "UNO!" button
6. **Win**: Be the first to play all your cards!

### Game Rules
- **Matching**: Play cards that match the color, number, or action of the top card
- **Action Cards**:
  - **Skip**: Next player loses their turn
  - **Reverse**: Changes the direction of play
  - **Draw Two**: Next player draws 2 cards and loses their turn
  - **Wild**: Choose any color to continue
  - **Wild Draw Four**: Choose any color, next player draws 4 cards and loses their turn
- **UNO**: Call "UNO!" when you have one card left
- **Winning**: First player to play all their cards wins!

## 📁 Project Structure

```
uno/
├── index.html              # Main HTML file with game layout
├── css/
│   └── style.css          # Modern styling and animations
├── js/
│   ├── deck.js            # Card deck management
│   ├── game.js            # Game logic and bot AI
│   ├── ui.js              # User interface management
│   └── main.js            # Application initialization
├── assets/                # Optional custom assets
└── README.md              # This file
```

## 🛠️ Technical Details

### Architecture
The game follows a modular architecture with clear separation of concerns:

- **Deck Class**: Manages the UNO deck, shuffling, and card distribution
- **Game Class**: Handles game state, turn management, rule enforcement, and bot AI
- **UI Class**: Manages DOM updates, user interactions, and visual feedback
- **Main Class**: Orchestrates the overall application

### Key Features
- **Fisher-Yates Shuffle**: Efficient card shuffling algorithm
- **Event-Driven UI**: Responsive interface with real-time updates
- **Smart Bot AI**: Prefers action cards and uses strategic color selection
- **Color Picker Modal**: Beautiful modal interface for wild card color selection
- **Message System**: Toast notifications for game events
- **LocalStorage**: Persistent statistics tracking

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎨 Design Features

### Styling
The game uses modern CSS features:
- CSS Grid and Flexbox for responsive layout
- CSS animations and transitions with cubic-bezier easing
- Glass-morphism effects with backdrop-filter
- Gradient backgrounds and card styling
- Responsive design with mobile-first approach

### Animations
- **Card Play**: Scale and translate animations
- **Card Draw**: Rotation and fade-in effects
- **Hover Effects**: Smooth elevation changes
- **Glow Effects**: Highlighted playable cards
- **Modal Transitions**: Slide-in animations

## 🎯 Additional Features

### Statistics Tracking
- Win/loss statistics stored in LocalStorage
- Persistent across browser sessions
- Reset functionality for debugging

### Enhanced Bot AI
- Prefers action cards when available
- Strategic color selection for wild cards
- Random but intelligent play patterns

### Debug Features
- Console logging for game events
- Global debugging functions
- Game state inspection tools

## 🐛 Troubleshooting

### Common Issues
1. **Cards not appearing**: Check browser console for JavaScript errors
2. **Game not starting**: Ensure all files are in the correct directory structure
3. **Styling issues**: Verify `css/style.css` is properly linked
4. **Mobile responsiveness**: Test on different screen sizes

### Debug Mode
Open browser console and access:
- `window.unoGame.getGame()` - Access game state
- `window.unoGame.getUI()` - Access UI methods
- `debugGame()` - Log current game state
- `resetStats()` - Reset win/loss statistics

## 🎨 Customization

### Adding Features
The modular architecture makes it easy to extend:
- Add more players by modifying the `players` array in `game.js`
- Implement different bot strategies in the `makeBotMove()` method
- Add sound effects by extending the UI class
- Create new card types by extending the deck initialization

### Styling Customization
- Modify CSS custom properties in `:root` for theme changes
- Adjust animation timings in the CSS file
- Customize card colors and gradients
- Modify responsive breakpoints for different screen sizes

## 📝 Code Quality

### Best Practices
- **Modular JavaScript**: Clean separation of concerns
- **Event Delegation**: Efficient DOM event handling
- **Error Handling**: Graceful fallbacks for LocalStorage
- **Performance**: Optimized animations and rendering
- **Accessibility**: Semantic HTML and keyboard navigation
- **Maintainability**: Well-commented code with clear structure

### File Organization
- **HTML**: Semantic structure with proper ARIA labels
- **CSS**: Organized with logical grouping and comments
- **JavaScript**: ES6+ features with clear class structure
- **Documentation**: Comprehensive README and inline comments

## 🚀 Getting Started

1. **Clone or Download**: Get the project files
2. **Open in Browser**: Navigate to `index.html`
3. **Start Playing**: Click on highlighted cards to play
4. **Enjoy**: Experience the full UNO game with modern UI!

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the game!

---

**Enjoy playing UNO!** 🎉 