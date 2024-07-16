// Function to log messages to the output element
function logMessage(message) {
    const outputElement = document.getElementById('output')
    outputElement.textContent += message + '\n'
}

// Initialize the module when the button is clicked
document
    .getElementById('initializeButton')
    .addEventListener('click', async () => {
        logMessage('Starting module initialization...')

        try {
            const { default: createModule } = await import('./eoc-tfhelib.js')

            const Module = await createModule()

            Module.onRuntimeInitialized = () => {
                logMessage('Module initialized successfully.')

                // Generate a secret key
                const base64SecretKey = Module.generateSecretKey()
                logMessage('Generated Secret Key: OK')

                // Generate a public key from the secret key
                const base64PublicKey =
                    Module.generatePublicKey(base64SecretKey)
                logMessage('Generated Public Key: OK')

                // Encrypt integers using the secret key
                const valueToEncrypt1 = 7
                const valueToEncrypt2 = 5
                const encryptedValue1 = Module.encryptInteger(
                    valueToEncrypt1,
                    base64SecretKey
                )
                const encryptedValue2 = Module.encryptInteger(
                    valueToEncrypt2,
                    base64SecretKey
                )
                logMessage('Encrypted Value 1: OK')
                logMessage('Encrypted Value 2: OK')

                // Encrypt a string using the secret key
                const stringToEncrypt = 'Hello, World!'
                const encryptedString = Module.encryptString(
                    stringToEncrypt,
                    base64SecretKey
                )
                logMessage('Encrypted String: OK')

                // Perform addition on encrypted values
                const encryptedSum = Module.addCiphertexts(
                    encryptedValue1,
                    encryptedValue2,
                    base64PublicKey
                )
                logMessage('Encrypted Sum: OK')

                // Perform subtraction on encrypted values
                const encryptedDiff = Module.subtractCiphertexts(
                    encryptedValue1,
                    encryptedValue2,
                    base64PublicKey
                )
                logMessage('Encrypted Difference: OK')

                // Decrypt the results using the secret key
                const decryptedSum = Module.decryptInteger(
                    encryptedSum,
                    base64SecretKey
                )
                const decryptedDiff = Module.decryptInteger(
                    encryptedDiff,
                    base64SecretKey
                )
                logMessage('Decrypted Sum: ' + decryptedSum)
                logMessage('Decrypted Difference: ' + decryptedDiff)

                // Decrypt the encrypted string using the secret key
                const decryptedString = Module.decryptString(
                    encryptedString,
                    base64SecretKey,
                    stringToEncrypt.length
                )
                logMessage('Decrypted String: ' + decryptedString)

                // Verify the decrypted string matches the original
                if (decryptedString === stringToEncrypt) {
                    logMessage('String encryption and decryption successful.')
                } else {
                    logMessage('Mismatch in string encryption and decryption.')
                }

                // Verify the decrypted values match the expected results
                if (decryptedSum === valueToEncrypt1 + valueToEncrypt2) {
                    logMessage('Addition successful.')
                } else {
                    logMessage('Mismatch in addition.')
                }

                if (decryptedDiff === valueToEncrypt1 - valueToEncrypt2) {
                    logMessage('Subtraction successful.')
                } else {
                    logMessage('Mismatch in subtraction.')
                }
            }

            if (Module.calledRun) {
                Module.onRuntimeInitialized()
            } else {
                logMessage('Waiting for runtime initialization...')
            }
        } catch (error) {
            logMessage('Error initializing the module: ' + error)
        }
    })
