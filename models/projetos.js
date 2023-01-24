const mongoose = require("mongoose")
const projetoSchema = new mongoose.Schema({
    order: {type: Number, default: 0, required: true},
    name: {type: String, maxLength: 50, required: true}, 
    cover: {type: String, required: true},
    type: {type: String, required: true},
    url: {type: String, default: ""},
    techs: {type: Array, required: true, default: []},
    idGithub: {type: Number, default: undefined},
    access: {type: Number, default: 0},
    techsPercent: {type: Object, default: {}},
    repLink: {type: String, default: undefined},
    favorite: {type: Boolean, default: false}
})

module.exports = mongoose.model("Projeto", projetoSchema)