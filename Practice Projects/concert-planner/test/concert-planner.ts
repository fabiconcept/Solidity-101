import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { ConcertPlanner } from "../typechain-types";

describe("Concert Planner", function () {
    let concertName: string;
    let concertPlanner: ConcertPlanner;
    let owner: any;
    let otherAccount: any;
    before(async () => {
        concertName = "Test Concert";

        [owner, otherAccount] = await hre.ethers.getSigners();
        const ConnectPlanner = await hre.ethers.getContractFactory("ConcertPlanner");
        concertPlanner = await ConnectPlanner.deploy(concertName);

        return { owner, concertPlanner, concertName, otherAccount };
    })

    describe("Deployment",  function () {
        it("Should deploy the contract wih the right Concert Name", async function () {
            expect(await concertPlanner.concertName()).to.equal(concertName);
        });

        it("Should set the Concert Date to 5 days after today",  async function () {

            const blockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;
            const concertDate = await concertPlanner.concertDate();
            
            const fiveDaysInSeconds = 5 * 24 *  60 * 60;
            const expectedConcertDate = blockTimestamp + fiveDaysInSeconds;

            expect(concertDate).to.be.closeTo(expectedConcertDate, 5);
        });

        it("Should set the right owner",  async function () {
            expect(await concertPlanner.owner()).to.equal(owner.address);
        });       
    });

    describe("Tickets",  function () {
        it("Should allow another wallet (not admin) to buy tickets", async function () {
            const [, user] = await ethers.getSigners();
            await concertPlanner.connect(user).purchaseTicket("test user", 12);
            const visitorsCount = await concertPlanner.visitorCount();
            expect(visitorsCount).to.be.equal(1);
        });
        
        it("Should burn users tickets",  async function () {
            await concertPlanner.burnTicket(12);
            const visitorsCount = Number((await concertPlanner.visitorCount()).toString());
            expect(visitorsCount).to.be.equal(0);
        })
    })

    describe("Meet and Greet", function () {
        describe("Should allow user with ticket book meet and greet", async () => {
            const [, user] = await ethers.getSigners();
            await concertPlanner.connect(user).purchaseTicket("test user", 12);
            await expect(concertPlanner.bookMeetGreet(12, 0)).to.be.reverted
        })
    })

})
