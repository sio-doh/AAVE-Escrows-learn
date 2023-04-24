const { assert } = require("chai");
describe('Contract', function () {
    let contract;
    let arbiter;
    let beneficiary;
    let depositor;
    beforeEach(async () => {
        [depositor, arbiter, beneficiary] = await ethers.provider.listAccounts();
        const Contract = await ethers.getContractFactory("Escrow");
        contract = await Contract.deploy(arbiter, beneficiary);
        await contract.deployed();
    });

    it('should set an arbiter', async () => {
        const _arbiter = await contract.arbiter.call();
        assert.equal(_arbiter, arbiter);
    });

    it('should set a depositor', async () => {
        const _depositor = await contract.depositor.call();
        assert.equal(_depositor, depositor);
    });

    it('should set a beneficiary', async () => {
        const _beneficiary = await contract.beneficiary.call();
        assert.equal(_beneficiary, beneficiary);
    });
});