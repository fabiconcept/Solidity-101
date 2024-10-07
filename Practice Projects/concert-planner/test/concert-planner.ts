import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Concert Planner", function () {
    const deployConnectPlanner = async () => {
        const concertName = "Test Concert";

        const [owner, otherAccount] = await hre.ethers.getSigners();
        const ConnectPlanner = await hre.ethers.getContractFactory("ConcertPlanner");
        const concertPlanner = await ConnectPlanner.deploy(concertName);

        return { owner, concertPlanner, concertName, otherAccount };
    }

    describe("Deployment",  function () {
        it("Should deploy the contract wih the right Concert Name", async function () {
            const { concertName, concertPlanner } = await loadFixture(deployConnectPlanner);
            expect(await concertPlanner.concertName()).to.equal(concertName);
        });

        it("Should set the Concert Date to 5 days after today",  async function () {
            const { concertPlanner } = await loadFixture(deployConnectPlanner);

            const blockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;
            const concertDate = await concertPlanner.concertDate();
            
            const fiveDaysInSeconds = 5 * 24 *  60 * 60;
            const expectedConcertDate = blockTimestamp + fiveDaysInSeconds;

            expect(concertDate).to.be.closeTo(expectedConcertDate, 5);
        });

        it("Should set the right owner",  async function () {
            const { owner, concertPlanner } = await loadFixture(deployConnectPlanner);
            expect(await concertPlanner.owner()).to.equal(owner.address);
        });       
    })
})
