const mongoose = require ('mongoose')

const ContactSchema = new mongoose.Schema ({

fullname: {
    type:String,
    trim:true,
    required:true
},
email: {
    type:String,
    trim:true,
    required:true
},
phone: {
    type:String,
    trim:true,
    required:true,
},
company_name: {
    type:String,
    trim:true,
    required:true,

},
project_name: {
    type:String,
    trim:true,
    required:true,
},
department: {
    type:String,
    trim:true,
    required:true,
},
message: {
    type:String,
    trim:true,
    required:true,
},
//I NEED TO RESEARCH MORE ON THIS FILE PART
file: {
type:
}




})

module.exports = mongoose.model('Contact', ContactSchema)