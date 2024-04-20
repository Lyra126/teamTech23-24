import mongoose from "mongoose";

const SatelliteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    schedule: [{
        name: { type: String, required: true },
        ID: { type: String, required: true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        startTimeLat: { type: String, required: true },
        startTimeLong: { type: String, required: true },
        endTimeLat: { type: String, required: true },
        endTimeLong: { type: String, required: true }
    }]
});

const SatelliteModel = mongoose.model('SatelliteInfo', SatelliteSchema);

export default SatelliteModel;
