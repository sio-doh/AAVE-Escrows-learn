// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter; 

    constructor(address _arbiter, address _beneficiary) {
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    }
}