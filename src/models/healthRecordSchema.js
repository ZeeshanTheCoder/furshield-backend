const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    vaccinations: [{
        name: String,
        date: Date,
        nextDue: Date
    }],
    allergies: [String],
    illnesses: [String],
    treatments: [String],
    documents: [{ type: String }], // URLs of scans, reports
    insurance: {
        policyNo: String,
        provider: String,
        docs: [String] // policy files
    },
    updatedAt: { type: Date, default: Date.now }
});

healthRecordModel =mongoose.model('HealthRecord', healthRecordSchema) ;

module.exports = healthRecordModel ;