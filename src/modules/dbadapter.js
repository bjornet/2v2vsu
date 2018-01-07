import Utils from './utils.js'

const DbAdapter = {
    db: window.localStorage,
    structure: {
        user: [],
        team: [],
        fixture: []
    }
}

DbAdapter.getData = function (table, entityId) {
    let _db = this.db
    // console.log('getData [table, entityId]', table, entityId);

    if (table) {
        if (entityId) {
            let entity = JSON.parse(_db.getItem(table)).find((entity) => {
                return entity.id === entityId
            })

            return entity ? entity : 'Sorry, no user on that id'
        }
        return JSON.parse(_db.getItem(table))
    }
    return false
}

DbAdapter.setData = function (table, newData) {
    // console.log('setData [table, data]', table, data)
    let _db = this.db
    let tableData = this.getData(table)

    let _isDuplicateId = entity => entity.id === newData.id
    let _isDuplicateName = entity => newData.name !== undefined ? (entity.name === newData.name) : false


    if (tableData.find(_isDuplicateId) || tableData.find(_isDuplicateName)) {
        if (table == 'fixture') {
            console.log(JSON.parse(localStorage.fixture));
            console.log('Duplicated [id]', tableData.find(_isDuplicateId));
            // console.log('duplicNAME', tableData.find(_isDuplicateName));
        }

        console.warn('I halted insert due to :: testDuplicateId || testDuplicateName');
        Utils.alert('background')

        return false
    }

    tableData.push(newData)
    _db.setItem(table, JSON.stringify(tableData))

    return true
}

DbAdapter.updateData = function (table, entityId, dataToUpdate) {
    let _db = this.db
    let tableData = this.getData(table)

    // TODO: DRY! See this.setData()... this is close to a copy from above!
    let _isDuplicateName = entity => {
        return entity.hasOwnProperty(name) && entity.name === dataToUpdate.name
    }

    if (tableData.find(_isDuplicateName)) {
        console.warn('I halted insert due to :: testDuplicateId || testDuplicateName');
        Utils.alert('background')

        return false
    }

    let entity = tableData.filter(entity => {
        // TODO: user int.. right now entityId is string... WAT?
    	return entity.id == entityId
    })

    for (var variable in dataToUpdate) {
        if (dataToUpdate.hasOwnProperty(variable)) {
            entity[0][variable] = dataToUpdate[variable]
        }
    }

    _db.setItem(table, JSON.stringify(tableData))
}

DbAdapter.initDb = function (forceReset) {
    forceReset = forceReset || false
    let _db = this.db
    let _struct = this.structure
    let status = 'DB already set or failed to set'

    if (_db.length < 2 || forceReset) {
        _db.clear()
        _db.setItem('user', JSON.stringify(_struct.user))
        _db.setItem('team', JSON.stringify(_struct.team))
        _db.setItem('fixture', JSON.stringify(_struct.fixture))
        status = 'DB has been initialised'
        console.log(status);
    }

    return status
}

DbAdapter.reset = function (type) {
    let _db = this.db
    let _struct = this.structure

    if (type) {
        _db.setItem(type, JSON.stringify(_struct[type]))
    } else {
        this.initDb(true)
    }

}


// NOTE: This only runs if db stuct is broken somehow.. or needs to reset
DbAdapter.initDb()

// let table = 'user'
// let data = {
//     name: 'Bobba Fet',
//     id: 2,
//     teams: [10, 2]
// }
// DbAdapter.setData(table, data)
//
// console.log(DbAdapter.getData(table));

export default DbAdapter
