import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { getDomain } from "../helpers/eip712";
import { eip721Types } from "../helpers/eip712-types";

describe('MinimalForwarder', function () {
    async function deployFixture() {
        const [owner, quang, cung] = await ethers.getSigners();
        const forwarderContract = await ethers.deployContract('MinimalForwarder');
        const peopleCoin = await ethers.deployContract('PeopleCoin', [await forwarderContract.getAddress()]);
        return { peopleCoin, forwarderContract, owner, quang, cung };
    }

    function getMinimalForwarderRequestData(requestData: any, sigature: any) {
        return {
            from: requestData.from,
            to: requestData.to,
            value: requestData.value,
            gas: requestData.gas,
            nonce: requestData.nonce,
            deadline: requestData.deadline,
            data: requestData.data,
            signature: sigature,
        };
    }

    it('relay success - PeopleCoin', async function () {
        const { peopleCoin, forwarderContract, owner, quang, cung } = await loadFixture(deployFixture);
        const domain = await getDomain(forwarderContract);
        const req = {
            from: owner.address,
            to: await peopleCoin.getAddress(),
            value: 0n,
            gas: 100000n,
            nonce: await forwarderContract.nonces(owner.address),
            deadline: BigInt((await ethers.provider.getBlock('latest'))?.timestamp ?? 0) + 60n,
            data: peopleCoin.interface.encodeFunctionData('transfer', [cung.address, 1000]),
        };
        const signature = await owner.signTypedData(domain, { ForwardRequest: eip721Types.ForwardRequest }, req);
        const request = getMinimalForwarderRequestData(req, signature);
        await expect(forwarderContract.execute(request))
            .to.emit(forwarderContract, 'ExecutedForwardRequest')
            .withArgs(owner.address, req.nonce, true);
        expect(await peopleCoin.balanceOf(cung.address)).to.equal(1000);
    });

    it('relay fail - invalid signer', async function () {
        const { peopleCoin, forwarderContract, owner, quang, cung } = await loadFixture(deployFixture);
        const domain = await getDomain(forwarderContract);
        const req = {
            from: owner.address,
            to: await peopleCoin.getAddress(),
            value: 0n,
            gas: 100000n,
            nonce: await forwarderContract.nonces(owner.address),
            deadline: BigInt((await ethers.provider.getBlock('latest'))?.timestamp ?? 0) + 60n,
            data: peopleCoin.interface.encodeFunctionData('transfer', [cung.address, 1000]),
        };
        const signature = await cung.signTypedData(domain, { ForwardRequest: eip721Types.ForwardRequest }, req);
        const request = getMinimalForwarderRequestData(req, signature);
        await expect(forwarderContract.execute(request)).to.be.revertedWithCustomError(forwarderContract, 'ERC2771ForwarderInvalidSigner');
    });

    /**
     * To check if the Forwarder Contract send invalid transaction (For Example: ERC20 ERROR - sender not enough balance)
     * The invalid transsactions made will be revert with a message
     * Parse the revert message to get the error name and check if it's correct
    */
    it('relay success - with revert message', async function () {
        const { peopleCoin, forwarderContract, owner, quang, cung } = await loadFixture(deployFixture);
        const domain = await getDomain(forwarderContract);
        const req = {
            from: quang.address,
            to: await peopleCoin.getAddress(),
            value: 0n,
            gas: 100000n,
            nonce: await forwarderContract.nonces(quang.address),
            deadline: BigInt((await ethers.provider.getBlock('latest'))?.timestamp ?? 0) + 60n,
            data: peopleCoin.interface.encodeFunctionData('transfer', [cung.address, 1000]),
        };
        const signature = await quang.signTypedData(domain, { ForwardRequest: eip721Types.ForwardRequest }, req);
        const request = getMinimalForwarderRequestData(req, signature);
        await forwarderContract.execute(request).catch((err) => {
            expect(err.message).to.contain('ERC2771ForwarderFailWithRevert');
            const revertMessage = err.message.match(/0x[a-fA-F0-9]+/);
            expect(revertMessage.length).to.greaterThan(0);
            expect(peopleCoin.interface.parseError(revertMessage[0])!.name).to.equal('ERC20InsufficientBalance');
        });
    });
})
