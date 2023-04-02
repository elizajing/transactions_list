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
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const invalidInputMessage = 'Invalid input format for amount or account id';
  const serverErrorMessage = 'The is something wrong with the server';

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const fetchData = async () => {
      let res;
      try {
        res = await axios.get(getTransActionsListUrl).then((response) => {
          return response;
        })
        setTransactionsList(res.data);
        setLoadingTransactions(false);
      } catch (error) {
        if (error.code === 'ERR_BAD_REQUEST') {
          setErrorMessage({ message: invalidInputMessage });
        } else if (error.response.status >= 500) {
          setErrorMessage({ message: serverErrorMessage });
        }
        setError(true);
      }
    }
    fetchData();
  }, [getTransActionsListUrl])

  // useEffect(() => {
  //   console.log('-----transaction id: ', transaction)

  // }, [transaction])


  const fetchBalance = async (accountId) => {
    let response;
    try {
      response = await fetch(`${getBalanceURL}${accountId}`);
      const res = await response.json();

      setAccountBalance(res.balance);
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') {
        setErrorMessage({ message: invalidInputMessage });
      } else if (error.response.status >= 500) {
        setErrorMessage({ message: serverErrorMessage });
      }
      setError(true);
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    const amount = amountRef.current.value;
    setAmount(amount);
    const accountId = accountIdRef.current.value;
    setAccountId(accountId);

    const request = { 'account_id': accountId, 'amount': amount };
    let res;
    try {
      res = await axios.post(getTransActionsListUrl, request).then(response => {
        return response
      });
      setTransactionId(res.data.transactionId)
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') {
        setErrorMessage({ message: invalidInputMessage });
      } else if (error.response.status >= 500) {
        setErrorMessage({ message: serverErrorMessage });
      }
      setError(true);

    }

    fetchBalance(accountId);
    setSubmitted(true);
    accountIdRef.current.value = '';
    amountRef.current.value = '';
  }

  let div;
  if (loadingTransactions) {
    div = <p>Loading historical transactions...</p>
  }

  let toOrFrom;
  if (amount !== undefined && amount > 0) {
    toOrFrom = 'to';
  } else {
    toOrFrom = 'from';
  }

  let err;
  if (error) {
    err = <p>Error occured: {errorMessage.message} </p>
  }
  return (
    <div className='main'>
      <div className='col'>
        <form onSubmit={onSubmit}>
          <label>Account id:</label>
          <input data-type="account-id" type='text' ref={accountIdRef} />
          <label>Amount:</label>
          <input data-type="amount" type="text" ref={amountRef} />

          <input data-type="transaction-submit" type="submit" />
          <div>{err}</div>
        </form>

      </div>
      <div className='col'>
        <p>Transaction history:</p>
        <div>{div}</div>
        {submitted && !error &&
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
