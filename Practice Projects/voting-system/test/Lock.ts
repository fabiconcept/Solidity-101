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
    })
});