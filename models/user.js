var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;

var UserSchema = new Schema({
    loginname: { type: String},
    pass: { type: String },
});

UserSchema.plugin(BaseModel);

UserSchema.index({loginname: 1}, {unique: true});



mongoose.model('User', UserSchema);
