import React, { useEffect, useState } from 'react';
import createModule from './eoc-tfhelib';

const FheDemo: React.FC = () => {
  const [Module, setModule] = useState<any>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [valueToEncrypt1, setValueToEncrypt1] = useState<number>(0);
  const [valueToEncrypt2, setValueToEncrypt2] = useState<number>(0);
  const [encryptedValue1, setEncryptedValue1] = useState<string | null>(null);
  const [encryptedValue2, setEncryptedValue2] = useState<string | null>(null);
  const [encryptedSum, setEncryptedSum] = useState<string | null>(null);
  const [encryptedDiff, setEncryptedDiff] = useState<string | null>(null);
  const [decryptedSum, setDecryptedSum] = useState<number | null>(null);
  const [decryptedDiff, setDecryptedDiff] = useState<number | null>(null);
  const [stringToEncrypt, setStringToEncrypt] = useState<string>('');
  const [encryptedString, setEncryptedString] = useState<string | null>(null);
  const [decryptedString, setDecryptedString] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("Starting module initialization...");
        const module = await createModule();
        module.onRuntimeInitialized = () => {
          console.log("Module initialized successfully.");
          setModule(module);
        };

        if (module.calledRun) {
          module.onRuntimeInitialized();
        } else {
          console.log("Waiting for runtime initialization...");
        }
      } catch (error) {
        console.error("Error initializing the module:", error);
      }
    })();
  }, []);

  const generateSecretKey = () => {
    if (Module) {
      const key = Module.generateSecretKey();
      setSecretKey(key);
      console.log("Generated Secret Key: OK", key);
    }
  };

  const generatePublicKey = () => {
    if (Module && secretKey) {
      const key = Module.generatePublicKey(secretKey);
      setPublicKey(key);
      console.log("Generated Public Key: OK", key);
    }
  };

  const encryptInteger1 = () => {
    if (Module && secretKey) {
      const encrypted = Module.encryptInteger(valueToEncrypt1, secretKey);
      setEncryptedValue1(encrypted);
      console.log("Encrypted Value 1: OK", encrypted);
    }
  };

  const encryptInteger2 = () => {
    if (Module && secretKey) {
      const encrypted = Module.encryptInteger(valueToEncrypt2, secretKey);
      setEncryptedValue2(encrypted);
      console.log("Encrypted Value 2: OK", encrypted);
    }
  };

  const encryptStringValue = () => {
    if (Module && secretKey) {
      const encrypted = Module.encryptString(stringToEncrypt, secretKey);
      setEncryptedString(encrypted);
      console.log("Encrypted String: OK", encrypted);
    }
  };

  const addEncryptedValues = () => {
    if (Module && encryptedValue1 && encryptedValue2 && publicKey) {
      const sum = Module.addCiphertexts(encryptedValue1, encryptedValue2, publicKey);
      setEncryptedSum(sum);
      console.log("Encrypted Sum: OK", sum);
    }
  };

  const subtractEncryptedValues = () => {
    if (Module && encryptedValue1 && encryptedValue2 && publicKey) {
      const diff = Module.subtractCiphertexts(encryptedValue1, encryptedValue2, publicKey);
      setEncryptedDiff(diff);
      console.log("Encrypted Difference: OK", diff);
    }
  };

  const decryptSum = () => {
    if (Module && encryptedSum && secretKey) {
      const sum = Module.decryptInteger(encryptedSum, secretKey);
      setDecryptedSum(sum);
      console.log("Decrypted Sum: OK", sum);
    }
  };

  const decryptDiff = () => {
    if (Module && encryptedDiff && secretKey) {
      const diff = Module.decryptInteger(encryptedDiff, secretKey);
      setDecryptedDiff(diff);
      console.log("Decrypted Difference: OK", diff);
    }
  };

  const decryptStringValue = () => {
    if (Module && encryptedString && secretKey) {
      const decrypted = Module.decryptString(encryptedString, secretKey, stringToEncrypt.length);
      setDecryptedString(decrypted);
      console.log("Decrypted String: OK", decrypted);
    }
  };

  return (
    <div>
      <h1>FHE Demo</h1>
      <button onClick={generateSecretKey}>Generate Secret Key</button>
      {secretKey && <p>Secret Key: {secretKey}</p>}
      <button onClick={generatePublicKey} disabled={!secretKey}>Generate Public Key</button>
      {publicKey && <p>Public Key: {publicKey}</p>}
      
      <div>
        <h2>Encrypt Integers</h2>
        <input
          type="number"
          value={valueToEncrypt1}
          onChange={(e) => setValueToEncrypt1(parseInt(e.target.value))}
        />
        <button onClick={encryptInteger1} disabled={!secretKey}>Encrypt Value 1</button>
        {encryptedValue1 && <p>Encrypted Value 1: {encryptedValue1}</p>}
        
        <input
          type="number"
          value={valueToEncrypt2}
          onChange={(e) => setValueToEncrypt2(parseInt(e.target.value))}
        />
        <button onClick={encryptInteger2} disabled={!secretKey}>Encrypt Value 2</button>
        {encryptedValue2 && <p>Encrypted Value 2: {encryptedValue2}</p>}
      </div>
      
      <div>
        <h2>Encrypt String</h2>
        <input
          type="text"
          value={stringToEncrypt}
          onChange={(e) => setStringToEncrypt(e.target.value)}
        />
        <button onClick={encryptStringValue} disabled={!secretKey}>Encrypt String</button>
        {encryptedString && <p>Encrypted String: {encryptedString}</p>}
      </div>
      
      <div>
        <h2>Operations on Encrypted Values</h2>
        <button onClick={addEncryptedValues} disabled={!encryptedValue1 || !encryptedValue2 || !publicKey}>Add Encrypted Values</button>
        {encryptedSum && <p>Encrypted Sum: {encryptedSum}</p>}
        <button onClick={subtractEncryptedValues} disabled={!encryptedValue1 || !encryptedValue2 || !publicKey}>Subtract Encrypted Values</button>
        {encryptedDiff && <p>Encrypted Difference: {encryptedDiff}</p>}
      </div>
      
      <div>
        <h2>Decrypt Results</h2>
        <button onClick={decryptSum} disabled={!encryptedSum || !secretKey}>Decrypt Sum</button>
        {decryptedSum !== null && <p>Decrypted Sum: {decryptedSum}</p>}
        <button onClick={decryptDiff} disabled={!encryptedDiff || !secretKey}>Decrypt Difference</button>
        {decryptedDiff !== null && <p>Decrypted Difference: {decryptedDiff}</p>}
        <button onClick={decryptStringValue} disabled={!encryptedString || !secretKey}>Decrypt String</button>
        {decryptedString && <p>Decrypted String: {decryptedString}</p>}
      </div>
    </div>
  );
};

export default FheDemo;
