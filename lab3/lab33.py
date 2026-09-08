from eth_account import Account

from eth_account.messages import encode_defunct

acct = Account.create()                      # NEVER use this key for real funds

print("address:", acct.address)              # TUYỆT ĐỐI không dùng khóa này cho tiền thật

msg  = encode_defunct(text="I attended Session 3 / Toi da hoc Buoi 3")
sig  = Account.sign_message(msg, acct.key)

print("r,s,v:", hex(sig.r), hex(sig.s), sig.v)

# Recover the address from the signature alone / Khôi phục địa chỉ chỉ từ chữ ký

who = Account.recover_message(msg, signature=sig.signature)

print("recovered:", who, "| match:", who == acct.address)

# Tamper 1 character / Sửa 1 ký tự

bad = encode_defunct(text="I attended Session 3 / Toi da hoc Buoi 4")

print("tampered ->", Account.recover_message(bad, signature=sig.signature))

# # Ký lần 1
# sig1 = Account.sign_message(msg, acct.key)
# print("Lan 1 r,s,v:", hex(sig1.r), hex(sig1.s), sig1.v)

# # Ký lần 2 ngay bên dưới (cùng msg, cùng khóa acct.key)
# sig2 = Account.sign_message(msg, acct.key)
# print("Lan 2 r,s,v:", hex(sig2.r), hex(sig2.s), sig2.v)