const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundle } = require("moonbeam-types-bundle");
const Web3 = require('web3');

// Example test script - Uses Mocha and Ganache
// @ts-ignore
const NominationDAO = artifacts.require("NominationDAO");

const ALITH = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";
const ALITH_PRIV_KEY = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
const BALTATHAR = "0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0";
const BALTATHAR_PRIV_KEY = "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b";
const CHARLETH = "0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc";
const CHARLETH_PRIV_KEY = "0x0b6e18cafb6ed99687ec547bd28139cafdd2bffe70e6b688025de6b445aa5c5b";
const DOROTHY = "0x773539d4Ac0e786233D90A233654ccEE26a613D9";
const DOROTHY_PRIV_KEY = "0x39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68";

const WS_PORT = "9944";

const MIN_NOMINATOR_STAKE = 5000000000000000000;

// Alith admin
const ADMIN = CHARLETH;
// Baltathar member
const MEMBER = BALTATHAR;
// Charleth target
const COLLATOR = ALITH;

contract("NominationDAO", (accounts) => {
  let nominationDAO;
  let api;
  beforeEach(async () => {
    // Deploy token contract
    nominationDAO = await NominationDAO.new(COLLATOR, ADMIN, { from: accounts[0] });
    // console.log("nominationDAO",Object.keys(nominationDAO))
    console.log("nominationDAO.address", nominationDAO.address);
    api = await ApiPromise.create({
      initWasm: false,
      provider: new WsProvider(`ws://localhost:${WS_PORT}`),
      typesBundle: typesBundle,
    });
  });
  // Check MinNominatorStk
  it("checks MinNominatorStk, target and admin", async () => {
    const minNominatorStk = await nominationDAO.MinNominatorStk.call();
    assert.equal(Number(minNominatorStk), MIN_NOMINATOR_STAKE, "minNominatorStk is wrong");

    const target = await nominationDAO.target.call();
    assert.equal(target, COLLATOR, "target is wrong");

    const DEFAULT_ADMIN_ROLE = await nominationDAO.DEFAULT_ADMIN_ROLE.call();
    assert.equal(
      await nominationDAO.hasRole.call(DEFAULT_ADMIN_ROLE, ADMIN),
      true,
      "admin is wrong"
    );
    assert.equal(
      ADMIN===accounts[0],
      true,
      "admin is wrong"
    );

    const MEMBER = await nominationDAO.MEMBER.call();
    assert.equal(
      await nominationDAO.hasRole.call(MEMBER, ADMIN),
      true,
      "MEMBER is wrong"
    );
  });

  // Check no nomination and no update possible funds avaiable
  it("Check no nomination and no update possible funds avaiable", async () => {
    const nominators = await api.query.parachainStaking.nominatorState(COLLATOR);
    console.log("nominators", nominators.toHuman());
    expect(nominators.toHuman() === null).to.equal(true, "there should be no nominator");
    try {
      await nominationDAO.update_nomination(COLLATOR, { from: accounts[0] });
    } catch (e) {
      // console.log("caught", e, "+" + e.message + "+");
      assert.equal(true, true, "tx didn't throw error");
    }

    const nominatorsAfter = await api.query.parachainStaking.nominatorState(COLLATOR);
    console.log("nominatorsAfter", nominatorsAfter.toHuman());
    expect(nominatorsAfter.toHuman() === null).to.equal(
      true,
      "nomination shouldn't have gone through"
    );
  });

  it("should have succesfully nominated COLLATOR", async function () {
    // const keyring = new Keyring({ type: "ethereum" });
    // const ethan = await keyring.addFromUri(ETHAN_PRIVKEY, null, "ethereum");
    // await context.polkadotApi.tx.parachainStaking
    //   .nominate(ALITH, MIN_GLMR_NOMINATOR, 0, 0)
    //   .signAndSend(ethan);
    // await context.createBlock();
    await nominationDAO.add_stake({ from: accounts[0], value: 2*MIN_NOMINATOR_STAKE });
    console.log("stake added");
    const web3=new Web3("http://localhost:9933/")
    const adminStake = await nominationDAO.memberStakes.call(accounts[0]);
    assert.equal(Number(adminStake), 2*MIN_NOMINATOR_STAKE, "adminStake is wrong");
    // console.log(Object.keys(nominationDAO))
    // console.log(Object.keys(nominationDAO.methods))
    console.log(await web3.eth.getBalance(nominationDAO.address))
    console.log((await api.query.parachainStaking.candidatePool()).toHuman())
    await nominationDAO.update_nomination(COLLATOR, { from: accounts[0] });

    const nominators = await api.query.parachainStaking.nominatorState(COLLATOR);
    console.log("nominators", nominators);
    expect(nominators.toHuman().nominations[0].owner === ALITH).to.equal(
      true,
      "nomination didnt go through"
    );
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
