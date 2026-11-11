import http.server
import ssl
import threading
import subprocess
import os

# 確保產生本地自簽憑證供 iPhone Safari 開啟 HTTPS 相機權限
CERT_FILE = "localhost_cert.pem"
KEY_FILE = "localhost_key.pem"

def generate_self_signed_cert():
    if os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE):
        return True
    try:
        # 嘗試使用系統內建 openssl 產生自簽憑證
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:2048",
            "-keyout", KEY_FILE, "-out", CERT_FILE,
            "-days", "365", "-nodes",
            "-subj", "/CN=10.202.20.52"
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception:
        return False

def run_http():
    server = http.server.ThreadingHTTPServer(("0.0.0.0", 8080), http.server.SimpleHTTPRequestHandler)
    print("HTTP Server running on http://0.0.0.0:8080")
    server.serve_forever()

def run_https():
    if not generate_self_signed_cert():
        print("OpenSSL not found, skipping HTTPS port 8443.")
        return
    server = http.server.ThreadingHTTPServer(("0.0.0.0", 8443), http.server.SimpleHTTPRequestHandler)
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)
    server.socket = ctx.wrap_socket(server.socket, server_side=True)
    print("HTTPS Server running on https://0.0.0.0:8443")
    server.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=run_https, daemon=True)
    t.start()
    run_http()
