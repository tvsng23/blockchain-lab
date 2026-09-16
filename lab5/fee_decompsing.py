from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

w3 = Web3(Web3.HTTPProvider("https://l1testnet.trustkeys.network"))
w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

# ĐIỀN TXID CỦA BẠN VÀO ĐÂY
h = "0x7d57332f8c4ced5871a78533aed9c5940641325e5a5f2721b4a0a73b60d3191b" 

tx = w3.eth.get_transaction(h)
rcpt = w3.eth.get_transaction_receipt(h)
blk = w3.eth.get_block(rcpt["blockNumber"])

base_fee = blk["baseFeePerGas"]
gas_used = rcpt["gasUsed"]
eff_price = rcpt["effectiveGasPrice"]

paid = gas_used * eff_price
burned = gas_used * base_fee
tip = gas_used * (eff_price - base_fee)

print(f"Tổng phí đã trả (Paid)   : {paid} wei")
print(f"Phần bị đốt (Burned)     : {burned} wei (Rời khỏi lưu thông)")
print(f"Tiền bo cho thợ đào (Tip): {tip} wei")
print(f"\nKiểm tra phương trình paid == burned + tip: {paid == burned + tip}")