import React from 'react';
import '../resources/analytics.css';
import { Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function Analytics({ transactions }) {
    const totalTransactions = transactions.length;
    const totalIncomeTransactions = transactions.filter(transaction => transaction.type === 'income');
    const totalExpenseTransactions = transactions.filter(transaction => transaction.type === 'expense');

    const totalIncomeTurnover = totalIncomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpenseTurnover = totalExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    // Wages Calculation (Employee Salary)
    const totalWages = totalExpenseTransactions
        .filter(transaction => transaction.category === 'Employee Salary')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    // Taxes Calculation (Assumed to be 10% of total income)
    const totalTaxes = totalIncomeTurnover * 0.1;

    // Profit Calculation
    const profit = totalIncomeTurnover - (totalExpenseTurnover + totalWages + totalTaxes);

    const categories = ['Raw Material', 'Transportation', 'Food Products', 'Machine Equipment', 'Vehicle Service', 'Other Income', 'Employee Salary', 'Equipment Purchase', 'Building Rent', 'Sells'];

    const data = categories.map(category => {
        const incomeAmount = totalIncomeTransactions
            .filter(t => t.category === category)
            .reduce((acc, t) => acc + t.amount, 0);
        const expenseAmount = totalExpenseTransactions
            .filter(t => t.category === category)
            .reduce((acc, t) => acc + t.amount, 0);
        
        return {
            category,
            income: incomeAmount,
            expense: expenseAmount
        };
    }).filter(item => item.income > 0 || item.expense > 0); // Filter out empty categories

    return (
        <div className='analytics'>
            {/* Row with Total Transactions, Profit, and Bar Chart */}
            <div className="row">
                {/* Total Transactions */}
                <div className="col-md-4 mt-3">
                    <div className="transactions-count">
                        <h4>Total Transactions: {totalTransactions}</h4>
                        <hr />
                        <h5>Income: {totalIncomeTransactions.length}</h5>
                        <h5>Expense: {totalExpenseTransactions.length}</h5>
                        <div className="progress-bars">
                            <Progress type='circle' percent={((totalIncomeTransactions.length / totalTransactions) * 100).toFixed(0)} strokeColor='green' />
                            <Progress type='circle' percent={((totalExpenseTransactions.length / totalTransactions) * 100).toFixed(0)} strokeColor='red' />
                        </div>
                    </div>
                </div>

                {/* Total Turnover, Wages, Taxes, and Profit */}
                <div className="col-md-4 mt-3">
                    <div className="transactions-count">
                        <h4>Total Turnover</h4>
                        <hr />
                        <h5>Income: Rs. {totalIncomeTurnover}</h5>
                        <h5>Expense: Rs. {totalExpenseTurnover}</h5>
                        <h5>Wages: Rs. {totalWages}</h5>
                        <h5>Taxes (10% of Income): Rs. {totalTaxes}</h5>
                        <h5>Profit: Rs. {profit}</h5> {/* Display Profit */}
                        <div className="progress-bars">
                            <Progress type='circle' percent={((totalIncomeTurnover / (totalIncomeTurnover + totalExpenseTurnover)) * 100).toFixed(0)} strokeColor='green' />
                            <Progress type='circle' percent={((totalExpenseTurnover / (totalIncomeTurnover + totalExpenseTurnover)) * 100).toFixed(0)} strokeColor='red' />
                        </div>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="col-md-4 mt-3">
                    <h4>Income and Expense by Category</h4>
                    <BarChart width={350} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="income" fill="green" />
                        <Bar dataKey="expense" fill="red" />
                    </BarChart>
                </div>
            </div>

            <hr />

            {/* Income and Expense Category Wise */}
            <div className="row">
                {/* Income Category Wise */}
                <div className="col-md-6">
                    <CategoryAnalysis
                        title="Income - Category Wise"
                        categories={categories}
                        transactions={totalIncomeTransactions}
                        totalTurnover={totalIncomeTurnover}
                        strokeColor="green"
                    />
                </div>

                {/* Expense Category Wise */}
                <div className="col-md-6">
                    <CategoryAnalysis
                        title="Expense - Category Wise"
                        categories={categories}
                        transactions={totalExpenseTransactions}
                        totalTurnover={totalExpenseTurnover}
                        strokeColor="red"
                    />
                </div>
            </div>
        </div>
    );
}

// Refactored Category Analysis Component
function CategoryAnalysis({ title, categories, transactions, totalTurnover, strokeColor }) {
    return (
        <div className="category-analysis">
            <h4>{title}</h4>
            {categories.map((category) => {
                const amount = transactions
                    .filter(t => t.category === category)
                    .reduce((acc, t) => acc + t.amount, 0);
                return (
                    amount > 0 && (
                        <div className="category-card" key={category}>
                            <h5>{category}</h5>
                            <Progress percent={((amount / totalTurnover) * 100).toFixed(0)} strokeColor={strokeColor} />
                        </div>
                    )
                );
            })}
        </div>
    );
}

export default Analytics;
