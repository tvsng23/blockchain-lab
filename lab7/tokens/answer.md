Q1: Why do we build on OpenZeppelin instead of writing ERC-20 from scratch?
> Vì các đoạn mã của OpenZeppelin đã được kiểm toán bảo mật kỹ lưỡng, thử nghiệm thực tế nhiều lần và kiểm tra phí gas. Việc này giúp giảm thiểu rủi ro xuất hiện lỗi (bugs) so với việc tự viết mã từ con số 0.

Q2: decimals() returns 18. If Alice's balance is 1000000000000000000, how many CTK is that, and where does the "18" actually live on-chain or in the UI?
> Số dư đó tương đương với 1 CTK. Con số 18 chỉ là siêu dữ liệu phục vụ việc hiển thị trên giao diện người dùng (UI). Trên mạng lưới (on-chain), mọi giá trị đều được xử lý và lưu trữ dưới dạng đơn vị số nguyên cơ sở.

Q3: Why does a DEX need approve + transferFrom instead of a plain transfer? What is the risk of approve(spender, 2256-1)?
> Lệnh transfer thông thường không kích hoạt mã nguồn của hợp đồng nhận, nên sàn DEX không thể phản hồi lại giao dịch; trong khi đó, transferFrom cho phép sàn chủ động "kéo" tiền bên trong chính giao dịch hoán đổi của nó. Việc cấp hạn mức vô hạn (infinite approval) tiềm ẩn rủi ro rất lớn: nếu hợp đồng được cấp quyền bị tin tặc tấn công, chúng có thể rút sạch toàn bộ số dư trong ví của bạn.

Q4: Where do the JSON and the image live? What did we avoid by NOT using IPFS on TrustKeys?
> Cả dữ liệu JSON và hình ảnh đều được lưu trữ trực tiếp bên trong bộ nhớ hoặc mã byte (storage/bytecode) của chính hợp đồng. Việc không sử dụng IPFS giúp dự án tránh được sự phụ thuộc vào các dịch vụ lưu trữ (pinning service) của bên thứ ba để duy trì dữ liệu.

Q5: What does the "safe" in _safeMint / safeTransferFrom actually check, and why?
> Chữ "safe" sẽ kiểm tra xem hợp đồng nhận có triển khai hàm onERC721Received hay không. Việc này đảm bảo NFT không bị gửi nhầm và kẹt vĩnh viễn trong những hợp đồng không có khả năng luân chuyển chúng.

Q6: TrustKeys has no public explorer. How did you confirm the 100-CTK transfer landed?
> Việc xác nhận được thực hiện thông qua các lệnh gọi đọc dữ liệu (view calls) của thư viện ethers như hàm balanceOf (và thông qua nhật ký sự kiện), tương tự như cơ chế hiển thị số dư của ví MetaMask.

Q7: What stops someone from replaying your permit signature on a second chain or a second time?
> Chữ ký điện tử đã được khóa chặt với ID của mạng lưới (chainId), địa chỉ của hợp đồng, số thứ tự giao dịch đếm theo từng chủ sở hữu (nonce), và thời hạn chót (deadline). Bất kỳ sự thay đổi nào về mạng lưới hoặc nỗ lực sử dụng lại đều làm chữ ký trở nên không hợp lệ