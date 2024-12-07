import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { VotingContact } from "../typechain-types";

describe("Voting Contact", function () {
    let votingContact: VotingContact;
    let owner: any;
    let otherAccount: any;

    before(async () => {
        [owner, otherAccount] = await hre.ethers.getSigners();
        const VotingContact = await hre.ethers.getContractFactory("VotingContact");
        votingContact = await VotingContact.deploy();

        return { owner, otherAccount, votingContact };
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await votingContact.owner()).to.equal(owner.address);
        });
    });

    describe("Poll Creation", function () {
        it("Should create a new poll", async function () {
            const pollTitle = "Test Poll";
            const pollId = 1;
            const pollDuration = 5;

            await votingContact.createNewPoll(pollId, pollTitle, pollDuration);
            const totalPolls = await votingContact.total_polls();

            expect(totalPolls).to.equal(1);
        });

        it("Should set the right poll details", async function () {
            const pollId = 3;
            const pollTitle = "2024 Elections";
            const pollDuration = 5;

            await votingContact.createNewPoll(pollId, pollTitle, pollDuration);
            const pollDetails = await votingContact.getPollData(pollId);
            const blockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;
            const fiveDaysInSeconds = 5 * 24 *  60 * 60;
            const expectedConcertDate = blockTimestamp + fiveDaysInSeconds;

            expect(pollDetails[1]).to.be.closeTo(expectedConcertDate, 5);
        });

        it("Should not create a new poll with an existing poll id", async function () {
            const pollTitle = "Test Poll";
            const pollId = "1";
            const pollDuration = 5;

            await expect(votingContact.createNewPoll(pollId, pollTitle, pollDuration)).to.be.reverted;
        });

        it("Should not create a new poll with a poll id that is not a number", async function () {
            const pollTitle = "Test Poll";
            const pollId = "abc";
            const pollDuration = 5;
            
            await expect(votingContact.createNewPoll(pollId, pollTitle, pollDuration)).to.rejectedWith(
                TypeError,
                'invalid BigNumberish string: Cannot convert abc to a BigInt (argument="value", value="abc", code=INVALID_ARGUMENT, version=6.13.4)'
            );
        });

        it("Should not create a new poll with a poll id that is not a positive integer", async function () {
            const pollTitle = "Test Poll";
            const pollId = -1;
            const pollDuration = 5;
            await expect(votingContact.createNewPoll(pollId, pollTitle, pollDuration)).to.rejectedWith(
                TypeError,
                `value out-of-bounds (argument="_pollId", value=-1, code=INVALID_ARGUMENT, version=6.13.4)`
            );
        });
        
        it("Should not create a new poll with a poll duration that is not a positive integer", async function () {
            const pollTitle = "Test Poll";
            const pollId = 2;
            const pollDuration = -1;
            
            await expect(votingContact.createNewPoll(pollId, pollTitle, pollDuration)).to.rejectedWith(
                TypeError,
                `value out-of-bounds (argument="_duration", value=-1, code=INVALID_ARGUMENT, version=6.13.4)`
            );
        });

        it("Should not allow a user to create a new poll if they are not the owner", async function () {
            const pollTitle = "Test Poll";
            const pollId = 2;
            const pollDuration = 5;
          
            await expect(votingContact.connect(otherAccount).createNewPoll(pollId, pollTitle, pollDuration)).to.be.reverted;
        });
    });

    describe("Poll Deletion", function () {
        it("Should allow the owner to delete a poll", async function () {
            const pollId = 3;
            await votingContact.connect(owner).deletePoll(pollId);
            const pollCount = await votingContact.total_polls();
            expect(pollCount).to.be.equals(1);
        });

        it("Should not allow user that is not admin to delete a poll", function () {
            const pollId = 1;
            expect(votingContact.connect(otherAccount).deletePoll(pollId)).to.be.revertedWith("Only owner can call this function!");
        });
        
        it("Should not allow admin user to delete a poll that does not exist", function () {
            const pollId = 4;
            expect(votingContact.connect(owner).deletePoll(pollId)).to.be.revertedWith("This poll does not exist!");
        });
    });
    
    describe("Add Poll Option", function () {
        it("Should allow the owner to add a new poll option", async function () {
            const pollId = 4;
            const pollTitle = "TinubuuuuuUUU!";
            const pollDuration = 5;

            await votingContact.connect(owner).createNewPoll(pollId, pollTitle, pollDuration);
            
            const option = "Test Option";
            await votingContact.connect(owner).addPollOption(option, pollId);
            
            const optionsCount = await votingContact.getPollOptionsCount(pollId);
            expect(optionsCount).to.be.equals(1);
        });

        it("Should only allow admin to Add a Poll Option", function () { 
            const pollId = 4;
            expect(votingContact.connect(otherAccount).addPollOption("Test Option", pollId)).to.be.revertedWith("Only owner can call this function!")
        });

        it("Should not allow admin to add a poll option to a poll that does not exist", function () {
            const pollId = 5;
            const option = "Test Option";

            expect(votingContact.connect(owner).addPollOption(option, pollId)).to.be.rejectedWith("On the admin of this poll can call this function!");
        });
    });

    describe("Remove Poll Option", function () { 
        it("Should allow the owner to remove a poll option", async function () {
            const pollId = 4;
            const option = 0;
            
            await votingContact.connect(owner).removePollOption(pollId, option);

            const optionsCount = await votingContact.getPollOptionsCount(pollId);
            expect(optionsCount).to.be.equals(0);
        });

        it("Should not allow admin to remove a poll option that does not exist", function () {
            const pollId = 4;
            const option = 1;
            expect(votingContact.connect(owner).removePollOption(pollId, option)).to.be.revertedWith("This option does not exist!");
        })

        it("Should only allow admin to remove a poll option", async function () {
            const pollId = 4;
            const optionID = 0;

            const option = "Test Option";
            await votingContact.connect(owner).addPollOption(option, pollId);

            expect(votingContact.connect(otherAccount).removePollOption(pollId, optionID)).to.be.revertedWith("Only owner can call this function!")
        });
    });
    
});