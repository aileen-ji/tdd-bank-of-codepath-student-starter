import * as React from "react"
import { formatAmount, formatDate } from "../../utils/format"
import "./TransactionDetail.css"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"

export default function TransactionDetail() {

  const [hasFetched, setHasFetched] = useState(false)
  const [transaction, setTransaction] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const transactionId = useParams()?.transactionId

  async function fetchTransactionsById(){
    setIsLoading(true)
    setHasFetched(false)
    try{
      let json = await axios.get("http://localhost:3001/bank/transactions/"+transactionId)
      setTransaction(json.data.transaction)
      setIsLoading(false)
      setHasFetched(true)
    }catch(err){
      setError(err)
      setIsLoading(false)
      setHasFetched(true)
    }
  }

  useEffect(() => {
    
    fetchTransactionsById()
  }, []);

  return (
    <div className="transaction-detail">
      <TransactionCard transaction={transaction} transactionId={transactionId}/>
    </div>
  )
}

export function TransactionCard({ transaction, transactionId}) {
  if(transaction == undefined || transaction.category == undefined){
    return(
      <div className="transaction-card card">
      <div className="card-header">
        <h3>Transaction #{transactionId}</h3>
        <h1>Not Found</h1>
      </div>
      </div>
    )
  }
  return (
    <div className="transaction-card card">
      <div className="card-header">
        <h3>Transaction #{transactionId}</h3>
        <p className="category">{transaction.category}</p>
      </div>

      <div className="card-content">
        <p className="description">{transaction.description}</p>
      </div>

      <div className="card-footer">
        <p className={`amount ${transaction.amount < 0 ? "minus" : ""}`}>{formatAmount(transaction.amount)}</p>
        <p className="date">{formatDate(transaction.postedAt)}</p>
      </div>
    </div>
  )
}
