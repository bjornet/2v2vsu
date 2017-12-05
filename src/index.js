import $ from 'jQuery'
import User from './modules/user.js'
import Team from './modules/team.js'
import DbAdapter from './modules/dbadapter.js'
import Render from './modules/render.js'

let gotoAssignTeamsBtn = '.users button[data-action="goto-assign-teams"]'
let shuffleBtn = '.teams button[data-action="shuffle-teams"]'

// TODO: refactor to User as "requirements meet, go ahead!" ... or into Team... ... or into Utils since it is a bit all over the place...
// TODO: create actual toggle.. now only from disabled => enabled
let activateBtn = function (btn) {
    if (User.getUser().length >= 3) {
        document.querySelector(btn).disabled = false
    }
}

activateBtn(gotoAssignTeamsBtn)
activateBtn(shuffleBtn)

// EVENTS
let container = '.'+User.inputWrapperAttributes.class
$(document).on('click', '.user-button', function(e) {
    let id = e.target.dataset.id
    let $input = $(this).parents(container).find('input[data-id="'+id+'"]')
    let name = $input.val()

    e.target.dataset.action === 'edit-user' ? User.editUser(name, id) : User.addUser(name, this)

    activateBtn(gotoAssignTeamsBtn)
})

// let container = '.'+User.inputWrapperAttributes.class
$(document).on('click', '.team-button', function(e) {
    let id = e.target.dataset.id
    console.log(id);
    // let $input = $(this).parents(container).find('input[data-id="'+id+'"]')
    // let name = $input.val()
    //
    // e.target.dataset.action === 'edit-user' ? User.editUser(name, id) : User.addUser(name, this)
})


$(document).on('click', gotoAssignTeamsBtn, e => {
    if (Team.generateTeams(User)) {
        Render.reset('team')
        Team.listTeams()

        activateBtn(shuffleBtn)
    }
})

$(document).on('click', shuffleBtn, e => {
    Team.shuffle()
})

$('.reset-app button').on('click', e => {
    DbAdapter.reset()
    Render.reset()
})
