const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ClassBadge", function () {
    let Badge, badge, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        Badge = await ethers.getContractFactory("ClassBadge");
        badge = await Badge.deploy(owner.address);
    });

    it("1. Phải giải mã được metadata JSON của huy hiệu", async function () {
        // Đúc 1 huy hiệu cho addr1
        await badge.mint(addr1.address, "Hong Anh");
        
        // Lấy dữ liệu của huy hiệu số 0
        const uri = await badge.tokenURI(0);
        
        // Giải mã Base64 thành chữ đọc được trong JavaScript
        const jsonBase64 = uri.split(",")[1];
        const jsonString = Buffer.from(jsonBase64, "base64").toString("utf8");
        const meta = JSON.parse(jsonString);

        // Kiểm tra xem dữ liệu có khớp không
        expect(meta.name).to.equal("ClassBadge #0");
        expect(meta.attributes.find(a => a.trait_type === "Student").value).to.equal("Hong Anh");
    });

    it("2. Phải báo lỗi EmptyName nếu tên bị bỏ trống", async function () {
        await expect(badge.mint(addr1.address, ""))
            .to.be.revertedWithCustomError(badge, "EmptyName");
    });
});