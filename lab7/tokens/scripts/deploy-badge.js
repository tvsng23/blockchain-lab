const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Đang triển khai hợp đồng với tài khoản:", deployer.address);

    const Badge = await hre.ethers.getContractFactory("ClassBadge");
    const badge = await Badge.deploy(deployer.address);

    await badge.waitForDeployment();
    console.log("ClassBadge đã được triển khai thành công tại địa chỉ:", await badge.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});