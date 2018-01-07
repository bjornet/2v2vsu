// import $ from 'jQuery'

const Render = {
    inputs: {
        user: '.user-input-wrapper',
        team: '.team-input-wrapper',
        fixture: '.fixture-input-wrapper',
    }

    // {
    //     users: () => document.querySelectorAll('.user-input-wrapper'),
    //     teams: () => document.querySelectorAll('.team-input-wrapper')
    // }
}

Render.deleteElements = function(type) {
        let selector = this.inputs[type]

        // NOTE: Array.from() casts HTM NODE to Array. Now we can use functional approach
        Array.from(document.querySelectorAll(selector))
            .filter(element => element.dataset.type !== 'add')
            .forEach((element) => {
                element.parentNode.removeChild(element)
            })
    }


Render.reset = function (type) {
    console.warn('render.reset');

    if (type) {
        this.deleteElements(type)
    } else {
        this.deleteElements('user')
        this.deleteElements('team')
        this.deleteElements('fixture')
    }
}

Render.element = function element(type, attributes, container, content) {
    // DESCRIPTION:
    // type: 'input'
    // optional: [
    //    attributes: { type: 'text', name: 'add-user' ... }
    //    container: 'htmlNode']
    //    content: 'text describing element' (`label` is a better name than `content`?)

    attributes = attributes || {}

    let html = {
        element: document.createElement(type),
        content: content,
        attributes: attributes
    }

    // Set attributes
    for (var attribute in html.attributes) {
        if (html.attributes.hasOwnProperty(attribute)) {
            html.element.setAttribute(attribute, html.attributes[attribute])
        }
    }

    // Set content
    if (html.content !== undefined) {
        html.element.innerText = content
    }

    // return html.element
    // $(html.element).container(container)

    // console.log(document.querySelector('.input-wrapper'));
    container.appendChild(html.element)

    return html.element
}

Render.updateElement = function (element, attributes, content) {

    // Set attributes
    for (var attribute in attributes) {
        if (attributes.hasOwnProperty(attribute)) {
            element.setAttribute(attribute, attributes[attribute])
        }
    }

    // Set content
    if (content !== undefined) {
        element.innerText = content
    }

}

export default Render
