import { ethers } from 'hardhat';
import { eip721Types } from './eip712-types';

interface Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  salt: string;
  [key: string]: any;
}

export async function getDomain(contract: any): Promise<Domain> {
  const { fields, name, version, chainId, verifyingContract, salt, extensions } = await contract.eip712Domain();

  if (extensions.length > 0) {
    throw Error('Extensions not implemented');
  }

  const domain: Domain = {
    name,
    version,
    chainId,
    verifyingContract,
    salt,
  };

  for (const [i, { name }] of eip721Types.EIP712Domain.entries()) {
    if (!(fields & (1 << i))) {
      delete domain[name];
    }
  }

  return domain;
}

function domainType(domain: Domain) {
  return eip721Types.EIP712Domain.filter(({ name }: { name: string }) => domain[name] !== undefined);
}

function hashTypedData(domain: Domain, structHash: string) {
  return ethers.solidityPackedKeccak256(
    ['bytes', 'bytes32', 'bytes32'],
    ['0x1901', ethers.id(JSON.stringify(domain)), structHash],
  );
}

export const eip712 = {
  getDomain,
  domainType,
  domainSeparator: ethers.id,
  hashTypedData,
  ...eip721Types,
};
