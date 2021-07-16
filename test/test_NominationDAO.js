// import { assert } from "chai";

// Example test script - Uses Mocha and Ganache
// @ts-ignore
const NominationDAO = artifacts.require("NominationDAO");

const ALITH = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";
const ALITH_PRIV_KEY = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
const BALTATHAR = "0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0";
const BALTATHAR_PRIV_KEY =
  "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b";
const CHARLETH = "0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc";
const CHARLETH_PRIV_KEY =
  "0x0b6e18cafb6ed99687ec547bd28139cafdd2bffe70e6b688025de6b445aa5c5b";
const DOROTHY = "0x773539d4Ac0e786233D90A233654ccEE26a613D9";
const DOROTHY_PRIV_KEY =
  "0x39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68";

contract('NominationDAO', accounts => {
    let nominationDAO;
    // const _totalSupply = "8000000000000000000000000";
    beforeEach(async () => {
        // Deploy token contract
        nominationDAO = await NominationDAO.new(ALITH, BALTATHAR, { from: accounts[0] });
    });
    // Check MinNominatorStk
    it("checks MinNominatorStk adn target", async () => {
        const minNominatorStk = await nominationDAO.MinNominatorStk.call();
        assert.equal(Number(minNominatorStk), 5000000000000000000, 'minNominatorStk is wrong');

        const target = await nominationDAO.target.call();
        assert.equal(target, ALITH, 'minNominatorStk is wrong');
    });

    // Check the balance of the owner of the contract
    // it("should return the balance of token owner", async () => {
    //     const balance = await token.balanceOf.call(accounts[0]);
    //     assert.equal(balance, _totalSupply, 'balance is wrong');
    // });

    // // Transfer token and check balances
    // it("should transfer token", async () => {
    //     const amount = "1000000000000000000";
    //     // Transfer method
    //     await token.transfer(accounts[1], amount, { from: accounts[0] });
    //     balance1 = await token.balanceOf.call(accounts[1]);
    //     assert.equal(balance1, amount, 'accounts[1] balance is wrong');
    // });

    // // Set an allowance to an account, transfer from that account, check balances
    // it("should give accounts[1] authority to spend accounts[0]'s token", async () => {
    //     const amountAllow = "10000000000000000000";
    //     const amountTransfer = "1000000000000000000";

    //     // Approve accounts[1] to spend from accounts[0]
    //     await token.approve(accounts[1], amountAllow, { from: accounts[0] });
    //     const allowance = await token.allowance.call(accounts[0], accounts[1]);
    //     assert.equal(allowance, amountAllow, 'allowance is wrong');

    //     // Transfer tokens and check new balances
    //     await token.transferFrom(accounts[0], accounts[2], amountTransfer, { from: accounts[1] });
    //     const balance1 = await token.balanceOf.call(accounts[1]);
    //     assert.equal(balance1, 0, 'accounts[1] balance is wrong');
    //     const balance2 = await token.balanceOf.call(accounts[2]);
    //     assert.equal(balance2, amountTransfer, 'accounts[2] balance is wrong');
    // })
});
