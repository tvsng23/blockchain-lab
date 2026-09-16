from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

# Kết nối với mạng TrustKeys L1 testnet thông qua RPC URL
w3 = Web3(Web3.HTTPProvider("https://l1testnet.trustkeys.network"))

# Bắt buộc thêm middleware này vì mạng PoA có cấu trúc khối hơi khác với mạng gốc
w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

# Lấy dữ liệu của block mới nhất
blk = w3.eth.get_block("latest")
print(f"baseFeePerGas = {blk['baseFeePerGas']} wei")

# Lấy lịch sử phí của 20 block gần nhất, [10, 50, 90] là các mốc percentile của tip mà ta muốn biết
fh = w3.eth.fee_history(20, "latest", [10, 50, 90])

# In dữ liệu ra màn hình
print(f"{'Block Number':<15} | {'Base Fee (wei)':<15} | {'Gas Used Ratio':<15}")
print("-" * 50)
for i, base in enumerate(fh["baseFeePerGas"][:-1]):
    block_num = fh["oldestBlock"] + i
    ratio = fh["gasUsedRatio"][i]
    print(f"{block_num:<15} | {base:<15} | {ratio:.2%}")

avg_ratio = sum(fh["gasUsedRatio"]) / len(fh["gasUsedRatio"])
if avg_ratio > 0.5:
    print("\n=> Verdict: chain is BUSY (avg ratio > 50%)")
else:
    print("\n=> Verdict: chain is QUIET (avg ratio < 50%)")