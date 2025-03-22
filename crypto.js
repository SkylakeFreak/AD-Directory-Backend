const pqcrypto = require("pqcrypto");
const kyber = pqcrypto.kem.kyber1024; // Use Kyber-1024 (Strongest security level)

// Key Generation
const { publicKey, secretKey } = kyber.keypair();
console.log("Public Key:", publicKey.toString("hex"));
console.log("Secret Key:", secretKey.toString("hex"));

// Encryption (Encapsulation)
const { cipherText, sharedSecret: senderSecret } = kyber.encapsulate(publicKey);
console.log("Ciphertext:", cipherText.toString("hex"));
console.log("Sender's Shared Secret:", senderSecret.toString("hex"));

// Decryption (Decapsulation)
const receiverSecret = kyber.decapsulate(cipherText, secretKey);
console.log("Receiver's Shared Secret:", receiverSecret.toString("hex"));

// Check if both shared secrets match
console.log("Key Agreement Successful:", senderSecret.equals(receiverSecret));
