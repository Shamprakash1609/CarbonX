const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost:27017/CarbonX', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the application if the DB connection fails
    });

// Define the Emissions schema
const emissionSchema = new mongoose.Schema({
    onetyper:{type: String, required: true},
    twotyper:{type: String, required: true},
    opencast:{type: String, required: true},
    minetype: { type: String, required: true },
    vehicletype: { type: String, required: true },
    fuel: { type: String, required: true },
    finalemissions: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    // activity: { type: String, required: true }
});

// Create the Mongoose model
const Emission = mongoose.model('Emission', emissionSchema);

// Endpoints

// POST endpoint to create emission data
app.post('/emissions', (req, res) => {
    console.log('POST request body:', req.body); // Log the incoming request
    try {
        const {onetyper,twotyper,opencast, minetype, vehicletype, finalemissions, date,fuel, time, activity } = req.body;

        // Validate the data
        if (!onetyper ||!minetype || !vehicletype || !finalemissions || !fuel || !date || !time || !activity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new emission record
        const emission = new Emission({
            onetyper,
            twotyper,
            opencast,
            minetype,
            vehicletype,
            finalemissions,
            fuel,
            date,
            time,
            activity,
        });

        // Save the emission to the database
        emission.save()
            .then(() => {
                res.status(201).json({ message: 'Emission data saved successfully' });
            })
            .catch((error) => {
                console.error('Database Error:', error);  // Detailed logging
                res.status(500).json({ error: 'Failed to save emission data', details: error.message || error });
            });
    } catch (error) {
        console.error('Server Error:', error);  // Log unexpected errors
        res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
    }
});

// GET all emission records
app.get('/emissions', async (req, res) => {
    try {
        const emissions = await Emission.find().sort({ dateTime: -1 }); // Sort by newest first
        res.json(emissions);
    } catch (error) {
        console.error('Error fetching emissions:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message || error });
    }
});

// PUT endpoint to update an emission record by ID
app.put('/emissions/:id', async (req, res) => {
    const { id } = req.params;
    const { minetype, vehicletype, finalemissions, date, time, activity } = req.body;

    try {
        const updatedEmission = await Emission.findByIdAndUpdate(
            id,
            { minetype, vehicletype, finalemissions, date, time, activity },
            { new: true }
        );

        if (!updatedEmission) return res.status(404).json({ message: 'Emission record not found' });

        res.json(updatedEmission);
    } catch (error) {
        console.error('Error updating emission:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message || error });
    }
});

// DELETE an emission record by ID
app.delete('/emissions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmission = await Emission.findByIdAndDelete(id);
        if (!deletedEmission) return res.status(404).json({ message: 'Emission record not found' });

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting emission:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message || error });
    }
});

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// dateee

// GET emissions filtered by date range
app.get('/emissions/filter', async (req, res) => {
    const { startDate, endDate } = req.query;

    // Validate query parameters
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Both startDate and endDate are required' });
    }

    try {
        // Find emissions within the date range
        const emissions = await Emission.find({
            date: {
                $gte: new Date(startDate), // Convert startDate to a Date object
                $lte: new Date(endDate)   // Convert endDate to a Date object
            }
        }).sort({ date: 1 }); // Sort by date in ascending order

        res.json(emissions);
    } catch (error) {
        console.error('Error fetching emissions by date range:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message || error });
    }
});