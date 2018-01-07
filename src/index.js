import './styles.css';
import $ from 'jQuery'
import User from './modules/user.js'
import Team from './modules/team.js'
import DbAdapter from './modules/dbadapter.js'
import Render from './modules/render.js'
import Fixture from './modules/fixture.js';

// RENDER
// ^^^^^^ Header, Menu, Users, Teams, Fixtures, Scoreboard
let header = Render.element('header', {}, document.body)
            Render.element('h1', {}, header, '2v2 vs U')
let reset = Render.element('span', { class: 'reset-app' }, header)
            Render.element('button', { type: 'button', name: 'reset-app' }, reset, 'Reset App')
let menu = Render.element('ul', { class: 'menu page-wrapper' }, document.body)
            Render.element('h2', {}, menu, 'Menu')
            Render.element('li', { class: 'menu-item' }, menu, 'Users')
            Render.element('li', { class: 'menu-item' }, menu, 'Teams')
            Render.element('li', { class: 'menu-item' }, menu, 'Score')
User.render()
Team.render(User)
Fixture.render(Team)
Fixture.updateScoreboard()

const gotoAssignTeamsBtn = '.users button[data-action="goto-assign-teams"]'
const shuffleBtn = '.teams button[data-action="shuffle-teams"]'

// TODO: refactor to User as "requirements meet, go ahead!" ... or into Team... ... or into Utils since it is a bit all over the place...
// TODO: create actual toggle.. now only from disabled => enabled
let activateBtn = function (btn) {
    if (User.getUser().length >= 4) {
        document.querySelector(btn).disabled = false
    }
}

activateBtn(gotoAssignTeamsBtn)
activateBtn(shuffleBtn)

// EVENTS
$(document).on('click', '.user-button', function(e) {
    let container = '.'+User.inputWrapperAttributes.class
    let id = e.target.dataset.id
    let $input = $(this).parents(container).find('input[data-id="'+id+'"]')
    let name = $input.val()

    e.target.dataset.action === 'edit-user' ? User.editUser(name, id) : User.addUser(name, this)

    activateBtn(gotoAssignTeamsBtn)
})

$(document).on('click', '.team-button', function(e) {
    let container = '.'+Team.inputWrapperAttributes.class
    let id = e.target.dataset.id
    let $input = $(this).parents(container).find('input[data-id="'+id+'"]')
    let name = $input.val()
    // e.target.dataset.action === 'edit-user' ? User.editUser(name, id) : User.addUser(name, this)

    console.log(id, $input, name);
    Team.editTeam(name, id)
})


$(document).on('click', gotoAssignTeamsBtn, e => {
    if (Team.generateTeams(User)) { // TODO: Dependency injection instead?
        Render.reset('team')
        Team.render(User) // TODO: Dependency injection instead?
        Fixture.render(Team) // TODO: Dependency injection instead?

        activateBtn(shuffleBtn)
    }
})

// TODO: rewrite; if we can instead make a simple/manual drag n drop function
$(document).on('click', shuffleBtn, e => {
    Team.shuffle()
})

$(document).on('click', '.fixture-button', e => {
    let btn = e.currentTarget
    let container = '.'+Fixture.inputWrapperAttributes.class
    let $container = $(btn).parents(container)

    let id = btn.dataset.id
    let homeScore = $container.find('input[data-type="home"]')[0].value
    let awayScore = $container.find('input[data-type="away"]')[0].value

    Fixture.updateFixture(id, homeScore, awayScore)
})

$('.reset-app button').on('click', e => {
    DbAdapter.reset()
    Render.reset()
})
