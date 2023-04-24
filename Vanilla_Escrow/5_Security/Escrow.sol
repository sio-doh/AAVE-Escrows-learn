// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter; 

    constructor(address _arbiter, address _beneficiary) payable {
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    } 

    function approve() external { 
        require(msg.sender == arbiter, "Only the arbiter may call approve");
        payable(beneficiary).transfer(address(this).balance);
    } 
}