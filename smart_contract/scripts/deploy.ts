import { ethers, hardhatArguments } from 'hardhat';
import * as config from './config';
import { executeCommand } from '../helpers/utils';

async function main() {
    await config.initConfig();
    const network = hardhatArguments.network ?? 'dev';
    const [deployer] = await ethers.getSigners();
    console.log('Deploy from address: %s', deployer.address);

    const forwarder = await ethers.deployContract('MinimalForwarder');
    const forwarderAddress = await forwarder.getAddress();
    console.log('Forwarder address: %s', forwarderAddress);
    config.setConfig(network + '.Forwarder', forwarderAddress);

    const peopleCoin = await ethers.deployContract('PeopleCoin', [await forwarder.getAddress()]);
    const peopleCoinAddress = await peopleCoin.getAddress();
    console.log('PeopleCoin address: %s', peopleCoinAddress);
    config.setConfig(network + '.PeopleCoin', peopleCoinAddress);
    await config.updateConfig();
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });