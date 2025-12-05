const mongoose = require ('mongoose')
//NPM Validator Import
const validator = require ('validator');

const ContactSchema = new mongoose.Schema ({
fullname: {
    type:String,
    trim:true,
    required:true
},
email: {
    type:String,
    trim:true,
    required:true,
    validate: function (v){
        return validator.isEmail(v);
    },
    message: props => `${props.value} is not a valid email!`
},
phone: {
    type:String,
    trim:true,
    required:true,
    validate: {
        validator: function (v) {
            return validator.isMobilePhone(v, 'any');
        },
        messaage: props => `${props.value} is not a valid phone number!`
    }
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
//I NEED TO RESEARCH MORE ON THIS FILE PART, so far having "buffer" is what's needed
file: {
type: Buffer,
required:false
}

});

module.exports = mongoose.model('Contact', ContactSchema)