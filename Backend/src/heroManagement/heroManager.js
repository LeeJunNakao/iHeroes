const URL = 'https://zrp-challenge-socket.herokuapp.com:443'
const io = require('socket.io-client')(URL)

const { setAllHeroesAvaible, connectToAPI, setOccurrenceListener, returnRegisteredOccurrence, chooseHeroes, verifyIfOccurrenceIsRegistered, removeFromQueue, addToQueue, markHeroesOut, registerHeroesLog, changeOccurrenceState, markHeroesAvaible, ifOccurrenceIsNotPending, ifOccurrenceIsNotOnQueue } = require('./Utils')

class HeroManager {
    constructor() {
        this.occurrenceHandler = this.occurrenceHandler.bind(this)
        this.queue = [];
        this.initRotines()
    }

    initRotines() {
        setAllHeroesAvaible()
        connectToAPI(io)
        setOccurrenceListener(io, this.occurrenceHandler)
        this.resendOccurrencesToHandler();
    }

    async occurrenceHandler(occurrence) {
        let occurrenceRegistered = await returnRegisteredOccurrence(occurrence, this.queue)
        if (ifOccurrenceIsNotPending(occurrenceRegistered)) {
            return
        } else {
            changeOccurrenceState(occurrenceRegistered, 'attending')
            let heroes = await chooseHeroes(occurrenceRegistered.dangerLevel)
            if (heroes.length < 1) {
                if (ifOccurrenceIsNotOnQueue(this.queue, occurrenceRegistered)) addToQueue(this.queue, occurrenceRegistered)
                changeOccurrenceState(occurrenceRegistered, 'pending')
            } else {
                if (verifyIfOccurrenceIsRegistered(this.queue, occurrenceRegistered) && heroes.length > 0) removeFromQueue(this.queue, occurrenceRegistered)
                registerHeroesLog(occurrenceRegistered, heroes, false)
                markHeroesOut(heroes)
                this.startCountdowForHeroBack(occurrenceRegistered, heroes)
            }
        }

    }

    resendOccurrencesToHandler() {
        setInterval(() => {
            if (this.queue.length > 0) {
                this.occurrenceHandler(this.queue[0])
            }
        }, 120000);
    }

    startCountdowForHeroBack(occurrence, heroes) {
        setTimeout(() => {
            registerHeroesLog(occurrence, heroes, true)
            markHeroesAvaible(heroes);
            changeOccurrenceState(occurrence, 'done')
        }, 120000)
    }
}

module.exports = HeroManager;