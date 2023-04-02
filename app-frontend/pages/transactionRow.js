
function TransactionRow({ amount, accountId }) {
    let toOrFrom;
    if (amount !== undefined && amount > 0) {
        toOrFrom = 'to';
    } else {
        toOrFrom = 'from';
    }
    return (
        <div>
            <p>Transferred {amount} {toOrFrom} account {accountId}</p>
        </div>
    )
}

export default TransactionRow;
