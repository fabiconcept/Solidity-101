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
    });

    describe("Revert Meet and Greet", function () {
        it("Shouldn't allow user with ticket book meet and greet because no artist has been invited", async () => {
            const [, user] = await ethers.getSigners();
            await concertPlanner.connect(user).purchaseTicket("test user", 12);
            await expect(concertPlanner.bookMeetGreet(12, 0)).to.be.reverted
        });

        it("Shouldn't allow user to cancel Meet and Greet booking because no artist has been invited", async () => {
            await expect(concertPlanner.cancelMeetGreet(12)).to.be.reverted
        })
    });

    describe("Artist", function () { 
        it("Should allow admin to add an artist", async function () {
            const artistName = "test artist";
            await concertPlanner.addArtist(0, artistName);
            const artistCount = await concertPlanner.artistCount();
            expect(artistCount).to.be.equal(1);
        });

        it("Should not allow admin to add an existing artist", async function () {
            const artistName = "test artist";
            await expect(concertPlanner.addArtist(0, artistName)).to.be.reverted;
        });

        it("Should not allow user to add artist", async function () {
            const [, user] = await ethers.getSigners();
            await expect(concertPlanner.connect(user).addArtist(1, "test artist")).to.be.reverted
        });
        
        it("Should not allow user to remove artist", async function () {
            const [, user] = await ethers.getSigners();
            await expect(concertPlanner.connect(user).removeArtist(0)).to.be.reverted
        });
        
        it("Should allow admin to remove artist", async function () {
            await concertPlanner.removeArtist(0);
            const artistCount = await concertPlanner.artistCount();
            expect(artistCount).to.be.equal(0);
        });
        
    });

    describe("Meet and Greet",  function () {
        it("Should allow user book meet and greet with existing artist", async () => {
            const [, user] = await ethers.getSigners();
            await concertPlanner.addArtist(1, "test artist");
            await concertPlanner.connect(user).purchaseTicket("test user with mG", 2);
            await concertPlanner.connect(user).bookMeetGreet(2, 1);
            const meetGreetCount = await concertPlanner.meetGreetCount();
            expect(meetGreetCount).to.be.equal(1);
        });
        
        it("Should allow user with booked meet and greet to cancel it", async () => {
            const [, user] = await ethers.getSigners();
            await concertPlanner.connect(user).cancelMeetGreet(2);
            const meetGreetCount = await concertPlanner.meetGreetCount();
            expect(meetGreetCount).to.be.equal(0);
        });
        
        it("Should not allow user without  booked meet and greet to cancel it", async () => {
            const [, user] = await ethers.getSigners();
            await expect(concertPlanner.connect(user).cancelMeetGreet(2)).to.be.reverted
        });

        it("Should not allow user to book meet and greet with an unexisiting  artist", async () => {
            const [, user] = await ethers.getSigners();
            await expect(concertPlanner.connect(user).bookMeetGreet(2, 2)).to.be.reverted
        });
        
        it("Should not allow user with meet and greet meet artist until concert is started", async () => {
            const [, user] = await ethers.getSigners();
            await expect(concertPlanner.connect(user).meetGreetArtist(12)).to.be.reverted
        })
    });

    describe("Get text information", function() {
        it("Should return the artist name", async function () {
            const artistName = await concertPlanner.getArtistName(1);
            expect(artistName).to.be.equal("test artist");
        });
        it("Should return the list of artist", async function () {
            const artistList = await concertPlanner.seeAllArtist();
            expect(artistList).to.be.deep.equal(["test artist"]);
        });
        it("Should return the list of visitors", async function () {
            const [, user] = await ethers.getSigners();
            await concertPlanner.connect(user).purchaseTicket("Ray Williams", 10);

            const visitorList = await concertPlanner.seeAllVisitors();
            expect(visitorList).to.be.deep.equal(["test user","test user with mG", "Ray Williams"]);
        });
    });
});