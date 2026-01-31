const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StudentFundDAO", function () {
    let dao;
    let owner, member1, member2, member3;

    beforeEach(async function () {
        [owner, member1, member2, member3] = await ethers.getSigners();

        const StudentFundDAO = await ethers.getContractFactory("StudentFundDAO");
        dao = await StudentFundDAO.deploy();
        await dao.waitForDeployment();
    });

    describe("Proposal Creation", function () {
        it("Should create a proposal successfully", async function () {
            const tx = await dao.connect(member1).createProposal(
                "Buy Event Tickets",
                "Purchase tickets for tech conference",
                ethers.parseEther("0.5")
            );

            await expect(tx)
                .to.emit(dao, "ProposalCreated")
                .withArgs(0, member1.address, "Buy Event Tickets", ethers.parseEther("0.5"));

            const proposal = await dao.getProposal(0);
            expect(proposal.title).to.equal("Buy Event Tickets");
            expect(proposal.proposer).to.equal(member1.address);
            expect(proposal.status).to.equal(0); // Pending
        });

        it("Should fail with empty title", async function () {
            await expect(
                dao.connect(member1).createProposal(
                    "",
                    "Description",
                    ethers.parseEther("0.5")
                )
            ).to.be.revertedWith("Title cannot be empty");
        });

        it("Should fail with zero amount", async function () {
            await expect(
                dao.connect(member1).createProposal(
                    "Title",
                    "Description",
                    0
                )
            ).to.be.revertedWith("Amount must be greater than 0");
        });

        it("Should auto-register member on first proposal", async function () {
            await dao.connect(member1).createProposal(
                "Test Proposal",
                "Description",
                ethers.parseEther("1")
            );

            expect(await dao.members(member1.address)).to.be.true;
            expect(await dao.memberCount()).to.equal(1);
        });
    });

    describe("Voting", function () {
        beforeEach(async function () {
            // Create a proposal
            await dao.connect(member1).createProposal(
                "Test Proposal",
                "Test Description",
                ethers.parseEther("1")
            );
        });

        it("Should allow member to vote yes", async function () {
            await expect(dao.connect(member2).vote(0, true))
                .to.emit(dao, "VoteCast")
                .withArgs(0, member2.address, true);

            const proposal = await dao.getProposal(0);
            expect(proposal.yesVotes).to.equal(1);
            expect(proposal.noVotes).to.equal(0);
        });

        it("Should allow member to vote no", async function () {
            await dao.connect(member2).vote(0, false);

            const proposal = await dao.getProposal(0);
            expect(proposal.yesVotes).to.equal(0);
            expect(proposal.noVotes).to.equal(1);
        });

        it("Should prevent duplicate voting", async function () {
            await dao.connect(member2).vote(0, true);

            await expect(
                dao.connect(member2).vote(0, true)
            ).to.be.revertedWith("Already voted on this proposal");
        });

        it("Should track who has voted", async function () {
            await dao.connect(member2).vote(0, true);

            expect(await dao.hasVoted(0, member2.address)).to.be.true;
            expect(await dao.hasVoted(0, member3.address)).to.be.false;
        });
    });

    describe("Proposal Status Updates", function () {
        beforeEach(async function () {
            await dao.connect(member1).createProposal(
                "Test Proposal",
                "Test Description",
                ethers.parseEther("1")
            );
        });

        it("Should approve proposal with majority yes votes", async function () {
            // 3 yes votes, 0 no votes = 100% approval
            await dao.connect(member1).vote(0, true);
            await dao.connect(member2).vote(0, true);

            await expect(dao.connect(member3).vote(0, true))
                .to.emit(dao, "ProposalStatusChanged")
                .withArgs(0, 1); // Approved

            const proposal = await dao.getProposal(0);
            expect(proposal.status).to.equal(1); // Approved
        });

        it("Should reject proposal with majority no votes", async function () {
            // 1 yes, 2 no = 33% approval (below 50% threshold)
            await dao.connect(member1).vote(0, true);
            await dao.connect(member2).vote(0, false);

            await expect(dao.connect(member3).vote(0, false))
                .to.emit(dao, "ProposalStatusChanged")
                .withArgs(0, 2); // Rejected

            const proposal = await dao.getProposal(0);
            expect(proposal.status).to.equal(2); // Rejected
        });

        it("Should remain pending with less than 3 votes", async function () {
            await dao.connect(member1).vote(0, true);
            await dao.connect(member2).vote(0, true);

            const proposal = await dao.getProposal(0);
            expect(proposal.status).to.equal(0); // Still Pending
        });
    });

    describe("View Functions", function () {
        it("Should return all proposal IDs", async function () {
            await dao.connect(member1).createProposal("Proposal 1", "Desc 1", ethers.parseEther("1"));
            await dao.connect(member1).createProposal("Proposal 2", "Desc 2", ethers.parseEther("2"));
            await dao.connect(member1).createProposal("Proposal 3", "Desc 3", ethers.parseEther("3"));

            const ids = await dao.getAllProposalIds();
            expect(ids.length).to.equal(3);
            expect(ids[0]).to.equal(0);
            expect(ids[1]).to.equal(1);
            expect(ids[2]).to.equal(2);
        });

        it("Should return correct proposal count", async function () {
            expect(await dao.proposalCount()).to.equal(0);

            await dao.connect(member1).createProposal("Proposal 1", "Desc", ethers.parseEther("1"));
            expect(await dao.proposalCount()).to.equal(1);

            await dao.connect(member1).createProposal("Proposal 2", "Desc", ethers.parseEther("1"));
            expect(await dao.proposalCount()).to.equal(2);
        });
    });
});
