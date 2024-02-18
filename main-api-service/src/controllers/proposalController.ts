import { Request, Response } from "express";
import { ProposalModel } from "../models/model";


export const createProposal = async (req: Request, res: Response) => {
    try {
        const { proposal_title, proposal_init_time, proposal_end_time } = req.body;
        // create the new proposal bbg...
        const createProposal = new ProposalModel({
            proposal_title: proposal_title,
            proposal_init_time: proposal_init_time,
            proposal_end_time: proposal_end_time,
            proposal_status: "active"
        });
        // save the proposal into db bbg...
        await createProposal.save();
        // send back the res to client bbg..
        res.status(200).json({ message: "created new proposal successfully!", data: createProposal })

    } catch (error) {
        console.log(error);
        res.status(500).send(`Internal Server Error during creation of new proposal - ${error}`);
    }
}


export const getProposals = async (req: Request, res: Response) => {
    try {
        // fetch all the proposal data from mongodb bbg...
        const proposals = await ProposalModel.find({});
        // send back the res to client bbg..
        res.status(200).json(proposals)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error while fetching the proposals")
    }
};

export const getProposal = async (req: Request, res: Response) => {
    try {
        const { proposalId } = req.params;
        console.log(proposalId)
        // find by proposal id bbg...
        const proposal = await ProposalModel.findById(proposalId);
        // if proposal not found then send back 404 err bbg...
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        return res.status(200).json(proposal)
    } catch (error) {
        res.status(500).send('Internal Server Error during fetch of the proposal');
    }
}