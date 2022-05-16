import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import Lottery from './lottery';
import React, { useState, useEffect } from "react";


function App() {
  const info = {
    manager:'',
    players:[],
    balance :'',
    value:'',
    message:'',
    winner:''
  }
  const [contract, setData] = useState(info);




  const callManager  = async ()=> {
    const manager = await Lottery.methods.manager().call()
    const players = await Lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(Lottery.options.address)

    setData({manager,players,balance});
  }

  const setValue = (event) =>{
  const value = event.target.value;
  setData({...contract,value});
  }
 
  
  useEffect(() => {
    callManager();
  }, []);


  const pickLotterykWinner  = async () => {
    const accounts = await web3.eth.getAccounts();

    const winner = await Lottery.methods.pickWinner().send({
      from:accounts[0]
    })
    setData({...contract,message:'Waiting on transaction success...'})
    setData({...contract,winner})
    setData({...contract,message:'A winner has been pick'})
  }

  const onSubmit = async(event)=>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setData({...contract,message:'Waiting on transaction success...'})
    await Lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(contract.value,'ether')
    })
    setData({...contract,message:'You have been entered!!'})
  }

 web3.eth.requestAccounts().then(console.log)

  return (
    <div className="App">
    <h2>Lottery Contract</h2>
    <p>
      This contract is manager by {contract.manager}.  
      There are currently {contract.players.length} people entered 
      competing to win {web3.utils.fromWei(contract.balance)} ether
      </p>
      <form onSubmit={onSubmit}>
      <h4>Want to try your luck ?</h4>
      <div>
        <label>Amout of ether to enter </label>
        <input onChange={(event) => setValue(event)} />
      </div>
      <button>Enter</button>
      </form> 
      <h4>Ready to pick a winnir</h4>
      <button onClick={()=>pickLotterykWinner()}>Pick a winner</button>
      <hr/>
      <h1>{contract.message}</h1>
    </div>
  );
}

export default App;



