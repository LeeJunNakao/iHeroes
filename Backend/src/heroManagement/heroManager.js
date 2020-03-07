const URL = 'https://zrp-challenge-socket.herokuapp.com:443'
const io = require('socket.io-client')(URL)
const Hero = require('../config/database/model/heroService')
const Occurrence = require('../config/database/model/ocurrenceService')
const HeroLog = require('../config/database/model/heroLogService')
const {setAllHeroesAvaible, connectToAPI, setOccurrenceListener, returnRegisteredOccurrence, chooseHeroes} = require('./Utils') 

class HeroManager{
    constructor(){
        this.occurrenceHandler = this.occurrenceHandler.bind(this)
        this.queue=[];
        this.initRotines()
    }

    initRotines(){
        // setAllHeroesAvaible()
        connectToAPI(io)
        setOccurrenceListener(io,this.occurrenceHandler)
        // this.resendOccurrencesToHandler();
    }

    // setOccurrenceListener(occurrenceHandler){
    //     io.on('occurrence', occurrence=>{
    //         occurrenceHandler(occurrence)
    //     })
    // }

    async occurrenceHandler(occurrence){
        let occurrenceRegistered = await returnRegisteredOccurrence(occurrence,this.queue)
        console.log('occorrencias', occurrenceRegistered)
        let heroes = await chooseHeroes(occurrenceRegistered.dangerLevel)
        console.log('herois selecionados', heroes)
        // if(hero.length>0){
        //     hero=hero[0]
        //     this.removeFromQueue(occurrenceRegistered)
        //     console.log('Heroi escolhido: ', hero)
        //     this.registerHeroLog(occurrenceRegistered, hero,false)
        //     this.markHeroOut(hero)
        //     this.changeOccurrenceState(occurrenceRegistered,'attending')
        //     this.startCountdowForHeroBack(occurrenceRegistered,hero)
        // }else if(!this.queue.includes(occurrence)){
            
        //     console.log('Herois indisponíveis no momento: ', hero)
        //     console.log('Ocorrencia enviado na fila: ', occurrence)
        //     this.queue.push(occurrenceRegistered)
        // }
    }

    removeFromQueue(occurrence){
        if(this.queue.includes(occurrence)){
            let index = this.queue.indexOf(occurrence)
            this.queue.splice(index,1)
        }
    }

    resendOccurrencesToHandler(){
        let index = 0;
        setInterval(() =>{
            if(this.queue[index]){;
                this.occurrenceHandler(this.queue[index])
                index=>this.queue.length-1 ? index=0 : index+=1
            }
        }, 1000);
    }

    // registerOccurence(occurrence){
    //     return Occurrence.create({
    //         location: { 
    //             lat: occurrence.location[0].lat,
    //             lng: occurrence.location[0].lng
    //         },
    //         dangerLevel: occurrence.dangerLevel,
    //         monsterName: occurrence.monsterName,
    //         date: new Date(Date.now()),
    //         state: 'pending'         
    //     })
    // }

    markHeroOut(hero){
        hero.avaible = false;
        hero.save()

    }

    markHeroAvaible(hero){
        hero.avaible = true;
        hero.save()

    }

    registerHeroLog(occurrence,hero,state){
        HeroLog.create({
            hero: {
                id: hero.id,
                name: hero.name
            },
            avaible: state,
            date: new Date(Date.now()),
            occurrence: occurrence._id
        },(err)=> {if(err) console.log('erro no registro de herolog! ', err)})
    }

    startCountdowForHeroBack(occurrence,hero){
        setTimeout(()=>{
            this.registerHeroLog(occurrence,hero,true)
            this.markHeroAvaible(hero);
            this.changeOccurrenceState(occurrence,'done')
        }, 120000)
    }

    changeOccurrenceState(occurrence,state){
        occurrence.state = state;
        occurrence.save()
    }

    // async findAvaibleHero(heroClass){
    //     let heroes=[];
    //     try{
    //         await Hero.find({ avaible: true, class: heroClass }, (err,resp)=>{
    //             heroes = resp
    //             if(err) {console.err(err)}
    //          });
    //     }catch(e){
    //         console.error(e)
    //     }
    //     return heroes;
    // }

    // async chooseHero(dangerLevel){
    //     let heroes=[];
    //     try{
    //         let heroClass = { God: 'S', Dragon: 'A', Tiger: 'B', Wolf: 'C' }
    //         let heroes = await this.findAvaibleHero(heroClass[dangerLevel]);
    //         return heroes;
    //     }catch(e){
    //         console.error(e)
    //     }
    //     return heroes;
        
    // }

    
}

module.exports = HeroManager;