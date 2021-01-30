const { expect } = require("chai");

describe("SwapETH", function() {
  it("Should set owner when deployed", async function() {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("SwapETH");
    const contract = await factory.deploy();

    expect(await contract.owner()).to.equal(owner.address);
  });
});
