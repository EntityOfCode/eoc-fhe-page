import React, { useEffect, useState } from 'react'
//@ts-ignore
import createModule from './eoc-tfhelib'

const FheDemo: React.FC = () => {

    const [fheModule, setFheModule] = useState();
    const [base64SecretKey, setBase64SecretKey] = useState('');

    const [base64PublicKey, setBase64PublicKey] = useState('');

    useEffect(() => {
        ;(async () => {
            try {
                console.log('Starting module initialization...')
                const Module = await createModule({
                    wasmBinaryFile: './eoc-tfhelib.wasm',
                })
                setFheModule(Module);

                Module.onRuntimeInitialized = () => {
                    console.log('Module initialized successfully.')

                    // // Generate a secret key
                    // const base64SecretKey = Module.generateSecretKey()
                    // console.log('Generated Secret Key: OK')

                    // // Generate a public key from the secret key
                    // const base64PublicKey =
                    //     Module.generatePublicKey(base64SecretKey)
                    // console.log('Generated Public Key: OK')

                    // // Encrypt integers using the secret key
                    // const valueToEncrypt1 = 7
                    // const valueToEncrypt2 = 5
                    // const encryptedValue1 = Module.encryptInteger(
                    //     valueToEncrypt1,
                    //     base64SecretKey
                    // )
                    // const encryptedValue2 = Module.encryptInteger(
                    //     valueToEncrypt2,
                    //     base64SecretKey
                    // )
                    // console.log('Encrypted Value 1: OK')
                    // console.log('Encrypted Value 2: OK')

                    // // Encrypt a string using the secret key
                    // const stringToEncrypt = 'Hello, World!'
                    // const encryptedString = Module.encryptString(
                    //     stringToEncrypt,
                    //     base64SecretKey
                    // )
                    // console.log('Encrypted String: OK')

                    // // Perform addition on encrypted values
                    // const encryptedSum = Module.addCiphertexts(
                    //     encryptedValue1,
                    //     encryptedValue2,
                    //     base64PublicKey
                    // )
                    // console.log('Encrypted Sum: OK')

                    // // Perform subtraction on encrypted values
                    // const encryptedDiff = Module.subtractCiphertexts(
                    //     encryptedValue1,
                    //     encryptedValue2,
                    //     base64PublicKey
                    // )
                    // console.log('Encrypted Difference: OK')

                    // // Decrypt the results using the secret key
                    // const decryptedSum = Module.decryptInteger(
                    //     encryptedSum,
                    //     base64SecretKey
                    // )
                    // const decryptedDiff = Module.decryptInteger(
                    //     encryptedDiff,
                    //     base64SecretKey
                    // )
                    // console.log('Decrypted Sum:', decryptedSum)
                    // console.log('Decrypted Difference:', decryptedDiff)

                    // // Decrypt the encrypted string using the secret key
                    // const decryptedString = Module.decryptString(
                    //     encryptedString,
                    //     base64SecretKey,
                    //     stringToEncrypt.length
                    // )
                    // console.log('Decrypted String:', decryptedString)

                    // // Verify the decrypted string matches the original
                    // if (decryptedString === stringToEncrypt) {
                    //     console.log(
                    //         'String encryption and decryption successful.'
                    //     )
                    // } else {
                    //     console.log(
                    //         'Mismatch in string encryption and decryption.'
                    //     )
                    // }

                    // // Verify the decrypted values match the expected results
                    // if (decryptedSum === valueToEncrypt1 + valueToEncrypt2) {
                    //     console.log('Addition successful.')
                    // } else {
                    //     console.log('Mismatch in addition.')
                    // }

                    // if (decryptedDiff === valueToEncrypt1 - valueToEncrypt2) {
                    //     console.log('Subtraction successful.')
                    // } else {
                    //     console.log('Mismatch in subtraction.')
                    // }
                }

                if (Module.calledRun) {
                    Module.onRuntimeInitialized()
                } else {
                    console.log('Waiting for runtime initialization...')
                }
            } catch (error) {
                console.error('Error initializing the module:', error)
            }
        })()
    }, [])

    const generateSecretKey = async () => {
        console.time('Generated Secret Key: OK');
        const _base64SecretKey = fheModule.generateSecretKey()
        console.timeLog('Generated Secret Key: OK')
        setBase64SecretKey(_base64SecretKey)
    }

    const generatePublicKey = async () => {
        console.time('Generated Public Key: OK');
        const _base64PublicKey = fheModule.generatePublicKey(base64SecretKey)
        console.timeLog('Generated Public Key: OK')
        setBase64PublicKey(_base64PublicKey)
    }

    const encryptInteger = async () => {
                    // // Encrypt integers using the secret key
                    console.time('Encrypted Value 1: OK');
                    const valueToEncrypt1 = 7
                    const valueToEncrypt2 = 5
                    const encryptedValue1 = fheModule.encryptInteger(
                        valueToEncrypt1,
                        base64SecretKey
                    )
                    console.timeLog('Encrypted Value 1: OK')
                    console.time('Encrypted Value 2: OK');
                    const encryptedValue2 = fheModule.encryptInteger(
                        valueToEncrypt2,
                        base64SecretKey
                    )
                    console.timeLog('Encrypted Value 2: OK')

    }

    return (<>
    <h1>FHE Demo</h1>
            <div className="card">
                <button onClick={() => generateSecretKey()}>
                    Generate Secret Key 
                </button>
            </div>
            <div className="card">
                <button onClick={() => generatePublicKey()}>
                    Generate Public Key 
                </button>
            </div>
            <div className="card">
                <button onClick={() => encryptInteger()}>
                    Encrypt Integer
                </button>
            </div>

    </>)
}

export default FheDemo
