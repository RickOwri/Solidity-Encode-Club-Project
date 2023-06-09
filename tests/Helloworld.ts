import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";


describe("HelloWorld", function () {
  let helloWorldContract: HelloWorld;
  
  beforeEach(async function () {
    
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld")    
    helloWorldContract = await helloWorldFactory.deploy() as HelloWorld    
    await helloWorldContract.deployed();
  });

  it("Should give a Hello World", async function () {
    
    const helloWorldText = await helloWorldContract.helloWorld()    
    expect(helloWorldText).to.equal("Hello World");
  });

  it("Should set owner to deployer account", async function () {
    
    const accounts = await ethers.getSigners()    
    const contractOwner = await helloWorldContract.owner()    
    expect(contractOwner).to.equal(accounts[0].address);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    
    const accounts = await ethers.getSigners()    
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should execute transferOwnership correctly", async function () {

    const accounts = await ethers.getSigners();
    const newOwner = await accounts[1].address;
    await helloWorldContract.transferOwnership(newOwner);
    const contractOwner = await helloWorldContract.owner();
    await expect(contractOwner).to.equal(newOwner);
  });

  it("Should not allow anyone other than owner to change text", async function () {

    const accounts = await ethers.getSigners();
    const contractOwner = await helloWorldContract.owner();
    await expect(helloWorldContract
      .connect(accounts[1])
      .setText("testons")).to.be.revertedWith("Caller is not the owner"); 
  });

  it("Should change text correctly", async function () {
    
    const accounts = await ethers.getSigners();
    const contractOwner = await helloWorldContract.owner();
    await helloWorldContract
      .connect(accounts[0])
      .setText("testons")
    expect(await helloWorldContract.helloWorld()).to.be.equal("testons");
    
  });

});