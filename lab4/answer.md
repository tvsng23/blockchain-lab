Q1: Target có khoảng bao nhiêu chữ số hex 0 dẫn đầu? Một header hợp lệ đại diện cho ~2^? phép băm?
> Số số 0 dẫn đầu: Với bits = 0x17034219, target sinh ra sẽ có chính xác 19 chữ số hex 0 dẫn đầu. Cách tính: Toàn bộ chuỗi hash dài 32 byte (64 ký tự hex). Tham số exponent = 0x17 (23) cho biết dữ liệu thực tế chiếm 23 byte. Vậy số byte 0 dẫn đầu là 32 - 23 = 9 byte (tương đương 18 ký tự hex 0). Kết hợp thêm với số 0 ở đầu của phần mantissa (là 03), ta có tổng cộng 19 chữ số hex 0.

> Số phép băm: Khoảng không gian băm là 2^256. Giá trị target rơi vào khoảng 2^177. Do đó, một khối lượng công việc (PoW) hợp lệ đại diện cho khoảng 2^79 phép băm thử.

Q2:  Kiểm PoW chỉ tốn 2 lần băm; tìm ra nó tốn cả mạng ~10 phút. Tính chất nào của SHA-256 tạo ra bất đối xứng này? 
> Tính chất Kháng nghịch ảnh (Pre-image resistance) hay tính "một chiều" (One-way). Việc tính toán xuôi từ dữ liệu ra mã băm diễn ra cực kỳ nhanh (độ phức tạp O(1)), nhưng việc dịch ngược từ mã băm để tìm lại dữ liệu ban đầu là bất khả thi. Mạng lưới buộc phải tìm kiếm theo phương pháp vét cạn (brute-force) bằng cách thay đổi giá trị nonce liên tục, đòi hỏi một năng lực tính toán vật lý khổng lồ.

Q3:  Giao dịch này trả ~3,6 triệu sat/vB (≈ 6,73 BTC phí cho 187 vB!). Nhìn ngày tháng: chuyện gì đang diễn ra, và nó dạy gì về cách phí hình thành? (Hint / Gợi ý: halving day + Runes launch → mempool auction.)
> Block 840,000 là một cột mốc lịch sử đánh dấu sự kiện Halving lần thứ 4 của Bitcoin. Cùng lúc đó, giao thức Runes được ra mắt trên mạng lưới. Người dùng đã đổ xô vào Mempool để đấu giá mức phí cực cao nhằm giành quyền ghi (mint) token lên đúng block lịch sử này. Điều này cho thấy thị trường phí (fee market) hoàn toàn do quy luật Cung - Cầu quyết định chứ không dựa trên số tiền giao dịch gửi đi.

Q4: Tổng output coinbase là 4.075.061.499 sat; trợ cấp là 312.500.000 sat. Phần chênh từ đâu ra?
> Phần chênh lệch lên tới 3,762,561,499 satoshi (khoảng 37.62 BTC) chính là tổng phí giao dịch (Transaction Fees) mà toàn bộ người dùng đã trả để được thợ đào ưu tiên gói vào block này.

Q5: Root tính được khớp header. Giải thích trong 2–3 câu điều đó chứng minh gì về danh sách giao dịch của block, nêu rõ tính chất băm liên quan.
> Điều này cung cấp bằng chứng toán học rằng danh sách các giao dịch và thứ tự của chúng chưa hề bị thay đổi. Bằng chứng này dựa trên tính chất Kháng va chạm (Collision resistance) và Hiệu ứng tuyết lở (Avalanche effect) của hàm băm mật mã. Bất kỳ một sự thay đổi nào dù chỉ ở 1 bit dữ liệu của một giao dịch đơn lẻ cũng sẽ khiến gốc Merkle thay đổi hoàn toàn, làm cho khối trở nên không hợp lệ.