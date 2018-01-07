import DbAdapter from './dbadapter.js';
import User from './user.js';
import Team from './team.js';
import Render from './render.js';

const Fixture = {
    type: 'fixture',
    inputWrapperAttributes: {
        class: 'fixture-input-wrapper'
    },
    inputWrapperParent: '.fixtures .input-wrapper',
    labelAttributes: {
        class: 'fixture-label',
        for: ''
    },
    inputAttributes: {
        type: 'text',
        id: '',
        value: '',
        placeholder: 0,
        class: 'fixture-input',
        'data-id': null
    },
    buttonAttributes: {
        class: 'fixture-button',
        'data-action': 'update-fixture-score',
        'data-id': null
    }

}

Fixture.getFixture = function(id) {
    let _table = this.type

    return DbAdapter.getData(_table, id)
}

Fixture.addFixture = function(id, homeId, awayId) {
    let _table = this.type
    let newFixture = {
        id: null,
        teams: {
            home: {
                id: null,
                goals: null
            },
            away: {
                id: null,
                goals: null
            }
        },
    }

    newFixture.id = id
    newFixture.teams.home.id = homeId
    newFixture.teams.away.id = awayId

    return DbAdapter.setData(_table, newFixture)
}

Fixture.updateFixture = function (id, homeScore, awayScore) {

    if (!id) {
        console.warn('submit require: fixture id')
        return false
    }

    id = Number.parseInt(id)
    homeScore = Number.parseInt(homeScore) || 0
    awayScore = Number.parseInt(awayScore) || 0

    let _table = this.type
    let fixture = Fixture.getFixture(id)

    fixture.teams.home.goals = homeScore
    fixture.teams.away.goals = awayScore

    DbAdapter.updateData(_table, id, fixture)

    return fixture
}

Fixture.generateFixtures = function(Team) {
    // Reset fixtures
    DbAdapter.reset('fixture')

    // Generate fixture sets: every team (homeTeam) plays n fixtures (vs n awayTeams)
    let fixtureSets = Team.getTeam().map((homeTeam, iPrimary) => {
        // NOTE collect all teams that can be matched with primaryTeam (uniqe members)
        let awayTeams = Team.getTeam().filter(awayTeam => {
            let teamsMatched = 0
            homeTeam.members.forEach((member) => {
                if (awayTeam.members.includes(member)) {
                    teamsMatched++
                }
            })
            // console.log(teamsMatched);
            return teamsMatched === 0
        })

        let fixtureSet = {
            homeTeam: homeTeam,
            awayTeams: awayTeams
        }

        // TODO: can we evade populating array through return if false?
        return awayTeams.length > 0 ? fixtureSet : null
    })

    // Add fixtures to DB
    let addSuccess = true
    fixtureSets.forEach(fixtureSet => {

        fixtureSet.awayTeams.forEach(awayTeam => {
            let _f = this.getFixture()
            let id = _f.length > 0 ? _f[_f.length - 1].id + 1 : 1
            if (!this.addFixture(id, fixtureSet.homeTeam.id, awayTeam.id)) {
                addSuccess = false
            }
        })

    })

    // TODO: write as try catch on addFixture()?
    return addSuccess ? true : false
}

Fixture.render = function(Team) {

    // Fixture wrapper
    let fixtures = Render.element('div', { class: 'fixtures page-wrapper' }, document.body)
                    Render.element('h2', {}, fixtures, 'Fixtures')
                    Render.element('div', { class: 'input-wrapper' }, fixtures)

    // Scoreboard (individual and teams)
    let scoreboard = Render.element('div', { class: 'score page-wrapper'}, document.body)
                    Render.element('h2', {}, scoreboard, 'Scoreboard')
    let scoreIndividual = Render.element('div', { class: 'individual' }, scoreboard)
                    Render.element('h3', {}, scoreIndividual)
    let scoreTeam = Render.element('div', { class: 'individual' }, scoreboard)
                Render.element('h3', {}, scoreTeam)

    if (this.getFixture().length > 0) {

        this.getFixture().forEach(fixture => {
            let nameHome = Team.getTeam(fixture.teams.home.id).name.toLowerCase().replace(/\s/g, '')
            let nameAway = Team.getTeam(fixture.teams.away.id).name.toLowerCase().replace(/\s/g, '')
            let scoreHome = fixture.teams.home.goals ? fixture.teams.home.goals : 0
            let scoreAway = fixture.teams.away.goals ? fixture.teams.away.goals : 0

            let inputWrapper = Render.element('span',
                                        this.inputWrapperAttributes,
                                        document.querySelector(this.inputWrapperParent))

            let labelHome = Render.element('label', this.labelAttributes, inputWrapper, nameHome)
            Render.updateElement(labelHome, { 'for': nameHome })

            let inputHome = Render.element('input', this.inputAttributes, inputWrapper)
            Render.updateElement(inputHome, { 'id': nameHome, 'data-type': 'home', 'data-id': fixture.teams.home.id, placeholder: scoreHome })

            Render.element('span', { class: 'vs-devider' }, inputWrapper, ' VS ')

            let labelAway = Render.element('label', this.labelAttributes, inputWrapper, nameAway)
            Render.updateElement(labelAway, { 'for': nameAway })

            let inputAway = Render.element('input', this.inputAttributes, inputWrapper)
            Render.updateElement(inputAway, { 'id': nameAway, 'data-type': 'away', 'data-id': fixture.teams.away.id, placeholder: scoreAway })

            let button = Render.element('button', this.buttonAttributes, inputWrapper, 'Submit Score')
            Render.updateElement(button, { 'data-id': fixture.id })
        })
    }

}

Fixture.updateScoreboard = function() {
    console.log('updateScoreboard');

    // IDEA: Let User store user´s score and Team store team´s score.
    // Then let User and Team be in charge of rendering those.
    // Why? That seems better to not have to aggregate score (from Fixture) each time scoreboard is loaded.
    // TODO: Rewrite/update ** updateFixture ** to populate teams resp. users with their score (User/Team will hold wins/draws/loss not goals).
    // TODO: Write methods on User/Team to generate the scoreboard:s, example; Björns individual score is his N wins * win-score-factor (3 in fotball)
    //                                                                          => Björnsindividual score.
    // TODO: Sack this method!


    let inputWrapper = Render.element('div',
                                { class: 'user-score' },
                                document.querySelector('.individual'))

    Render.element('span', { class: 'name', 'data-name': 'name' }, inputWrapper, 'name')
    Render.element('span', { class: 'score', 'data-name': 'score' }, inputWrapper, 'score')
}

export default Fixture
