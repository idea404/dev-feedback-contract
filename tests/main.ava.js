import { Worker, NEAR } from 'near-workspaces';
import test from 'ava';

test.beforeEach(async (t) => {
  const worker = await Worker.init();

  const root = worker.rootAccount;

  const alice = await root.createSubAccount("alice", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });
  const contract = await root.createSubAccount("contract", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  await contract.deploy("./build/contract.wasm");

  t.context.worker = worker;
  t.context.accounts = { root, contract, alice };
});

test.afterEach(async (t) => {
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("send one message and retrieve it", async (t) => {
    const { alice, contract } = t.context.accounts;
    
    await alice.call(
        contract,
        "add_new_feedback",
        { title: "Hello", text: "World" },
        { attachedDeposit: NEAR.parse("1 N").toJSON() }
    );

    const msgs = await contract.view("get_feedback_messages");
    const expected = [
      {
        title: "Hello",
        text: "World",
        author: alice.accountId,
        dateTime: '0',
        replies: []
      },
    ];
    t.deepEqual(expected, msgs);
});