import SatelliteModel from "../models/Satellite.js";

const getAllSatellite = async (req, res) => {
    try {
        // Fetch all satellites from the database using the Mongoose model
        const satellites = await SatelliteModel.find();
        res.json(satellites);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'Failed to fetch satellites' });
    }
};

const createSatellite = async (req, res) => {
    try {
        // Create a new satellite in the database using the Mongoose model
        const satellite = new SatelliteModel({ 
            name: req.body.name,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        await satellite.save();
        res.json(satellite);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'Failed to create satellite' });
    }
};

const getSatelliteByID = async (req, res) => {};

export{
    getAllSatellite,
    createSatellite,
    getSatelliteByID,
}