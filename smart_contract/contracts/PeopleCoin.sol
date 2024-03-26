// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts/metatx/ERC2771Context.sol';

contract PeopleCoin is ERC20('People Coin', 'PPCB'), ERC20Burnable, Ownable(msg.sender), ERC2771Context {

    uint256 public immutable maxcap;

    error ERC20SenderNotEnoughBalance(address sender, uint256 value);

    error ERC20ExceedMaxCap(uint256 value);

    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return super._contextSuffixLength();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return super._msgData();
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return super._msgSender();
    }

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {
        uint _ether = 10 ** uint256(18);
        maxcap = 50_000_000_000 * _ether;
        _mint(owner(), maxcap);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        if (totalSupply() + amount > maxcap) {
            revert ERC20ExceedMaxCap(amount);
        }
        _mint(to, amount);
    }

    function transfer(address to, uint256 value) public virtual override returns (bool) {
        address sender = _msgSender();
        uint256 senderBalance = balanceOf(sender);
        if (senderBalance < value) {
            revert ERC20InsufficientBalance(sender, balanceOf(sender), value);
        }
        _transfer(sender, to, value);
        return true;
    }
}
