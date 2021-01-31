async function main() {
  const factory = await ethers.getContractFactory("SwapETH");
  const contract = await factory.deploy();

  console.log("Deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
