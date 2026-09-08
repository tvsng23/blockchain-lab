Q1 / Câu hỏi 1: Each extra leading zero multiplies expected work by ≈ how much? Why? / Mỗi số 0 thêm vào nhân khối lượng tính toán kỳ vọng lên ≈ bao nhiêu lần? Vì sao?

- Nhân lên 16 lần.
- Vì hàm SHA-256 trả về kết quả dạng hệ cơ số 16 (gồm các kí tự 0-9, a-f). Xác suất để một ký tự ngẫu nhiên là số 0 trong hệ Hex là 1/16. Tổng quát, để có k số 0 ở đầu, xác suất là (1/16)^k. Do đó khi tăng độ khó thêm một số 0, khối lượng tính toán kì vọng nhiều hơn trung bình 16 lần.

Q2 / Câu hỏi 2: Verifying your found nonce takes how many hash calls? What does this say about PoW? / Kiểm tra nonce tìm được tốn mấy lần gọi băm? Điều đó nói gì về PoW?

- Việc kiểm tra nonce tìm được chỉ tốn đúng 1 lần gọi băm.
- Đây chính là tính chất bất đối xứng cốt lõi (Asymmetry) của Proof-of-Work: Rất khó để giải (tốn nhiều thời gian và năng lượng), nhưng cực kỳ dễ để kiểm chứng. Nhờ đó, bất kỳ node nào trên mạng cũng có thể nhanh chóng xác nhận khối mới (tốn O(1)) thay vì phải tự chạy lại quá trình đào (tốn O(N)).

Q3 / Câu hỏi 3: For n = 1,000,000 transactions, how many hashes does one proof contain? / Với n = 1.000.000 giao dịch, một proof chứa bao nhiêu giá trị băm?

- Một proof sẽ chứa [log_2(1,000,000)] = 20 giá trị băm. Vì cấu trúc là cây nhị phân, độ dài đường dẫn từ lá lên gốc chính là chiều cao của cây

Q4 / Câu hỏi 4: Explain one real system that uses exactly this mechanism (SPV, airdrop claim, proof-of-reserves…). / Nêu một hệ thống thực dùng đúng cơ chế này.

- Giao thức SPV (Simplified Payment Verification) trên các ví Bitcoin nhẹ chạy trên điện thoại di động. Ngoài ra, cơ chế này cũng được dùng để Claim Airdrop trên Ethereum: Smart Contract chỉ lưu trữ đúng Merkle Root của toàn bộ danh sách địa chỉ nhận thưởng. Người dùng khi claim phải gửi kèm Merkle Proof, Smart Contract sẽ chạy hàm verify_proof để kiểm tra.

Task 1: Run twice with the same message — is the signature identical? Which RFC explains this? / Chạy hai lần cùng thông điệp — chữ ký có giống nhau không? RFC nào giải thích điều này?

- Kết quả chữ ký in ra (gồm 3 tham số r, s, v) ở cả hai lần gọi là giống hệt nhau hoàn toàn.
- Giải thích (RFC 6979): Bình thường, thuật toán ECDSA yêu cầu sinh ra một tham số ngẫu nhiên k cho mỗi lần ký. Nếu sinh ngẫu nhiên, hai lần ký cùng một thông điệp sẽ phải cho ra 2 chữ ký khác nhau.Tuy nhiên, thư viện của Ethereum áp dụng chuẩn RFC 6979 ("Deterministic k" - Khắc phục bằng k tất định). Chuẩn này không dùng hàm random() của máy tính nữa (vì sợ bộ sinh số ngẫu nhiên bị lỗi, làm lộ Private Key). Thay vào đó, nó tính k bằng một hàm băm kết hợp giữa Khóa bí mật (d) và Thông điệp (m).Do cả Khóa bí mật và Thông điệp ở 2 lần gọi hàm đều không đổi, nên k sinh ra không đổi, dẫn đến chữ ký (r, s, v) là hoàn toàn giống nhau. Điều này loại bỏ hoàn toàn bẫy "lỗi số ngẫu nhiên".

Task 2: Show the TA: the tampered message recovers a different address. Explain why this proves integrity. / Cho trợ giảng xem: thông điệp bị sửa khôi phục ra địa chỉ khác. Giải thích vì sao đây là bằng chứng toàn vẹn.

- Hàm recover_message lấy thuật toán đường cong Elliptic tính toán ngược dựa trên chữ ký S(r,s,v) và mã băm của thông điệp H(msg). Nếu dữ liệu thông điệp bị thay đổi dù chỉ 1 ký tự, kết quả hàm băm H(bad) sẽ thay đổi hoàn toàn (hiệu ứng tuyết lở). Khi đưa H(bad) và chữ ký cũ vào giải phương trình khôi phục điểm trên đường cong, nó sẽ sinh ra một Public Key hoàn toàn ngẫu nhiên và không xác định, dẫn đến địa chỉ trả về sai lệch hoàn toàn so với địa chỉ gốc (match: False). Sự sai lệch này lập tức báo hiệu cho mạng lưới biết dữ liệu gốc đã bị chỉnh sửa (giả mạo), qua đó đảm bảo tính toàn vẹn (Integrity) của dữ liệu.
