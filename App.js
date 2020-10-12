import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Clipboard } from 'react-native';

export default class App extends Component {

  constructor() {
  super()

    this.state = {
      longUrl: '',
      shortUrl: ''
    }  
  }
  
  shortenUrl = () => {

    var qs = require("querystring");
    var http = require("https");

    var options = {
      "method": "POST",
      "hostname": "url-shortener-service.p.rapidapi.com",
      "port": null,
      "path": "/shorten",
      "headers": {
        "x-rapidapi-host": "url-shortener-service.p.rapidapi.com",
        "x-rapidapi-key": "", //Insira aqui sua API KEY
        "content-type": "application/x-www-form-urlencoded",
        "useQueryString": true
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk)
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        var bodyString = body.toString();

        console.log(bodyString); //Apresenta um resultado semelhante à esse: {"result_url":"https:\/\/goolnk.com\/7bMo3N"}

        ///Como a resposta vinha com caracteres indesejados, tanto no começo quanto no final, foi necessária essa "gambiarra" para deixá-la pronta para uso
        this.setState({shortUrl: bodyString.slice(15)})
        bodyString = this.state.shortUrl
        this.setState({shortUrl: bodyString.slice(0, -2)})
        ///

      }.bind(this));      

    }.bind(this));

    req.write(qs.stringify({url: this.state.longUrl}));
    req.end();
  }

  copyToClipboard = () => {
    Clipboard.setString(this.state.shortUrl)
  }

  render () {

    return (
      <View style={styles.container}>
        
        <View style={styles.view}>
          <Text style={styles.text}>This is myApp.</Text>
          <Text style={styles.text1}>A shortener link mobile solution for you.</Text>
        
          <Text style={styles.text}>Copy and paste your link below:</Text>
          
          <TextInput style={styles.inputs} id ='url' placeholder='Paste your url here' onChangeText={(value) => this.setState({longUrl: value})} onSubmitEditing={this.shortenUrl}></TextInput>
          <TextInput style={styles.inputs} editable={false} placeholder='url Shortened' value={this.state.shortUrl}></TextInput>
          
          <TouchableOpacity style={styles.copyToClipboard} onPress={this.copyToClipboard}>
            <Text style={styles.text1}>Copy Url</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: 5,
    fontSize: 18,
    color: 'white',
    marginTop: 30
  },
  text1:{
    fontSize: 18,
    color: 'white',
    marginBottom: 0
  },
  inputs: {
    margin: 10,
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'center',
    width: 300,
    height: 40,
    borderRadius: 7
  },
  copyToClipboard: {
    backgroundColor: 'gray',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 30
  }
  
});
