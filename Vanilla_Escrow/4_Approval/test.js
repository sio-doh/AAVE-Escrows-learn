const { assert } = require("chai");
describe('Contract', function () {
    let contract;
    let arbiter;
    let beneficiary;
    const deposit = ethers.utils.parseEther("1");
    beforeEach(async () => {
        [depositor, arbiter, beneficiary] = await ethers.provider.listAccounts();
        const Contract = await ethers.getContractFactory("Escrow");
        contract = await Contract.deploy(arbiter, beneficiary, { value: deposit });
        await contract.deployed();
    });

    it('should be funded', async () => {
        let balance = await ethers.provider.getBalance(contract.address);
        assert.equal(balance.toString(), deposit.toString());
    });

    describe("after approval", () => {
        let beforeBalance;
        before(async () => {
            beforeBalance = await ethers.provider.getBalance(beneficiary);
            const signer = await ethers.provider.getSigner(arbiter);
            await contract.connect(signer).approve();
        });

        it("should transfer balance to beneficiary", async () => {
            const after = await ethers.provider.getBalance(beneficiary);
            assert.equal(after.sub(beforeBalance).toString(), deposit.toString());
        });
    });
});