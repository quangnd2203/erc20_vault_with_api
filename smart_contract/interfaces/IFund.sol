// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IFund {

    error InvalidGroup(address account);
    error ContributionError(bytes message);

    event StakingToken(address indexed expenditureVote, uint256 amount);
    event ContributeToken(address indexed account, uint256 amount);

    function contribute(uint256 _amount) external;
    function staking(address expenditureVote, uint256 _amount) external;
}
