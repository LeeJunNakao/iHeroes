const URL = 'https://zrp-challenge-socket.herokuapp.com:443'
const io = require('socket.io-client')(URL)
const Hero = require('../config/database/model/heroService')
const Occurrence = require('../config/database/model/ocurrenceService')
const HeroLog = require('../config/database/model/heroLogService')

class HeroManager{
    constructor(){
        this.connectToAPI();
        this.setOccurrenceListener();
    }

    connectToAPI(){
        io.on('connect', ()=>console.log('connected'));
    }

    setOccurrenceListener(){
        io.on('occurrence', occurrence=>{
            this.occurrenceHandler(occurrence)
        })
    }

    registerOccurence(occurrence){
        return Occurrence.create({
            location: { 
                lat: occurrence.location[0].lat,
                lng: occurrence.location[0].lng
            },
            dangerLevel: occurrence.dangerLevel,
            monsterName: occurrence.monsterName,
            date: new Date(Date.now())         
        })
    }

    markHeroOut(hero){
        Hero.updateOne({ _id: hero._id}, { avaible: false}, (err,res)=> {
             if(err) console.error(err) 
            })
    }

    markHeroAvaible(hero){
        Hero.updateOne({ _id: hero._id}, { avaible: true}, (err,res)=> {
            if(err) console.error(err) 
           })
    }

    markHeroLog(occurrence,hero,state){
        HeroLog.create({
            hero: {
                id: hero.id,
                name: hero.name
            },
            avaible: state,
            date: new Date(Date.now()),
            occurrence: occurrence._id
        })
    }

    startCountdowForHeroBack(occurrence,hero){
        setTimeout(()=>{
            this.markHeroLog(occurrence,hero,true)
            this.markHeroAvaible(hero);
        }, 90000)
    }

    async occurrenceHandler(occurrence){
        let hero = await this.chooseHero(occurrence.dangerLevel)
        let occurrenceRegistered = await this.registerOccurence(occurrence,hero)
        this.markHeroLog(occurrenceRegistered, hero,false)
        this.markHeroOut(hero)
        this.startCountdowForHeroBack(occurrenceRegistered,hero)
    }

    async findAvaibleHero(heroClass){
        let heroes;
        await Hero.find({ avaible: true, class: heroClass }, (err,resp)=>{
           heroes = resp
           if(err) console.err(err)
        });
        return heroes;
    }

    async chooseHero(dangerLevel){
        let heroes;
        switch(dangerLevel){
            case 'God':
                heroes = await this.findAvaibleHero('S')
                return heroes[0];
            case 'Dragon':
                heroes = await this.findAvaibleHero('A')
                return heroes[0];
            case 'Tiger':
                heroes = await this.findAvaibleHero('B')
                return heroes[0];
            case 'Wolf':
                heroes = await this.findAvaibleHero('C')
                return heroes[0];
        }
    }

    
}

module.exports = HeroManager;