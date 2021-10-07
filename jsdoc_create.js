


/**
 * 
 * @param {string|object} obj Object to convert
 * @param {number} name Name of type to define
 * @return {string} jsdoc
 */
function typedefCreate(obj, name) {
    console.log("Object:", obj)

    const json = typeof obj === "string" ? JSON.parse(JSONize(obj)) : obj

    let output_string = JSDOC_BEGIN + jsdocItem("typedef", "object", name)

    for (const key in json) {
        output_string += jsdocItemFromObject(jsdocObjectCreate("property", key, json[key]))
    }

    output_string += JSDOC_END

    console.log(output_string)

    return output_string
}

function typedefCreateFromList(objects, name) {
    const types = {}

    for (const object of objects) {
        for (const key in object) {

            const jsdocObject = jsdocObjectCreate("property", key, object[key])
            if (key in types) {
                jsdocObjectUpdateType(types[key], object[key])
            } else {
                types[key] = jsdocObject
            }
        }
    }

    let output_string = JSDOC_BEGIN + jsdocItem("typedef", "object", name)


    for (const jsdocObj of Object.values(types)) {
        output_string += jsdocItemFromObject(jsdocObj)
    }

    output_string += JSDOC_END

    return output_string
}

/* ---------------------------- Helper Functions ---------------------------- */

/**
 * @typedef {object} JSDocObject
 * @property {string} tag
 * @property {string[]} types
 * @property {string} name
 * @property {string} description
 */

const JSDOC_BEGIN = "/**\n"
const JSDOC_END = " */\n"

/**
 * 
 * @param {string} tag 
 * @param {string} type
 * @param {string} name
 * @param {string} description
 * @returns 
 */
function jsdocItem(tag, type, name, description = "") {
    return ` * @${tag} {${type}} ${name} ${description}\n`
}

/**
 *
 * @param {JSDocObject} jsdocObj
 * @returns
 */
function jsdocItemFromObject(jsdocObj) {
    let type;

    if (jsdocObj.types.length == 2 && jsdocObj.types.includes("null")) {
        type = `?${jsdocObj.types.find(key => key !== "null")}`
    } else {
        type = jsdocObj.types.join("|")
    }

    return jsdocItem(jsdocObj.tag, type, jsdocObj.name, jsdocObj.description)
}


/**
 * 
 * @param {string} tag 
 * @param {string} key
 * @param {any} value
 * @param {string} description
 * @returns {JSDocObject}
 */
function jsdocObjectCreate(tag, key, value, description = "") {
    return {
        tag, types: [value === null ? "null" : typeof value], name: key, description
    }
}

/**
 * 
 * @param {JSDocObject} obj 
 * @param {any} key 
 */
function jsdocObjectUpdateType(obj, value) {
    const type = value === null ? "null" : typeof value
    if (!obj.types.includes(type)) { obj.types.push(type) }
}

function JSONize(str) {
    return str
        // wrap keys without quote with valid double quote
        .replace(/([\$\w]+)\s*:/g, function (_, $1) { return '"' + $1 + '":' })
        // replacing single quote wrapped ones to double quote 
        .replace(/'([^']+)'/g, function (_, $1) { return '"' + $1 + '"' })
}


/* ---------------------------------- Test ---------------------------------- */