import * as React from "react"
import { useEffect } from "react"
import AddTransaction from "../AddTransaction/AddTransaction"
import BankActivity from "../BankActivity/BankActivity"
import "./Home.css"
import axios from "axios"

export default function Home(props) {

  async function handleOnSubmitNewTransaction() {
      props.setIsCreating(true)
      axios.post('http://localhost:3001/bank/transactions', {
        transaction: props.newTransactionForm
      })
      .then((res)=>{
        props.setTransactions((state)=>[...state, res.data.transaction])
        props.setNewTransactionForm({category: "", description: "", amount: 0})
        props.setIsCreating(false)
        console.log(props.transactions)
      })
    .catch((error)=> {
      props.setError(error);
      props.setIsCreating(false)
    })
}

  async function getTransactions(){
    try{
      let json = await axios.get("http://localhost:3001/bank/transactions")
      props.setTransactions(json.data.transactions)
      props.setIsLoading(false)
    }catch(err){
      props.setError(err)
    }
  }

  async function getTransfers(){
    try{
      let json = await axios.get("http://localhost:3001/bank/transfers")
      props.setTransfers(json.data.transfers)
      props.setIsLoading(false)
    }catch(err){
      props.setError(err)
    }
  }

  useEffect(() => {
    props.setIsLoading(true)
    getTransactions()
  }, []);

  useEffect(() => {
    props.setIsLoading(true)
    getTransfers()
  }, []);

  let filteredTransactions = props.transactions;

  if(props.filterInputValue != "" && filteredTransactions != null){
    console.log(props.transactions)
    filteredTransactions = filteredTransactions.filter((transaction) => transaction.description.toLowerCase().includes(props.filterInputValue.toLowerCase()))
  }

  if(props.isLoading){
    return (
      <div className="home">
        <AddTransaction isCreating={props.isCreating} setIsCreating={props.setIsCreating} form={props.newTransactionForm} 
        setForm={props.setNewTransactionForm} handleOnSubmit={handleOnSubmitNewTransaction}/>
          <h1>Loading...</h1>
      </div>
    )
  }
  else{
    if(props.error != null){
      return (
        <div className="home">
          <h2 className="error">{props.error}</h2>
        </div>
      )
    }
    else{
      return (
        <div className="home">
          <AddTransaction isCreating={props.isCreating} setIsCreating={props.setIsCreating} form={props.newTransactionForm} 
          setForm={props.setNewTransactionForm} handleOnSubmit={handleOnSubmitNewTransaction}/>
          <BankActivity transactions={filteredTransactions}/>
        </div>
      )
    }
  }
}
