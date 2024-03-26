// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import './IFund.sol';

interface IGroup {

    error MemberIsNotExistGroup(address member);
    error MemberAlreadyExist(address member);
    error CallerIsNotManagers(address member);
    error CallerCanNotRemoveItself(address member);
    error MemberIsNotSubOwner(address member);
    error OwnerCanNotAssignItself(address member);
    error MemberIsAlreadySubOwner(address member);
    error FundIsNotExistGroup(address fund);
    error NotEnoughFundBalance(address fund, uint256 amount);
    error AmountIsZero();

    event MemberAdded(address member);
    event MemberRemoved(address member);
    event AssignSubOwners(address member);
    event UnAssignSubOwners(address member);
    event ExpenditureVoteCreated(address expenditureVoteAddress, address fundAddress);
    event FundCreated(address fund);
    event DestroyGroup();

    function members() external view returns (address[] memory);
    function standardMembers() external view returns (address[] memory);
    function subOwners() external view returns (address[] memory);
    function isMember(address member) external view returns (bool);
    function isManagers(address member) external view returns (bool);
    function getAllVotes() external view returns (address[] memory);
    function funds() external view returns (address[] memory);

    function createFund() external;
    function addMember(address newMember) external;
    function removeMember(address member) external;
    function leaveGroup() external;
    function allocateFunds(address fundAddress, uint amount, uint votingDuration, uint votesBsp) external;
    function assignMemberToSubOwners(address member) external;
    function unAssignSubOwners(address subOwner) external;
}
