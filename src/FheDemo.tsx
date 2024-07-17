import React, { useEffect, useState } from 'react'
//@ts-ignore
import createModule from './eoc-tfhelib'
import styles from './FheDemo.module.css'
import Loader from './Loader'

const FheDemo: React.FC = () => {
    const [Module, setModule] = useState<any>(null)
    const [secretKey, setSecretKey] = useState<string | null>(null)
    const [publicKey, setPublicKey] = useState<string | null>(null)
    const [valueToEncrypt1, setValueToEncrypt1] = useState<number>(0)
    const [valueToEncrypt2, setValueToEncrypt2] = useState<number>(0)
    const [encryptedValue1, setEncryptedValue1] = useState<string | null>(null)
    const [encryptedValue2, setEncryptedValue2] = useState<string | null>(null)
    const [encryptedSum, setEncryptedSum] = useState<string | null>(null)
    const [encryptedDiff, setEncryptedDiff] = useState<string | null>(null)
    const [decryptedSum, setDecryptedSum] = useState<number | null>(null)
    const [decryptedDiff, setDecryptedDiff] = useState<number | null>(null)
    const [stringToEncrypt, setStringToEncrypt] = useState<string>('')
    const [encryptedString, setEncryptedString] = useState<string | null>(null)
    const [decryptedString, setDecryptedString] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const logWithTimestamp = (tag: string, message: string) => {
        const timestamp = new Date().toISOString()
        console.timeLog(tag, `[${timestamp}] ${message}`)
    }

    useEffect(() => {
        ;(async () => {
            try {
                const initTag = 'Module Initialization'
                console.time(initTag)
                logWithTimestamp(initTag, 'Starting module initialization...')
                const module = await createModule()
                module.onRuntimeInitialized = () => {
                    logWithTimestamp(
                        initTag,
                        'Module initialized successfully.'
                    )
                    setModule(module)
                    console.timeEnd(initTag)
                }

                if (module.calledRun) {
                    module.onRuntimeInitialized()
                } else {
                    logWithTimestamp(
                        initTag,
                        'Waiting for runtime initialization...'
                    )
                }
            } catch (error) {
                console.timeEnd('Module Initialization')
                logWithTimestamp(
                    'Module Initialization',
                    `Error initializing the module: ${error}`
                )
            }
        })()
    }, [])

    const generateSecretKey = async () => {
        const tag = 'Generate Secret Key'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module) {
                    const key = Module.generateSecretKey()
                    setSecretKey(key)
                    logWithTimestamp(tag, 'Generated Secret Key: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const generatePublicKey = async () => {
        const tag = 'Generate Public Key'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && secretKey) {
                    const key = Module.generatePublicKey(secretKey)
                    setPublicKey(key)
                    logWithTimestamp(tag, 'Generated Public Key: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const encryptInteger1 = async () => {
        const tag = 'Encrypt Value 1'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && secretKey) {
                    const encrypted = Module.encryptInteger(
                        valueToEncrypt1,
                        secretKey
                    )
                    setEncryptedValue1(encrypted)
                    logWithTimestamp(tag, 'Encrypted Value 1: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const encryptInteger2 = async () => {
        const tag = 'Encrypt Value 2'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && secretKey) {
                    const encrypted = Module.encryptInteger(
                        valueToEncrypt2,
                        secretKey
                    )
                    setEncryptedValue2(encrypted)
                    logWithTimestamp(tag, 'Encrypted Value 2: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const encryptStringValue = async () => {
        const tag = 'Encrypt String'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && secretKey) {
                    const encrypted = Module.encryptString(
                        stringToEncrypt,
                        secretKey
                    )
                    setEncryptedString(encrypted)
                    logWithTimestamp(tag, 'Encrypted String: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const addEncryptedValues = async () => {
        const tag = 'Add Encrypted Values'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && encryptedValue1 && encryptedValue2 && publicKey) {
                    const sum = Module.addCiphertexts(
                        encryptedValue1,
                        encryptedValue2,
                        publicKey
                    )
                    setEncryptedSum(sum)
                    logWithTimestamp(tag, 'Encrypted Sum: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const subtractEncryptedValues = async () => {
        const tag = 'Subtract Encrypted Values'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && encryptedValue1 && encryptedValue2 && publicKey) {
                    const diff = Module.subtractCiphertexts(
                        encryptedValue1,
                        encryptedValue2,
                        publicKey
                    )
                    setEncryptedDiff(diff)
                    logWithTimestamp(tag, 'Encrypted Difference: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const decryptSum = async () => {
        const tag = 'Decrypt Sum'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && encryptedSum && secretKey) {
                    const sum = Module.decryptInteger(encryptedSum, secretKey)
                    setDecryptedSum(sum)
                    logWithTimestamp(tag, 'Decrypted Sum: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const decryptDiff = async () => {
        const tag = 'Decrypt Difference'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && encryptedDiff && secretKey) {
                    const diff = Module.decryptInteger(encryptedDiff, secretKey)
                    setDecryptedDiff(diff)
                    logWithTimestamp(tag, 'Decrypted Difference: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    const decryptStringValue = async () => {
        const tag = 'Decrypt String'
        console.time(tag)
        setLoading(true)
        setTimeout(function () {
            try {
                if (Module && encryptedString && secretKey) {
                    const decrypted = Module.decryptString(
                        encryptedString,
                        secretKey,
                        stringToEncrypt.length
                    )
                    setDecryptedString(decrypted)
                    logWithTimestamp(tag, 'Decrypted String: OK')
                }
            } finally {
                setLoading(false)
                console.timeEnd(tag)
            }
        }, 0)
    }

    return (
        <div className={styles.container}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1>Fully Homomorphic Encryption Demo</h1>

                    <button
                        onClick={generateSecretKey}
                        disabled={loading}
                        className={styles.button}
                    >
                        Generate Secret Key
                    </button>
                    {secretKey && <p>Secret Key: Generated</p>}
                    <button
                        onClick={generatePublicKey}
                        disabled={loading || !secretKey}
                        className={styles.button}
                    >
                        Generate Public Key
                    </button>
                    {publicKey && <p>Public Key: Generated</p>}

                    <div>
                        <h2 className={styles.heading}>Encrypt Integers</h2>
                        <input
                            type="number"
                            value={valueToEncrypt1}
                            onChange={(e) =>
                                setValueToEncrypt1(parseInt(e.target.value))
                            }
                            className={styles.input}
                        />
                        <button
                            onClick={encryptInteger1}
                            disabled={loading || !secretKey}
                            className={styles.button}
                        >
                            Encrypt Value 1
                        </button>
                        {encryptedValue1 && <p>Encrypted Value 1: Generated</p>}

                        <input
                            type="number"
                            value={valueToEncrypt2}
                            onChange={(e) =>
                                setValueToEncrypt2(parseInt(e.target.value))
                            }
                            className={styles.input}
                        />
                        <button
                            onClick={encryptInteger2}
                            disabled={loading || !secretKey}
                            className={styles.button}
                        >
                            Encrypt Value 2
                        </button>
                        {encryptedValue2 && <p>Encrypted Value 2: Generated</p>}
                    </div>

                    <div>
                        <h2 className={styles.heading}>Encrypt String</h2>
                        <input
                            type="text"
                            value={stringToEncrypt}
                            onChange={(e) => setStringToEncrypt(e.target.value)}
                            className={styles.input}
                        />
                        <button
                            onClick={encryptStringValue}
                            disabled={loading || !secretKey}
                            className={styles.button}
                        >
                            Encrypt String
                        </button>
                        {encryptedString && <p>Encrypted String: Generated</p>}
                    </div>

                    <div>
                        <h2 className={styles.heading}>
                            Operations on Encrypted Values
                        </h2>
                        <button
                            onClick={addEncryptedValues}
                            disabled={
                                !encryptedValue1 ||
                                !encryptedValue2 ||
                                !publicKey
                            }
                            className={styles.button}
                        >
                            Add Encrypted Values
                        </button>
                        {encryptedSum && <p>Encrypted Sum: Generated</p>}
                        <button
                            onClick={subtractEncryptedValues}
                            disabled={
                                !encryptedValue1 ||
                                !encryptedValue2 ||
                                !publicKey
                            }
                            className={styles.button}
                        >
                            Subtract Encrypted Values
                        </button>
                        {encryptedDiff && (
                            <p>Encrypted Difference: Generated</p>
                        )}
                    </div>

                    <div>
                        <h2 className={styles.heading}>Decrypt Results</h2>
                        <button
                            onClick={decryptSum}
                            disabled={loading || !encryptedSum || !secretKey}
                            className={styles.button}
                        >
                            Decrypt Sum
                        </button>
                        {decryptedSum !== null && (
                            <p>Decrypted Sum: {decryptedSum}</p>
                        )}
                        <button
                            onClick={decryptDiff}
                            disabled={loading || !encryptedDiff || !secretKey}
                            className={styles.button}
                        >
                            Decrypt Difference
                        </button>
                        {decryptedDiff !== null && (
                            <p>Decrypted Difference: {decryptedDiff}</p>
                        )}
                        <button
                            onClick={decryptStringValue}
                            disabled={loading || !encryptedString || !secretKey}
                            className={styles.button}
                        >
                            Decrypt String
                        </button>
                        {decryptedString && (
                            <p>Decrypted String: {decryptedString}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default FheDemo
