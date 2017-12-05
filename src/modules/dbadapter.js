import Utils from './utils.js'

const DbAdapter = {
    db: window.localStorage,
    structure: {
        user: [],
        team: []
    }
    // ,
    // resetBtn: document.querySelector('.reset-app button')
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

    // [TEST] duplicates
    const testDuplicateId = (entity) => {
        return entity.id === newData.id
    }
    const testDuplicateName = (entity) => {
        return entity.name === newData.name
    }

    if (tableData.find(testDuplicateId) || tableData.find(testDuplicateName)) {
        console.warn('I halted insert due to :: testDuplicateId || testDuplicateName');
        Utils.alert('background')

        return false
    }

    tableData.push(newData)
    _db.setItem(table, JSON.stringify(tableData))

    // console.log(tableData);
    return true
}

DbAdapter.updateData = function (table, entityId, dataToUpdate) {
    // console.log(dataToUpdate);
    // console.log(entityId);

    let _db = this.db
    let tableData = this.getData(table)

    let entity = tableData.filter(entity => {
        // TODO: user int.. right now entityId is string... WAT?
        // console.log(entity);
        // console.log(entityId);
    	return entity.id == entityId
    })

    for (var variable in dataToUpdate) {
        if (dataToUpdate.hasOwnProperty(variable)) {
            // NOTE poorly tested
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
