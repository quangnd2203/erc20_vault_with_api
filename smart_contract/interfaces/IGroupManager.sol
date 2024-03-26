// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IGroupManager {
    event GroupCreated(address indexed groupAddress, string groupName, address indexed owner);

    error GroupOwnerAddressInvalid();

    function createGroup(address groupOwner, string memory groupName) external;
}
