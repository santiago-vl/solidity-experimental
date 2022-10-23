import "./App.css";
import React from "react";
import Lottery from "./contracts/Lottery";
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {manager: ''};
  }

  async componentDidMount() {
    console.log("ComponentDidMount");
    // No es necesario usar el call({from: accounts[0]}) porque esa usando la instancia de web3 con Metamask
    console.log(Lottery);
    const manager = await Lottery.methods.manager().call();

    console.log(manager);
    this.setState({manager});
  }

  render() {
    return (
      <div>
       <h2>Lottery contract</h2>
       <p>This contract is managed by {this.state.manager}</p>
      </div>
    );
  }
}
export default App;
