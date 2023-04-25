const { assert } = require("chai");

describe("Escrow", function () {
    let escrow;
    let aWETH;
    let arbiter;
    let beneficiary;
    const deposit = ethers.utils.parseEther("1");
    before(async () => {
        const Escrow = await ethers.getContractFactory("Escrow");
        [depositor, arbiter, beneficiary] = await ethers.provider.listAccounts();
        escrow = await Escrow.deploy(arbiter, beneficiary, { value: deposit });
        await escrow.deployed();
        aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
    });

    it("should not have an ether balance", async function () {
        const balance = await ethers.provider.getBalance(escrow.address);
        assert.equal(balance.toString(), "0");
    });

    it("should have aWETH", async function () {
        const balance = await aWETH.balanceOf(escrow.address);
        assert.equal(balance.toString(), deposit.toString());
    });
});