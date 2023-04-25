//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.5; // 0.7.5;

import "./IERC20.sol";
import "./IWETHGateway.sol";

contract Escrow {
    address arbiter;
    address depositor;
    address beneficiary;

    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        gateway.depositETH{value: address(this).balance}(address(this), 0);
    }

    function approve() external {
        require(msg.sender == arbiter); 
        aWETH.approve(address(gateway), aWETH.balanceOf(address(this)));
    }  

    function withdrawETH() external payable {
        gateway.withdrawETH(address(this), 0);
    }

    receive() external payable {
        gateway.depositETH{value: msg.value}(address(this), 0);
    }
}