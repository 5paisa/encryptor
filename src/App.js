import React from 'react';
import 'antd/dist/antd.css';
import { Button, Layout, Input, Card, Typography } from 'antd';

import './App.css';

const { Content, Header } = Layout;
const { Text, Title, Link } = Typography;

function Results(props) {

  return (
    <Content>
      <Card>
        Encrypted Email<br />
        <Text copyable strong>{props.encryptedEmail}</Text><br />
              Encrypted Password<br />
        <Text copyable strong>{props.encryptedPassword}</Text><br />
              Encrypted DOB<br />
        <Text copyable strong>{props.encryptedDOB}</Text><br />
      </Card>
    </Content>
  )
}

class MainComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showResults: false, encryptedEmail: null, encryptedPassword: null, encryptedDOB: null,
      encryptionKey: null, Email: null, Password: null, DOB: null
    }
  }

  updateResults = () => {
    this.setState({ showResults: true })
    const encryptedEmail = encrypt(this.state.Email, this.state.encryptionKey)
    const encryptedPassword = encrypt(this.state.Password, this.state.encryptionKey)
    const encryptedDOB = encrypt(this.state.DOB, this.state.encryptionKey)
    this.setState({ encryptedEmail: encryptedEmail })
    this.setState({ encryptedPassword: encryptedPassword })
    this.setState({ encryptedDOB: encryptedDOB })

  }

  updateEncryptionKey = (event) => {
    this.setState({ encryptionKey: event.target.value })
  }

  updateEmail = (event) => {
    this.setState({ Email: event.target.value })
  }

  updatePassword = (event) => {
    this.setState({ Password: event.target.value })
  }

  updateDOB = (event) => {
    this.setState({ DOB: event.target.value })
  }

  render() {

    return (

      <div className="App">
        <Layout>
          <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
          </head>
          <Content>
            <Input size="large" placeholder="Enter your encryption key here" onChange={this.updateEncryptionKey}
              onKeyPress={event => { if (event.key === "Enter" && this.state.encryptionKey !== null) this.updateResults() }}>

            </Input>
            <Input size="medium" placeholder="Enter your email" onChange={this.updateEmail}
              onKeyPress={event => { if (event.key === "Enter" && this.state.Email !== null) this.updateResults() }}>
            </Input>
            <Input.Password size="medium" placeholder="Enter your password" onChange={this.updatePassword}
              onKeyPress={event => { if (event.key === "Enter" && this.state.Password !== null) this.updateResults() }}>

            </Input.Password>
            <Input size="medium" placeholder="Enter your DOB in YYYYMMDD" onChange={this.updateDOB} maxLength={8}
              onKeyPress={event => { if (event.key === "Enter" && this.state.DOB !== null) this.updateResults() }}>

            </Input>
            <Button onClick={this.updateResults} >Encrypt</Button>
          </Content>
        </Layout>
        <Layout>
          {this.state.showResults ? <Results encryptedEmail={this.state.encryptedEmail}
            encryptedPassword={this.state.encryptedPassword}
            encryptedDOB={this.state.encryptedDOB} /> : null}
        </Layout>

      </div>
    )
  }
}

function App() {
  return (
    <Layout>

      <Header><Text style={{ textAlign: "center", color: "white" }}>
        5paisa Encryptor</Text></Header>
      <Title level={4} style={{ textAlign: "center" }}>This app is 100% client side and <b>does not</b> store any credentials.</Title>
      <Text strong style={{ textAlign: "center" }}>Get your API keys from <Link href="https://www.5paisa.com/developerapi/apikeys" target="_blank">here</Link></Text>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <MainComponent></MainComponent>
      </div >
    </Layout>
  )
}
function encrypt(text, enc_key) {
  const CryptoJS = require("crypto-js")
  var iterations = 1000;
  var keySize = 48;
  var iv = new Uint8Array([83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11])
  var salt = CryptoJS.lib.WordArray.create(iv);

  var derivedKey = CryptoJS.PBKDF2(enc_key, salt, {
    keySize: keySize,
    iterations: iterations
  });
  const derivedKeyToString = derivedKey.toString(CryptoJS.enc.Hex)
  const newiv = derivedKeyToString.slice(0, 32)
  const newkey = derivedKeyToString.slice(32, 96)

  var finalKey = CryptoJS.enc.Hex.parse(newkey);
  var finaliv = CryptoJS.enc.Hex.parse(newiv);
  var encryptedText = CryptoJS.AES.encrypt(text, finalKey, { iv: finaliv })
  return encryptedText.toString()
}

export default App;
