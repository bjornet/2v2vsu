import DbAdapter from './dbadapter.js'
import Render from './render.js'
import Utils from './utils.js'

const Team = {
    type: 'team',
    inputWrapperAttributes: {
        class: 'team-input-wrapper'
    },
    inputWrapperParent: document.querySelector('.teams .input-wrapper'),
    inputAttributes: {
        type: 'text',
        value: '',
        placeholder: 'Choose team name...',
        class: 'team-input',
        'data-id': null
    },
    buttonAttributes: {
        class: 'team-button',
        'data-action': 'update-team-name',
        'data-id': null
    }
}

Team.getTeam = function (teamId) {
    return DbAdapter.getData(this.type, teamId)
}

Team.addTeam = function (id) {
    let _table = this.type
    let newTeam = {
        id: null,
        name: '',
        members: [],
        order: null
    }

    newTeam.id = id
    newTeam.name = 'Team '+id
    newTeam.order = id

    DbAdapter.setData(_table, newTeam)

    return newTeam
}

Team.addTeamMember = function (member, id) {
    let _table = this.type
    let members = DbAdapter.getData(_table, id).members

    members.push(member.id)
    DbAdapter.updateData(_table, id, {members: members})
}

Team.editTeam = function (name, id) {
    let _table = this.type

    if (name) {
        DbAdapter.updateData(_table, id, {name: name})
    } else {
        console.warn('Team still needs a nickname!')
    }
}

Team.generateTeams = function (User) {
    if (User) {
        let amountOfUsers = User.getUser().length

        // Existing Users
        if (amountOfUsers > 0) {
            let teamSize = 2
            let teamsToGenerate = Utils.binomial(amountOfUsers,teamSize)

            // RESET TEAMS
            DbAdapter.reset('team')

            // GENERATE ALL TEAMS (according to binomial coefficient)
            for (let i = 1; i <= teamsToGenerate; i++) {
                this.addTeam(i)
            }

            // ASSIGN MEMBERS TO TEAMS
            User.getUser().forEach((user, index) => {

                let membersInTeamSet = User
                    .getUser()
                    .filter((_user, _index) => {
                        return _index <= index
                    })

                if (membersInTeamSet.length >= teamSize) {
                    let primaryMember = membersInTeamSet[index]

                    let teamsToAssign = this.getTeam().filter((team, i) => {
                        return team.members.length === 0
                    })

                    for (let i = 1; i <= membersInTeamSet.length - 1; i++) {
                        let secondaryMember = membersInTeamSet[i - 1]
                        let teamId = teamsToAssign[i - 1].id

                        this.addTeamMember(primaryMember, teamId)
                        this.addTeamMember(secondaryMember, teamId)
                    }

                }
            })
            return true
        }
    }
    return false
}

Team.listTeams = function (User) {
    if (this.getTeam().length > 0) {

        this.getTeam().forEach(team => {
            // Add new user input
            let inputWrapper = Render.element('span',
                                        Team.inputWrapperAttributes,
                                        Team.inputWrapperParent)
            let input = Render.element('input', this.inputAttributes, inputWrapper)
            Render.updateElement(input, {'placeholder': team.name, 'data-id': team.id})

            team.members.forEach(memberId => {
                Render.element('span', {'class': 'member-label' + ' ' + 'member-' + memberId}, inputWrapper, User.getUser(memberId).name)
            })

            let button = Render.element('button', this.buttonAttributes, inputWrapper, 'Edit Team')
            Render.updateElement(button, {'data-id': team.id})
        })
    }
}

Team.shuffle = function () {
    // TODO: update all this.getTeam() sorting
    // TODO: [in Team.listTeams()] we need to render in correct team.sort order
    // TODO: also add a sort order input (saves just like name)
    console.log('TODO: update all this.getTeam() sorting');
}

export default Team
