import User from './user.js';
import Team from './team.js';


const Fixture = {
    type: 'fixture',
    // inputWrapperAttributes: {
    //     class: 'fixture-input-wrapper'
    // },
    // inputWrapperParent: document.querySelector('.fixtures .input-wrapper'),
    // inputAttributes: {
    //     type: 'text',
    //     value: '',
    //     placeholder: 'Choose fixture name...',
    //     class: 'fixture-input',
    //     'data-id': null
    // },
    // buttonAttributes: {
    //     class: 'fixture-button',
    //     'data-action': 'update-fixture-name',
    //     'data-id': null
    // }

}

Fixture.getFixture = function(fixtureId) {
    return DbAdapter.getData(this.type, fixtureId)
}

Fixture.addFixture = function(id) {
    // TODO:
        // fixtures: [
        //     fixture: {
        //         id: 99
        //         home: pairX.id
        //         score: {
        //             pairX: 2,
        //             pairY: 1
        //         }
        //     },
        //     fixture: {
        //         ...
        // ]
        let _table = this.type
        let newFixture = {
            id: null, //99,
            home: null, // pairX.id, NOTES: Behövs eller ej?
            score: {} // { pairX.id: 2, pairY.id: 1
        }

        newFixture.id = id
        // newTeam.name = 'Team '+id
        // newTeam.order = id

        DbAdapter.setData(_table, newFixture)

        return newFixture
}

Fixture.generateFixtures = function() {

}

Fixture.listFixtures = function() {

}

export default Fixture
