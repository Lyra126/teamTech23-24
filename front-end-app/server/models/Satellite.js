import mongoose from "mongoose";

const SatelliteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    allProperties: [{type: mongoose.Schema.Types.ObjectId, ref: 'Property'}],
}); 

const SatelliteModel = mongoose.model('SatelliteInfo', SatelliteSchema);

export default SatelliteModel;

