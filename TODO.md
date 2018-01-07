# TODO
- save Team.name on edit-btn
    => need to handle placeholder text
- store reference key to User in Team, not the entire User obj.

* generate Fixtures (as a sub routine to Team.generateTeams)

* render Fixtures
* write score to Fixture
* read (and Render) score for: User respectively Team
    => begin with total score

---

# NOTES

## Structure

{
    user {
        id
?       pairId
        name
        matchesPlayed: [1, 3, 5, 7]
        totalScore: 11
    }
    team {
        id
        name: 'Celtic'
        score: 5
        members [userA, userB]
    }
    fixtures: [
        fixture: {
            id: 99
            home: pairX.id
            score: {
                pairX: 2,
                pairY: 1
            }
        },
        fixture: {
            ...
    ],
    score {
        updateScore( match[latest] )
        showUsersScore()
        showTeamsScore()
    }
    ui {
        ...
    }
}

---

## GENERATE TEAMS (SUPER HARD MATH for das Bjorn)

### Overview of how users are paired in teams (and how it grows per added user)

1. action: addUser => [uA] GISELA
    LAG_1: {uA}

=========================================> (users - 1 new teams) pair with {each prev users}

2. action: addUser => [uB] KLARA

[1]     LAG_1: {uB + uA}    updateTeam (triggers if team is not complete)

=========================================> (users - 1 new teams) pair with {each prev users}

3. action: addUser => [uC] BJORN

[5]     LAG_2: {uC + uA}    addTeam
[4]     LAG_3: {uC + uB}    addTeam

=========================================> (users - 1 new teams) pair with {each prev users}

4. action: addUser => [uD] SIGNE

[2]     LAG_4: {uD + uA}    addTeam
[3]     LAG_5: {uD + uB}    addTeam        
[6]     LAG_6: {uD + uC}    addTeam

=========================================> (users - 1 new teams) pair with {each prev users}

5. action: addUser => [uE] LABAN

    LAG_7: {uE + uD}    addTeam
    LAG_8: {uE + uC}    addTeam
    LAG_9: {uE + uB}    addTeam
    LAG_10:{uE + uA}    addTeam

=========================================> (users - 1 new teams) pair with {each prev users}

6. action: addUser => [uF] ZORRO

    LAG_11: {uF + uA}    addTeam
    LAG_12: {uF + uB}    addTeam
    LAG_13: {uF + uC}    addTeam
    LAG_14: {uF + uD}    addTeam
    LAG_15: {uF + uE}    addTeam

=========================================> (users - 1 new teams) pair with {each prev users}

### RÄTTVIS SORTERING enl. Gisela

    LAG_1: {uA + uB} => Djungelvrål
    LAG_2: {uC + uD}  => Center
    LAG_3: {uD + uB}  => Daimlaktris
    LAG_4: {uC + uA} => Juleskum
    LAG_5: {uC + uB}  => Gott o blandat
    LAG_6: {uA + uD} => Marabou mjölkchocklad m laktris


### FIXTURES
// IDEA: LOOP PATTERN:
/*
    a = 2,1
        a => 2,1 FAIL
        b => 3,1 FAIL
        c => 3,2 FAIL
        d => 4,1 FAIL
        e => 4,2 FAIL
        f => 4,3 FIXTURE!

    b = 3,1
        a => 2,1 FAIL
        b => 3,1 FAIL
        c => 3,2 FAIL
        d => 4,1 FAIL
        e => 4,2 FIXTURE!
        f => 4,3 FAIL!

    c = 3,2
        a => 2,1 FAIL
        b => 3,1 FAIL
        c => 3,2 FAIL
        d => 4,1 FIXTURE!
        e => 4,2 FAIL
        f => 4,3 FAIL

    d = 4,1
        a => 2,1 FAIL
        b => 3,1 FAIL
        c => 3,2 FIXTURE!
        d => 4,1 FAIL
        e => 4,2 FAIL
        f => 4,3 FAIL

    e = 4,2
        a => 2,1 FAIL
        b => 3,1 FIXTURE!
        c => 3,2 FAIL
        d => 4,1 FAIL
        e => 4,2 FAIL
        f => 4,3 FAIL

    f = 4,3
        a => 2,1 FIXTURE!
        b => 3,1 FAIL
        c => 3,2 FAIL
        d => 4,1 FAIL
        e => 4,2 FAIL
        f => 4,3 FAIL
*/
