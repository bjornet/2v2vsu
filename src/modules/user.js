import _ from 'lodash'
import $ from 'jQuery'
import DbAdapter from './dbadapter.js'
import Render from './render.js'
import Team from './team.js'

const User = {
    type: 'user',
    inputWrapperAttributes: {
        class: 'user-input-wrapper',
        'data-type': 'add'
    },
    inputWrapperParent: '.users .input-wrapper',
    inputAttributes: {
        type: 'text',
        value: '',
        placeholder: 'Add new user...',
        class: 'user-input',
        'data-id': null
    },
    buttonAttributes: {
        class: 'user-button',
        'data-action': 'add-new-user',
        'data-id': null
    }
}

User.getUser = function (userId) {
    return DbAdapter.getData(this.type, userId)
}

User.addUser = function (name, trigger) {
    let _table = this.type
    let newUser = {
        id: null,
        name: undefined
        // teams: [],
        // matchesPlayed: [],
        // totalScore: null
    }

    if (name) {
        /*
            TODO: regain this granular control of messaging :point_below:
            * console.log('Username `' + name + '` does already exist, please try another');
            * _db.setItem('lastSetItem', id)
                id = _db.getItem('lastSetItem') ? window.parseInt(_db.getItem('lastSetItem')) + 1 : 1
        */

        let users = this.getUser()
        newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1  // TODO change to increment
        newUser.name = name

        if ( DbAdapter.setData(_table, newUser) ) {
            // Update current input from add > edit

            // input
            let container = '.'+this.inputWrapperAttributes.class
            let input = $(trigger).parents(container).find('input')[0]
            let inputAttributes = _.clone(User.inputAttributes)
            inputAttributes['value'] = newUser.name
            inputAttributes['data-id'] = newUser.id
            inputAttributes['placeholder'] = 'Edit user...'
            Render.updateElement(input, inputAttributes)

            // button
            let buttonAttributes = _.clone(User.buttonAttributes)
            buttonAttributes['data-id'] = newUser.id
            buttonAttributes['data-action'] = 'edit-user'
            Render.updateElement(trigger, buttonAttributes, 'Edit user')

            Render.updateElement($(trigger).parents(container)[0], { 'data-type': 'edit' })


            // Add new user input
            let inputWrapper = Render.element('span',
                                        User.inputWrapperAttributes,
                                        document.querySelector(User.inputWrapperParent))
            Render.element('input', this.inputAttributes, inputWrapper)
            Render.element('button', this.buttonAttributes, inputWrapper, 'Add User')
        }

    } else {
        console.warn('User needs a nickname!');
    }

    return newUser
}

User.editUser = function (name, id) {
    let _table = this.type

    if (name) {
        DbAdapter.updateData(_table, id, { name: name })
    } else {
        console.warn('User still needs a nickname!')
    }
}

User.render = function () {
    // Wrapper
    // TODO:
    //     1. Read DB and generate 1 <input> per user entry (see user.js)
    //     2. Toggle enable disable proceed btn when DB has 3 users
    let users = Render.element('div', { class: 'users page-wrapper', 'data-area': 'assign-users' }, document.body)
                Render.element('h2', {}, users, 'Users')
                Render.element('div', { class: 'input-wrapper' }, users)
    let usersWarning = Render.element('p', {}, users)
                        Render.element('em', {}, usersWarning, 'Warning: click here will regenerate teams and fixtures without further warning!')
                        Render.element('button', { type: 'button', name: 'goto-team', 'data-action': 'goto-assign-teams', disabled: 'disabled' }, usersWarning, 'GENERATE TEAMS and FIXTURES (minimum 4 users)')

    // New Users Input
    let inputWrapper = Render.element('span',
                                User.inputWrapperAttributes,
                                document.querySelector(User.inputWrapperParent))
    // Render.updateElement(inputWrapper, { 'data-type': 'add-new' })
    Render.element('input', User.inputAttributes, inputWrapper)
    Render.element('button', User.buttonAttributes, inputWrapper, 'Add User')

    // Existing Users Input(s)
    if (User.getUser().length > 0) {
        User.getUser().forEach(user => {
            // input
            let inputAttributes = _.clone(User.inputAttributes)
            inputAttributes['value'] = user.name
            inputAttributes['data-id'] = user.id
            inputAttributes['placeholder'] = 'Edit user...'

            // button
            let buttonAttributes = _.clone(User.buttonAttributes)
            buttonAttributes['data-id'] = user.id
            buttonAttributes['data-action'] = 'edit-user'

            let inputWrapper = Render.element('span',
                                        User.inputWrapperAttributes,
                                        document.querySelector(User.inputWrapperParent))
            Render.updateElement(inputWrapper, { 'data-type': 'edit' })
            Render.element('input', inputAttributes, inputWrapper)
            Render.element('button', buttonAttributes, inputWrapper, 'Edit User')
        })
    }

}

export default User
