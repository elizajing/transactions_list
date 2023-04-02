import { useEffect, useState, useRef } from 'react';
import TransactionRow from './transactionRow';
import axios from 'axios';

export default function Home() {
  const [transactionsList, setTransactionsList] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const getTransActionsListUrl = 'https://infra.devskills.app/api/accounting/transactions';
  const getBalanceURL = 'https://infra.devskills.app/api/accounting/accounts/';
  const dataFetchedRef = useRef(false);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const amountRef = useRef();
  const accountIdRef = useRef();
  const [transaction, setTransactionId] = useState('');
  const [balance, setAccountBalance] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const fetchData = async () => {
      try {
        const response = await fetch(getTransActionsListUrl);
        const res = await response.json();
        setTransactionsList(res);
        setLoadingTransactions(false);
      } catch (error) {
        console.log('Something went wrong fetching the data')
      }
    }
    fetchData();

  }, [getTransActionsListUrl])

  // useEffect(() => {
  //   console.log('-----transaction: ', transaction)
    
  // }, [transaction])


  const fetchBalance = async (accountId) => {
    try {
      const response = await fetch(`${getBalanceURL}${accountId}`);
      const res = await response.json();
      setAccountBalance(res.balance);

    } catch (error) {
      console.log('Something went wrong fetching the account balance')
    }
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const amount = amountRef.current.value;
    setAmount(amount);
    const accountId = accountIdRef.current.value;
    setAccountId(accountId);

    axios.post(getTransActionsListUrl, request).then(response => setTransactionId(response.transactionId))

    fetchBalance(accountId);
    setSubmitted(true);
    accountIdRef.current.value = '';
    amountRef.current.value = '';
  }

  let div;
  if(loadingTransactions){
    div = <p>Laoding historical transactions...</p>
  }

  let toOrFrom;
  if(amount !== undefined && amount > 0){
    toOrFrom = 'to';
  } else {
    toOrFrom = 'from';
  }

  return (
    <div className='main'>
      <div className='col'>
        <form onSubmit={onSubmit}>
          <label>Account id:</label>
          <input data-type="account-id" type='text' ref={accountIdRef} />
          <label>Amount:</label>
          <input data-type="amount" type="text" ref={amountRef}/>

          <input data-type="transaction-submit" type="submit"/>
        </form>

      </div>
      <div className='col'>
        <p>Transaction history:</p>
        <div>{div}</div>
        {submitted && 
          <div
            data-type="transaction"
            data-account-id="${transaction-account-id}"
            data-amount="${transaction-amount}"
            data-balance="${current-account-balance}">
            <p>Transferred {amount} {toOrFrom} {accountId}. The current balance: {balance}</p>
          </div>
        }
        {!loadingTransactions && transactionsList.map((t) => (
          <TransactionRow amount={t.amount} accountId={t.account_id}></TransactionRow>
          ))}
      </div>


    </div>



  )
}
