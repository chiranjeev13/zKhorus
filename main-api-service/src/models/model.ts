import mongoose from "mongoose"

const User = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_age: {
        type: String,
        required: true
    },
    user_description: {
        type: String,
        required: true
    },
    user_designation: {
        type: String
    },
    registration_date: {
        type: Date,
        default: Date.now()
    },
    consent_to_ai_semaphore_voting: {
        type: Boolean,
        required: true
    },
    participated_proposals: {
        type: [String]
    },
    participating_proposals: {
        type: [String]
    }
});

const Proposal = new mongoose.Schema({

})