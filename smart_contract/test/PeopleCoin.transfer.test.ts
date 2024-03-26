import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PeopleCoin - transfer", function () {
    async function deployFixture() {
        const [owner, quang, cung, forwarder] = await ethers.getSigners();
        const peopleCoin = await ethers.deployContract("PeopleCoin", [forwarder.address]);
        return { peopleCoin, owner, quang, cung };
    }

    it("Happy path - deploy success", async function () {
        const { peopleCoin, owner } = await loadFixture(deployFixture);
        expect(await peopleCoin.owner()).to.equal(owner.address);
        expect(await peopleCoin.balanceOf(owner.address))
            .to.equal(await peopleCoin.totalSupply())
            .to.equal(await peopleCoin.maxcap());
        expect(await peopleCoin.symbol()).to.equal("PPCB");
        expect(await peopleCoin.name()).to.equal("People Coin");
    });

    it("Happy path - enough token to transfer", async function () {
        const { peopleCoin, owner, cung } = await loadFixture(deployFixture);
        const amountToTransfer = ethers.parseEther("50000000000");

        await expect(peopleCoin.connect(owner).transfer(cung.address, amountToTransfer))
        .to.emit(peopleCoin, "Transfer").withArgs(owner.address, cung.address, amountToTransfer);

        expect(await peopleCoin.balanceOf(cung.address)).to.equal(amountToTransfer);
    });

    it("Unhappy path - not enough token to transfer", async function () {
        const { peopleCoin, quang, cung } = await loadFixture(deployFixture);
        const amountToTransfer = ethers.parseEther("1");

        await expect(peopleCoin.connect(cung).transfer(quang.address, amountToTransfer))
        .to.be.revertedWithCustomError(peopleCoin, 'ERC20InsufficientBalance');
    });
});