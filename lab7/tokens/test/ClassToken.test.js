const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ClassToken", function () {
    let Token, token, owner, addr1, addr2;

    // Đoạn này chạy trước mỗi kịch bản: Tạo 3 ví ảo và đúc token
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("ClassToken");
        token = await Token.deploy(owner.address);
    });

    it("1. Kịch bản cơ bản: Tên, ký hiệu và 1 triệu token ban đầu phải chính xác", async function () {
        expect(await token.name()).to.equal("ClassToken");
        expect(await token.symbol()).to.equal("CTK");
        
        const decimals = await token.decimals();
        const cap = await token.cap();
        // Kiểm tra trần 1 triệu
        expect(cap).to.equal(ethers.parseUnits("1000000", decimals));
        // Kiểm tra ví owner nhận đủ 1 triệu
        expect(await token.balanceOf(owner.address)).to.equal(cap);
    });

    it("2. Kịch bản chuyển tiền: Chuyển 100 CTK thành công và lưu lại biên lai", async function () {
        // Owner tự chuyển 100 CTK cho addr1
        await expect(token.transfer(addr1.address, 100))
            .to.emit(token, "Transfer")
            .withArgs(owner.address, addr1.address, 100);
        
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("3. Kịch bản chống lỗi: Báo lỗi nếu ví không có tiền mà đòi chuyển", async function () {
        // addr1 chưa có tiền nhưng đòi chuyển 50 CTK lại cho owner
        await expect(token.connect(addr1).transfer(owner.address, 50))
            .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("4. Kịch bản ủy quyền (DEX): Cho phép rút và tự động trừ hạn mức", async function () {
        // Owner ký giấy ủy quyền cho addr1 được phép rút tối đa 500 CTK
        await token.approve(addr1.address, 500);
        
        // addr1 chủ động "kéo" 200 CTK từ ví owner sang ví addr2
        await token.connect(addr1).transferFrom(owner.address, addr2.address, 200);
        
        // Kiểm tra xem addr2 đã nhận được tiền chưa, và hạn mức của addr1 có tụt xuống còn 300 không
        expect(await token.balanceOf(addr2.address)).to.equal(200);
        expect(await token.allowance(owner.address, addr1.address)).to.equal(300);
    });
});