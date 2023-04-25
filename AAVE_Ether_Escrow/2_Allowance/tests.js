const { assert } = require("chai");

describe("Escrow", function () {
    let escrow;
    let aWETH;
    let arbiter;
    let beneficiary;
    const deposit = ethers.utils.parseEther("1");
    const wethGatewayAddress = "0xDcD33426BA191383f1c9B431A342498fdac73488";
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

    describe('approving as the beneficiary', () => {
        it('should not be allowed', async () => {
            let ex;
            try {
                const signer = await ethers.provider.getSigner(beneficiary);
                await escrow.connect(signer).approve();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "expected the transaction to revert when the beneficiary calls approve!");
        });
    });

    describe('after approving', () => {
        before(async () => {
            const thousandDays = 1000 * 24 * 60 * 60;
            await hre.network.provider.request({
                method: "evm_increaseTime",
                params: [thousandDays]
            });
            const arbiterSigner = await ethers.provider.getSigner(arbiter);
            await escrow.connect(arbiterSigner).approve();
        });

        it('should give the WETH gateway allowance to spend the initial deposit', async () => {
            const allowance = await aWETH.allowance(escrow.address, wethGatewayAddress);
            assert(allowance.gte(deposit), "Expected an allowance on the WETH Gateway");
        });
    });
});