// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// Kế thừa ERC721 (luật NFT) và Ownable (quyền Lớp trưởng)
contract ClassBadge is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _nextTokenId;
    mapping(uint256 => string) public studentNames;

    error EmptyName();

    constructor(address initialOwner) ERC721("ClassBadge", "CBG") Ownable(initialOwner) {}

    // Hàm đúc huy hiệu: Chỉ owner được đúc, dùng _safeMint để chống kẹt NFT
    function mint(address to, string memory studentName) external onlyOwner returns (uint256) {
        if (bytes(studentName).length == 0) revert EmptyName();
        
        uint256 tokenId = _nextTokenId++;
        studentNames[tokenId] = studentName;
        _safeMint(to, tokenId);
        
        return tokenId;
    }

    // Hàm xuất dữ liệu NFT on-chain
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId); // Báo lỗi ERC721NonexistentToken nếu NFT chưa tồn tại

        string memory studentName = studentNames[tokenId];
        
        // Tạo một bức ảnh SVG đơn giản chứa tên sinh viên
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" style="background:#2c3e50">'
            '<text x="20" y="55" fill="white" font-size="24">', studentName, '</text></svg>'
        ));
        string memory imageURI = string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg))));

        // Gói ảnh và thông tin vào 1 file JSON
        string memory json = string(abi.encodePacked(
            '{"name": "ClassBadge #', tokenId.toString(), '",',
            '"description": "On-chain proof of attendance",',
            '"attributes": [{"trait_type": "Student", "value": "', studentName, '"}],',
            '"image": "', imageURI, '"}'
        ));

        // Biến toàn bộ JSON thành mã Base64
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}