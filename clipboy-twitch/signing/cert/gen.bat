# ZXPSignCmd.exe does not like including the intermediate cert, will probably fail to verify on most systems
# https://gist.github.com/novemberborn/4eb91b0d166c27c2fcd4
openssl req -new -x509 -key privkey.pem -out chain.pem -outform pem
openssl pkcs12 -export -inkey privkey.pem -in chain.pem -CAfile ../entrustg2.ca.pem -out ../cert.p12