import { NetworkResponse, STATUS_CODE } from '../models/network_response';
import NitroTokenRepository from '../repositories/nitro_token_repository';

async function transfer(request): Promise<NetworkResponse> {
    try {
        const body = request.body;
        const transactionId = await NitroTokenRepository.instance().transfer(body.sender_address, body.sender_private_key, body.receiver_address, body.amount);
        return NetworkResponse.success(transactionId, 'transfer_success');
    } catch (e) {
        console.error(e);
        return NetworkResponse.fromErrors(STATUS_CODE.bad_request, e.message || 'transfer_fail');
    }
}

async function balanceOf(request): Promise<NetworkResponse> {
    try {
        const data = await NitroTokenRepository.instance().balanceOf(request.query.address);
        return NetworkResponse.success(data, null);
    } catch (e) {
        console.error(e);
        return NetworkResponse.fromErrors(STATUS_CODE.bad_request, e.message || 'get_balance_fail');
    }
}

async function totalSupply(): Promise<NetworkResponse> {
    try {
        const data = await NitroTokenRepository.instance().totalSupply();
        return NetworkResponse.success(data, null);
    } catch (e) {
        console.error(e);
        return NetworkResponse.fromErrors(STATUS_CODE.bad_request, e.message || 'get_total_supply_fail');
    }
}

export { transfer, balanceOf, totalSupply}