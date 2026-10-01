const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    // Khai báo địa chỉ ClassBadge của bạn
    const badgeAddress = "0xBc337da631f7d7E6E283070609000A011e58F063"; 

    // Kết nối với hợp đồng trên mạng
    const badge = await hre.ethers.getContractAt("ClassBadge", badgeAddress);

    console.log("1. Đang đúc Huy hiệu...");
    // Đúc thẻ mang tên Hồng Ánh
    const mintTx = await badge.mint(owner.address, "Hong Anh");
    await mintTx.wait(); // Chờ giao dịch được đưa vào block
    console.log("Đúc thành công!");

    console.log("2. Đang giải mã dữ liệu Huy hiệu số 0...");
    const uri = await badge.tokenURI(0);

    // Bóc tách và giải mã chuỗi Base64
    const jsonBase64 = uri.split(",")[1];
    const jsonString = Buffer.from(jsonBase64, "base64").toString("utf8");
    
    console.log("Kết quả dữ liệu On-chain:");
    console.log(JSON.parse(jsonString));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});