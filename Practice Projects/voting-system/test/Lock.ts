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
            const pollId = "1";
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
        })

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
});