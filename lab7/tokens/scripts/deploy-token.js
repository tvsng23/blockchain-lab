const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Đang triển khai hợp đồng với tài khoản:", deployer.address);

    const Token = await hre.ethers.getContractFactory("ClassToken");
    const token = await Token.deploy(deployer.address);

    await token.waitForDeployment();
    console.log("ClassToken đã được triển khai thành công tại địa chỉ:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});