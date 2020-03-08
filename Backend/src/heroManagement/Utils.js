const Hero = require('../config/database/model/heroService')
const Occurrence = require('../config/database/model/ocurrenceService')
const HeroLog = require('../config/database/model/heroLogService')


function setAllHeroesAvaible(){
    Hero.find({},(err, hero)=>{
        hero.forEach((each)=>{
            each.avaible = true;
            each.save()
        })
    })
}

function connectToAPI(io){
    io.on('connect', ()=>console.log('connected'));
}
function setOccurrenceListener(io,occurrenceHandler){
    io.on('occurrence', occurrence=>{
        occurrenceHandler(occurrence)
    })
}

async function returnRegisteredOccurrence(occurrence,queue){
    if(verifyIfOccurrenceIsRegistered(queue,occurrence)){
        return occurrence;
    }else{
        return await registerOccurence(occurrence)
    }
}

 async function chooseHeroes(dangerLevel){
    let heroes=[];
    const dangerPointsRelation = { God: 8, Dragon: 4, Tiger: 2, Wolf: 1 }
    let dangerPoints = dangerPointsRelation[dangerLevel]

    try{
        let avaibleHeroes = await findAvaibleHeroes()
        heroes = await returnTeam(avaibleHeroes,dangerPoints);
    }catch(e){
        console.error(e)
    }
    return heroes;
}

async function returnTeam(avaibleHeroes, dangerPoints){
    let team=[];
    let points = dangerPoints
    
    let preferentialHero = await findPreferentialHero(avaibleHeroes,dangerPoints)

    if(preferentialHero.length>0){
        return preferentialHero
    }else{
        ({team, points} = await combineHeroes(avaibleHeroes,dangerPoints,points))
        if(points>0){
            return []
        }else{
            return team
        }
    }
}

function combineHeroes(avaibleHeroes, dangerPoints,points){
    const classPoints = { S: 8, A: 4, B: 2, C: 1 }
    let team=[];
    for(let i=0; i<=avaibleHeroes.length-1; i++){
        let hero = avaibleHeroes[i]
        if(classPoints[hero.class] > dangerPoints ){
            team = [hero]
            points -= classPoints[hero.class]
            break
        }else{
            team.push(hero)
            points -= classPoints[hero.class]
            if(points<=0) break
        }
    }
    return {team, points};
}

function findPreferentialHero(avaibleHeroes,dangerPoints){
    const preferenceOrderRelation = { 8: 'S', 4: 'A', 2: 'B', 1:'C' }
    let preferentialClass = preferenceOrderRelation[dangerPoints]
    let preferentialHero=[];
    let hero;
    for(let i=0; i<=avaibleHeroes.length-1; i++){
        hero = avaibleHeroes[i]
        if(hero.class == preferentialClass){
            preferentialHero = [hero]
            break
        }
    }
    return preferentialHero
}   


async function findAvaibleHeroes(){
    let hero=[];
    await Hero.find({ avaible: true }, (err,resp)=>{
        hero = resp;
        if(err) {
            console.log('Erro em findAvaibleHeroes', err)
        }
    })
    return hero;
}

function verifyIfOccurrenceIsRegistered(queue,occurrence){
    if(queue.includes(occurrence)) return true
}

function registerOccurence(occurrence){
    return Occurrence.create({
        location: { 
            lat: occurrence.location[0].lat,
            lng: occurrence.location[0].lng
        },
        dangerLevel: occurrence.dangerLevel,
        monsterName: occurrence.monsterName,
        date: new Date(Date.now()),
        state: 'pending'         
    })
}


function removeFromQueue(queue, occurrence){
    if(queue.includes(occurrence)){
        let index = queue.indexOf(occurrence)
        queue.splice(index,1)
    }
}
function addToQueue(queue, occurrence){
    queue.push(occurrence)
}

function markHeroesOut(heroes){
    heroes.forEach(hero=>{
        hero.avaible = false;
        hero.save()
    })
}

function registerHeroesLog(occurrence,heroes,state){
    heroes.forEach(hero=>{
        HeroLog.create({
            hero: {
                id: hero.id,
                name: hero.name
            },
            avaible: state,
            date: new Date(Date.now()),
            occurrence: occurrence._id
        },(err)=> {if(err) console.log('erro no registro de herolog! ', err)})
    })
}

function changeOccurrenceState(occurrence,state){
    occurrence.state = state;
    occurrence.save()
}

function markHeroesAvaible(heroes){
    heroes.forEach(hero=>{
        hero.avaible = true;
        hero.save()
    })
}

let functions = {setAllHeroesAvaible, connectToAPI, setOccurrenceListener, returnRegisteredOccurrence, chooseHeroes, verifyIfOccurrenceIsRegistered, removeFromQueue, addToQueue, markHeroesOut, registerHeroesLog, changeOccurrenceState, markHeroesAvaible }

module.exports = functions