
import React, { useState } from 'react'
import styles from './FheDemo.module.css'
import Loader from './Loader'
import * as othentSinger from '@othent/kms'
import {
    connect,
    disconnect,
  } from "@othent/kms";
  import {
    dryrun,
    message,
    createDataItemSigner
  } from '@permaweb/aoconnect';

const FheDemo: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [valueToEncrypt, setValueToEncrypt] = useState<number>(0)
    const [encryptIntegerValueBlockId, setEncryptIntegerValueBlockId] = useState<string>('')
    const [executionTimes, setExecutionTimes] = useState<{ [key: string]: string }>({});
    const [decryptedString, setDecryptedString] = useState<string | null>(null)
    const [encryptIntegerParam1, setEncryptIntegerParam1] = useState<string>('')
    const [encryptIntegerParam2, setEncryptIntegerParam2] = useState<string>('')
    const [decryptedComputation, setDecryptedComputation] = useState<string | null>(null)

    const logWithTimestamp = (tag: string, message: string) => {
        const timestamp = new Date().toISOString()
        console.timeLog(tag, `[${timestamp}] ${message}`)
    }

    const formatTime = (milliseconds: number) => {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const ms = milliseconds % 1000;
    
        return `${hours}h ${minutes}m ${seconds}s ${ms}ms`;
      };

    const timeExecution = async (method: () => Promise<void>, label: string) => {
        console.time(label);
        const start = performance.now();
        await method();
        const end = performance.now();
        console.timeEnd(label);
        setExecutionTimes((prev) => ({ ...prev, [label]: formatTime(Math.round(end - start)) }));
      };


    // connect/disconnect function
    const toggleConnection = () => {
        setLoading(true)
        if (isConnected) {
            ao_disconnect()
        } else {
            ao_connect()
        }
    }

   
   const getSinger = (): any => {
    const singer = Object.assign({}, othentSinger, {
        getActiveAddress: () => 
            //@ts-ignore
            othentSinger.getActiveKey(),
        getAddress: () => 
            //@ts-ignore
            othentSinger.getActiveKey(),
        singer: 
        //@ts-ignore
        tx => othentSinger.sign(tx),
        type: 'arweave'
      })
      return singer
    
    }
    const ao_connect = async () => {
        const res = await connect();
        console.log("Connect,\n", res);
        setIsConnected(true)
        setLoading(false)
        console.log("Connected")
        // Add additional logic for establishing a connection if necessary
    }

    const ao_disconnect = async () => {
        const res = await disconnect();
        console.log("Disconnect,\n", res);
        setIsConnected(false)
        setLoading(false)
        console.log("Disconnected")
        // Add additional logic for disconnecting if necessary
    }

    const storeEncryptedData = async (value: string) => {
        try {
            const walletSing = await getSinger()

          const messageId = await message({
            process: "QVc0L0jxgGDsKbJbof8NM-Bu2WsD_zFVVa1vxZAwfQs",
            signer: createDataItemSigner(walletSing),
            // the survey as stringified JSON
            data: '{"type": "integer", "value":"' + value + '"}',
            tags: [{ name: 'Action', value: 'StoreEncryptedData' }],
          });
      
          console.log(messageId);
      
          return messageId;
        } catch (error) {
          console.log(error);
          return "";
        }
      }

      const getEncryptedData = async (messageId:string) => {
        const txIn = await dryrun({
          process: "QVc0L0jxgGDsKbJbof8NM-Bu2WsD_zFVVa1vxZAwfQs",
          tags: [
            { name: 'Action', value: 'GetDataByKv' },
            { name: 'Key', value: 'ao_id' },
            { name: 'Val', value: messageId + '' },
          ],
        });
      
        const encryption = JSON.parse(txIn.Messages[0].Data);
      
        // Extract the data string
        let dataString = encryption.data;
      
        // Correct the JSON format by adding quotes around the value
        dataString = dataString.replace(/"value":([^"]+)}/, '"value":"$1"}');
      
        // Parse the corrected JSON string
        const data = JSON.parse(dataString);
      
        console.log(data);
        return data;
      }
      
       

    // Function to encrypt an integer value
    const encryptIntegerValue = () => {

        const tag = 'Encrypt Integer Value'
        console.time(tag)
        setLoading(true)
        setTimeout(async function  () {
            try {
            if (isConnected) {
                await timeExecution(async () => {
                    try {
                        const txIn = await dryrun({
                          process: "QVc0L0jxgGDsKbJbof8NM-Bu2WsD_zFVVa1vxZAwfQs",
                          tags: [
                            { name: 'Action', value: 'EncryptIntegerValue' },
                            { name: 'Val', value: valueToEncrypt + '' },
                          ],
                        });
                        const data = txIn.Messages[0].Data + '';
                        console.log(data);
                        const aoId = await storeEncryptedData(data)
                        setEncryptIntegerValueBlockId(aoId)
                      } catch (error) {
                        console.log(error);
                      }
                                      }, 'encryptInteger');
                logWithTimestamp(tag, 'Encrypted Integer Value: OK')
            }
        } finally {
            setLoading(false)
            console.timeEnd(tag)
        }
    }, 300)         
    }

    // Function to decrypt an integer value using a blockId
    const decryptIntegerValue = () => {
        const tag = 'Decrypt Integer Value'
        console.time(tag)
        setLoading(true)
        setTimeout(async function  () {
            try {
            if (isConnected) {
                await timeExecution(async () => {
                    try {
                        const data = await getEncryptedData(encryptIntegerValueBlockId);

                        const txOut = await dryrun({
                          process: "QVc0L0jxgGDsKbJbof8NM-Bu2WsD_zFVVa1vxZAwfQs",
                          tags: [
                            { name: 'Action', value: 'DecryptIntegerValue' },
                            { name: 'Val', value: data.value },
                          ],
                        });
                        const result = txOut.Messages[0].Data + '';
                        console.log(result);
                        setDecryptedString(result)
                      } catch (error) {
                        console.log(error);
                      }
                                      }, 'decryptIntegerValue');
                logWithTimestamp(tag, 'Decrypt Integer Value: OK')
            }
        } finally {
            setLoading(false)
            console.timeEnd(tag)
        }
    }, 300) 
    }

    // Function to perform an addition on two encrypted values using their block IDs
    const computeAddOperationOnEncryptedData = () => {
        const tag = 'Run sum on integer blocks'
        console.time(tag)
        setLoading(true)
        setTimeout(async function  () {
            try {
            if (isConnected) {
                await timeExecution(async () => {
                    try {
                        const txAddOperation = await dryrun({
                            process: "QVc0L0jxgGDsKbJbof8NM-Bu2WsD_zFVVa1vxZAwfQs",
                            tags: [
                              { name: 'Action', value: 'ComputeOperationOnEncryptedData' },
                              { name: 'operation', value: 'add' },
                              { name: 'ao_id_val_left', value: encryptIntegerParam1 },
                              { name: 'ao_id_val_right', value: encryptIntegerParam2 },
                            ],
                          });
                          const txOut = await dryrun({
                            process: "QVc0L0jxgGDsKbJbof8NM-Bu2WsD_zFVVa1vxZAwfQs",
                            tags: [
                              { name: 'Action', value: 'DecryptIntegerValue' },
                              { name: 'Val', value: txAddOperation.Messages[0].Data + ""},
                            ],
                          });
                          const result = txOut.Messages[0].Data + '';
                          console.log(result);
  
                        setDecryptedComputation(result)
                      } catch (error) {
                        console.log(error);
                      }
                                      }, 'computeOperationOnEncryptedData');
                logWithTimestamp(tag, 'Run sum on integer blocks: OK')
            }
        } finally {
            setLoading(false)
            console.timeEnd(tag)
        }
    }, 300)     }

    // // Placeholder function to simulate retrieving an encrypted value from a block ID
    // const getEncryptedValueFromBlockId = (blockId: string): string => {
    //     // Logic to retrieve the actual encrypted value from the blockId
    //     return blockId // For now, returning the blockId as the "encrypted value"
    // }

    return (
        <div className={styles.container}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1>Fully Homomorphic Encryption Demo</h1>
                    <button onClick={toggleConnection} className={styles.button}>
                        {isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                    <div>
                        <h2 className={styles.heading}>Encrypt Integers</h2>
                        <input
                            type="number"
                            value={valueToEncrypt}
                            onChange={(e) =>
                                setValueToEncrypt(parseInt(e.target.value))
                            }
                            className={styles.input}
                        />
                        <button
                            onClick={encryptIntegerValue}
                            disabled={loading || !isConnected}
                            className={styles.button}
                        >
                            Encrypt Value 
                        </button>
                        {encryptIntegerValueBlockId && <p>Encrypted Value: Generated Block Id {encryptIntegerValueBlockId}</p>}
                        {encryptIntegerValueBlockId && <a target='_blank' rel="norefferer" href={'https://www.ao.link/#/message/' + encryptIntegerValueBlockId}>View Encrypted Data</a>}
                        {executionTimes['encryptInteger'] && <p>Time: {executionTimes['encryptInteger']}</p>}
                    </div>  
                    <div>
                        <h2 className={styles.heading}>Decrypt Integer Value Block</h2>
                        <input
                            type="text"
                            value={encryptIntegerValueBlockId}
                            onChange={(e) => setEncryptIntegerValueBlockId(e.target.value)}
                            className={styles.input}
                        />
                        <button
                            onClick={decryptIntegerValue}
                            disabled={loading || !isConnected || !encryptIntegerValueBlockId}
                            className={styles.button}
                        >
                            Decrypt Integer Value
                        </button>
                        {decryptedString && <p>Value result: {decryptedString}</p>}
                        {executionTimes['decryptIntegerValue'] && <p>Time: {executionTimes['decryptIntegerValue']}</p>}
                        </div>
                        <div>
                        <h2 className={styles.heading}>Sum operation on Integer Value Block</h2>
                        <p>Block Id Sum parameter 1</p>
                        <input
                            type="text"
                            value={encryptIntegerParam1}
                            onChange={(e) => setEncryptIntegerParam1(e.target.value)}
                            className={styles.input}
                        />
                        <p>Block Id Sum parameter 2</p>
                        <input
                            type="text"
                            value={encryptIntegerParam2}
                            onChange={(e) => setEncryptIntegerParam2(e.target.value)}
                            className={styles.input}
                        />
                        <button
                            onClick={computeAddOperationOnEncryptedData}
                            disabled={loading || !isConnected || !encryptIntegerParam1 || !encryptIntegerParam2}
                            className={styles.button}
                        >
                            Decrypt Sum Block Integer Value
                        </button>
                        {decryptedComputation && <p>Value result: {decryptedComputation}</p>}
                        {executionTimes['computeOperationOnEncryptedData'] && <p>Time: {executionTimes['computeOperationOnEncryptedData']}</p>}
                        </div>
                                     
                    {/* <button
                        onClick={generateSecretKey}
                        disabled={loading}
                        className={styles.button}
                    >
                        Generate Secret Key
                    </button>
                    {secretKey && <p>Secret Key: Generated</p>}
                    {executionTimes['generateSecretKey'] && <p>Time: {executionTimes['generateSecretKey']}</p>}
                    <button
                        onClick={generatePublicKey}
                        disabled={loading || !secretKey}
                        className={styles.button}
                    >
                        Generate Public Key
                    </button>
                    {publicKey && <p>Public Key: Generated</p>}
                    {executionTimes['generatePublicKey'] && <p>Time: {executionTimes['generatePublicKey']}</p>}

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
                        {executionTimes['encryptInteger1'] && <p>Time: {executionTimes['encryptInteger1']}</p>}

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
                        {executionTimes['encryptInteger2'] && <p>Time: {executionTimes['encryptInteger2']}</p>}
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
                        {executionTimes['encryptString'] && <p>Time: {executionTimes['encryptString']}</p>}
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
                        {executionTimes['addEncryptedValues'] && <p>Time: {executionTimes['addEncryptedValues']}</p>}
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
                        {executionTimes['subtractEncryptedValues'] && <p>Time: {executionTimes['subtractEncryptedValues']}</p>}
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
                        {executionTimes['decryptSum'] && <p>Time: {executionTimes['decryptSum']}</p>}
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
                        {executionTimes['decryptString'] && <p>Time: {executionTimes['decryptString']}</p>}
                    </div> */}
                </>
            )}
        </div>        
    )
}

export default FheDemo
