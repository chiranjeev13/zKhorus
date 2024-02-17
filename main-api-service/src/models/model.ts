import mongoose from "mongoose"

const Proposal = new mongoose.Schema({
    proposal_title: {
        type: String,
        required: true
    },
    proposal_init_time: {
        type: Number, // unix time
        required: true
    },
    proposal_end_time: {
        type: Number, // also unix time
        required: true
    },
    proposal_status: {
        type: String, // active, closed
    },
    vote_count: {
        type: Number,
        default: 0
    }
})

const SentimentScore = new mongoose.Schema({
    sentiment_ingest: {
        type: String, // ingest combination of the proposal and the choice that was used to generate the sentiment score by the BERT model.
        required: true
    },
    sentiment_score: {
        type: Number,
        required: true
    }
})

const User = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_age: {
        type: String,
    },
    user_description: {
        type: String,
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
        type: [Proposal]
    },
    participating_proposals: {
        type: [Proposal]
    },
    voting_sentiment_history: {
        type: [SentimentScore],
    }
});


export const UserModel = mongoose.model("UserModel", User);
export const ProposalModel = mongoose.model("ProposalModel", Proposal);
export const SentimentScoreModel = mongoose.model("SentimentScoreModel", SentimentScore);