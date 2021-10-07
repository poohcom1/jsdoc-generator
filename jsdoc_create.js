


/**
 * 
 * @param {string|object} obj Object to convert
 * @param {number} name Name of type to define
 * @return {string} jsdoc
 */
function typedefCreate(obj, name) {
    const json = typeof obj === "string" ? JSON.parse(JSONize(obj)) : obj

    let output_string = JSDOC_BEGIN + jsdocItem("typedef", "object", name)

    for (const key in json) {
        output_string += jsdocItemFromObject(jsdocObjectCreate("property", key, json[key]))
    }

    output_string += JSDOC_END

    console.log(output_string)

    return output_string
}

export function typedefCreateFromList(objects, name) {
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

typedefCreate({
    mal_id: 34902,
    title: 'Tsurezure Children',
    video_url: 'https://myanimelist.net/anime/34902/Tsurezure_Children/video',
    url: 'https://myanimelist.net/anime/34902/Tsurezure_Children',
    image_url: 'https://cdn.myanimelist.net/images/anime/12/86676.jpg?s=3fe2b4257e8cae80c88bd8fca1f81cd9',
    type: 'TV',
    watching_status: 2,
    score: 9,
    watched_episodes: 12,
    total_episodes: 12,
    airing_status: 2,
    season_name: null,
    season_year: null,
    has_episode_video: true,
    has_promo_video: true,
    has_video: true,
    is_rewatching: false,
    tags: 'CUTE AF',
    rating: 'PG-13',
    start_date: '2017-04-07T00:00:00+00:00',
    end_date: '2018-07-09T00:00:00+00:00',
    watch_start_date: '2017-05-11T00:00:00+00:00',
    watch_end_date: '2017-08-11T00:00:00+00:00',
    days: 4,
    storage: null,
    priority: 'Low',
    added_to_list: false,
    studios: [],
    licensors: [],
    genres: [[Object], [Object]],
    demographics: [[Object]]
}, "anime")