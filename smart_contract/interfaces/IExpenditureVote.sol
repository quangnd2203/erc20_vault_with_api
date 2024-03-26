// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IExpenditureVote {
    error InvalidVote();
    error MemberIsNotExistGroup(address member);
    error AlreadyVoted(address member);
    error VotesBspInvalid();
    error VoteIsEnded();
    error InVotingDuration();
    error OutVotingDuration();

    event VoteEnded(uint8 status);
    event Voted(address member, uint8 value);
    
    function status() external view returns (uint8);
    function votesBsp() external view returns (uint);
    function deadline() external view returns (uint);

    function endVote() external;
    function vote(uint8 value) external;
}
