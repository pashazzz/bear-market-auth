mkdir -p ./secrets

openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout ./secrets/localhost-privkey.pem -out ./secrets/localhost-cert.pem 