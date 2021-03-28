/**
 * Development script to insert cards from cards.json
 */
import Database from './database';
import * as cardsJson from './cards.json';

async function insertCards() {
    const database = new Database();
    const cards = cardsJson["default"];
    for (let i = 0; i < cards.length; i += 1) {
        await database.insertCards(cards[i].type, cards[i].content);
    }
}

insertCards().then(() => {
    console.log("Unique cards from cards.json inserted!");
    process.exit();
});
