import Web3 from 'web3';
import { NITRO } from '../contracts/contract';
import SmartContractUtils from '../utils/smart_contract_utils';

class NitroTokenRepository {
    private web3: Web3;
    private smartContractUtils: SmartContractUtils;

    private ownerPrivateKey: string;
    private ownerAddress: string;
    private tokenAddress: string;

    constructor() {
        this.web3 = new Web3(process.env.DEV_URL);
        this.smartContractUtils = new SmartContractUtils(this.web3);
        this.ownerPrivateKey = process.env.OWNER_PRIVATE_KEY as string;
        this.ownerAddress = process.env.OWNER_ADDRESS as string;
        this.tokenAddress = process.env.NITRO_ADDRESS as string;
    }

    private static _instance: NitroTokenRepository;

    static instance(): NitroTokenRepository {
        if (!this._instance) {
            this._instance = new NitroTokenRepository();
        }
        return this._instance;
    }

    async transfer(senderAddress: string, senderPrivateKey: string, receiverAddress: string, amount: number):Promise<string>{
        let value = this.smartContractUtils.toEther(amount.toString());
        const contract = new this.web3.eth.Contract(NITRO, this.tokenAddress);
        let result = await this.smartContractUtils.sendTransaction({
            contract: contract,
            userAddress: senderAddress,
            privateKey: senderPrivateKey,
            methodName: 'transfer',
            methodArgs: [receiverAddress,value]
        })
        return result.transactionHash.toString();
    }

    async balanceOf(address: string): Promise<number>{
        const contract = new this.web3.eth.Contract(NITRO, this.tokenAddress);
        let result = await contract.methods.balanceOf(address).call();
        return Number(this.smartContractUtils.fromEther(result.toString()));
    }

    async totalSupply(): Promise<number>{
        const contract = new this.web3.eth.Contract(NITRO, this.tokenAddress);
        let result = await contract.methods.totalSupply().call();
        return Number(this.smartContractUtils.fromEther(result.toString()));
    }
}

export default NitroTokenRepository
