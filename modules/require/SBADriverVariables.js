define([], function () {
    var SBA_DRIVER_VARIABLES = {
        "collection_variables": {
            "driverConstants": [
                {
                    "key": "revenue_perc_change",
                    "value": {
                        "negative": "Your revenue percentage change over past 9 months was ",
                        "positive": "Your revenue percentage change over past 9 months was "
                    }
                },
                {
                    "key": "inventory_turnover_perc_change",
                    "value": {
                        "negative": "Your inventory turnover percentage change over past 9 months was ",
                        "positive": "Your inventory turnover percentage change over past 9 months was "
                    }
                },
                {
                    "key": "age_of_business",
                    "value": {
                        "negative": "Your age of business was ",
                        "positive": "Your age of business was "
                    }
                },
                {
                    "key": "profit_margin_perc_change",
                    "value": {
                        "negative": "Your profit margin percentage change over past 9 months was ",
                        "positive": "Your profit margin percentage change over past 9 months was "
                    }
                },
                {
                    "key": "num_customers_perc_change",
                    "value": {
                        "negative": "Your number of customers percentage change over past 9 months was ",
                        "positive": "Your number of customers percentage change over past 9 months was "
                    }
                },
                {
                    "key": "ac_payable_turnover_perc_change",
                    "value": {
                        "negative": "Your ac payable turnover percentage change over past 9 months was ",
                        "positive": "Your ac payable turnover percentage change over past 9 months was "
                    }
                },
                {
                    "key": "cashflow_perc_change",
                    "value": {
                        "negative": "Your cash flow percentage change over past 9 months was ",
                        "positive": "Your cash flow percentage change over past 9 months was "
                    }
                },
                {
                    "key": "cashflow_to_debt_ratio_perc_change",
                    "value": {
                        "negative": "Your cashflow-to-debt ratio percentage change over past 9 months was ",
                        "positive": "Your cashflow-to-debt ratio percentage change over past 9 months was "
                    }
                },
                {
                    "key": "working_capital_ratio_perc_change",
                    "value": {
                        "negative": "Your working capital ratio percentage change over past 9 months was ",
                        "positive": "Your working capital ratio percentage change over past 9 months was "
                    }
                },
                {
                    "key": "ac_receivable_turnover_perc_change",
                    "value": {
                        "negative": "Your ac receivable turnover percentage change over past 9 months was ",
                        "positive": "Your ac receivable turnover percentage change over past 9 months was "
                    }
                },
                {
                    "key": "num_suppliers_perc_change",
                    "value": {
                        "negative": "Your number of suppliers percentage change over past 9 months was ",
                        "positive": "Your number of suppliers percentage change over past 9 months was "
                    }
                },
                {
                    "key": "roe_perc_change",
                    "value": {
                        "negative": "Your roe percentage change over past 9 months was ",
                        "positive": "Your roe percentage change over past 9 months was "
                    }
                },
                {
                    "key": "debt_asset_ratio_percent_change",
                    "value": {
                        "negative": "Your debt asset ratio percentage change over past 9 months was ",
                        "positive": "Your debt asset ratio percentage change over past 9 months was "
                    }
                },
                {
                    "key": "expense_perc_change",
                    "value": {
                        "negative": "Your expense percentage change over past 9 months was ",
                        "positive": "Your expense percentage change over past 9 months was "
                    }
                }
            ],
            "insightConstants": [
                {
                    "key": "new_balance_prev_month",
                    "value": {
                        "negative": "Your balance last month was [amount]",
                        "positive": "Your balance last month was [amount]"
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio",
                    "value": {
                        "negative": "Your balance has changed over the last month by [%]",
                        "positive": "Your balance has changed over the last month by [%]"
                    }
                },
                {
                    "key": "expense_transactions_1_month_diff_prevmonth",
                    "value": {
                        "negative": "Your expenses have changed over the  last month by [amount]",
                        "positive": "Your expenses have changed over the  last month by [amount]"
                    }
                },
                {
                    "key": "expense_transactions_1_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your expenses have changed over the  last month by [%]",
                        "positive": "Your expenses have changed over the  last month by [%]"
                    }
                },
                {
                    "key": "expense_transactions_3_month_diff_prevmonth",
                    "value": {
                        "negative": "Your expenses have changed over the last 3 months by [amount]",
                        "positive": "Your expenses have changed over the last 3 months by [amount]"
                    }
                },
                {
                    "key": "expense_transactions_3_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your expenses have changed over the last 3 months by [%]",
                        "positive": "Your expenses have changed over the last 3 months by [%]"
                    }
                },
                {
                    "key": "expense_transactions_6_month_diff_prevmonth",
                    "value": {
                        "negative": "Your expenses have changed over the last 6 months by [amount]",
                        "positive": "Your expenses have changed over the last 6 months by [amount]"
                    }
                },
                {
                    "key": "expense_transactions_6_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your expenses have changed over the last 6 months by [%]",
                        "positive": "Your expenses have changed over the last 6 months by [%]"
                    }
                },
                {
                    "key": "income_transactions_1_month_diff_prevmonth",
                    "value": {
                        "negative": "Your income has changed over the  last month by [amount]",
                        "positive": "Your income has changed over the  last month by [amount]"
                    }
                },
                {
                    "key": "income_transactions_1_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your income has changed over the  last month by [%]",
                        "positive": "Your income has changed over the  last month by [%]"
                    }
                },
                {
                    "key": "income_transactions_3_month_diff_prevmonth",
                    "value": {
                        "negative": "Your income has changed over the  last 3 months by [amount]",
                        "positive": "Your income has changed over the  last 3 months by [amount]"
                    }
                },
                {
                    "key": "income_transactions_3_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your income has changed over the  last 3 months by [%]",
                        "positive": "Your income has changed over the  last 3 months by [%]"
                    }
                },
                {
                    "key": "income_transactions_6_month_diff_prevmonth",
                    "value": {
                        "negative": "Your income has changed over the  last 6 months by [amount]",
                        "positive": "Your income has changed over the  last 6 months by [amount]"
                    }
                },
                {
                    "key": "income_transactions_6_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your income has changed over the  last 6 months by [%]",
                        "positive": "Your income has changed over the  last 6 months by [%]"
                    }
                },
                {
                    "key": "net_transaction_1_month_diff_prevmonth",
                    "value": {
                        "negative": "Your net transaction value over the last month has changed by [amount]",
                        "positive": "Your net transaction value over the last month has changed by [amount]"
                    }
                },
                {
                    "key": "net_transaction_1_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your net transaction value over the last month has changed by [%]",
                        "positive": "Your net transaction value over the last month has changed by [%]"
                    }
                },
                {
                    "key": "net_transaction_3_month_diff_prevmonth",
                    "value": {
                        "negative": "Your net transaction value over the last 3 months has changed by [amount]",
                        "positive": "Your net transaction value over the last 3 months has changed by [amount]"
                    }
                },
                {
                    "key": "net_transaction_3_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your net transaction value over the last 3 months has changed by [%]",
                        "positive": "Your net transaction value over the last 3 months has changed by [%]"
                    }
                },
                {
                    "key": "net_transaction_6_month_diff_prevmonth",
                    "value": {
                        "negative": "Your net transaction value over the last 6 months has changed by [amount]",
                        "positive": "Your net transaction value over the last 6 months has changed by [amount]"
                    }
                },
                {
                    "key": "net_transaction_6_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your net transaction value over the last 6 months has changed by [%]",
                        "positive": "Your net transaction value over the last 6 months has changed by [%]"
                    }
                },
                {
                    "key": "new_balance_1_month_diff_prevmonth",
                    "value": {
                        "negative": "Your balance has changed over the last month by [amount]",
                        "positive": "Your balance has changed over the last month by [amount]"
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your balance has changed over the  last  month by [%]",
                        "positive": "Your balance has changed over the  last  month by [%]"
                    }
                },
                {
                    "key": "new_balance_3_month_diff_prevmonth",
                    "value": {
                        "negative": "Your balance has changed over the  last 3 months by [amount]",
                        "positive": "Your balance has changed over the  last 3 months by [amount]"
                    }
                },
                {
                    "key": "new_balance_3_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your balance has changed over the  last 3 months by [%]",
                        "positive": "Your balance has changed over the  last 3 months by [%]"
                    }
                },
                {
                    "key": "new_balance_6_month_diff_prevmonth",
                    "value": {
                        "negative": "Your balance has changed over the  last 6 months by [amount]",
                        "positive": "Your balance has changed over the  last 6 months by [amount]"
                    }
                },
                {
                    "key": "new_balance_6_month_diff_ratio_prevmonth",
                    "value": {
                        "negative": "Your balance has changed over the  last 6 months by [%]",
                        "positive": "Your balance has changed over the  last 6 months by [%]"
                    }
                },
                {
                    "key": "expense_transactions_3_month_max",
                    "value": {
                        "negative": "Your maximum expense transaction value over past 3 months was [amount]",
                        "positive": "Your maximum expense transaction value over past 3 months was [amount]"
                    }
                },
                {
                    "key": "expense_transactions_3_month_min",
                    "value": {
                        "negative": "Your minimum expense transaction value over past 3 months was [amount]",
                        "positive": "Your minimum expense transaction value over past 3 months was [amount]"
                    }
                },
                {
                    "key": "expense_transactions_6_month_avg",
                    "value": {
                        "negative": "Your average expense transaction value over past 6 months was [amount]",
                        "positive": "Your average expense transaction value over past 6 months was [amount]"
                    }
                },
                {
                    "key": "expense_transactions_6_month_max",
                    "value": {
                        "negative": "Your maximum expense transaction value over past 6 months was [amount]",
                        "positive": "Your maximum expense transaction value over past 6 months was [amount]"
                    }
                },
                {
                    "key": "expense_transactions_6_month_min",
                    "value": {
                        "negative": "Your minimum expense transaction value over past 6 months was [amount]",
                        "positive": "Your minimum expense transaction value over past 6 months was [amount]"
                    }
                },
                {
                    "key": "income_transactions_3_month_max",
                    "value": {
                        "negative": "Your maximum income transaction value over past 3 months was [amount]",
                        "positive": "Your maximum income transaction value over past 3 months was [amount]"
                    }
                },
                {
                    "key": "income_transactions_3_month_min",
                    "value": {
                        "negative": "Your minimum income transaction value over past 3 months was [amount]",
                        "positive": "Your minimum income transaction value over past 3 months was [amount]"
                    }
                },
                {
                    "key": "income_transactions_3_month_avg",
                    "value": {
                        "negative": "Your average income transaction value over past 3 months was [amount]",
                        "positive": "Your average income transaction value over past 3 months was [amount]"
                    }
                },
                {
                    "key": "income_transactions_6_month_max",
                    "value": {
                        "negative": "Your maximum income transaction value over past 6 months was [amount]",
                        "positive": "Your maximum income transaction value over past 6 months was [amount]"
                    }
                },
                {
                    "key": "income_transactions_6_month_min",
                    "value": {
                        "negative": "Your minimum income transaction value over past 6 months was [amount]",
                        "positive": "Your minimum income transaction value over past 6 months was [amount]"
                    }
                },
                {
                    "key": "income_transactions_6_month_avg",
                    "value": {
                        "negative": "Your average income transaction value over past 6 months was [amount]",
                        "positive": "Your average income transaction value over past 6 months was [amount]"
                    }
                },
                {
                    "key": "net_transaction_3_month_max",
                    "value": {
                        "negative": "Your maximum net transaction value over past 3 months was [amount] ",
                        "positive": "Your maximum net transaction value over past 3 months was [amount] "
                    }
                },
                {
                    "key": "net_transaction_3_month_min",
                    "value": {
                        "negative": "Your minimum net transaction value over past 3 months was [amount] ",
                        "positive": "Your minimum net transaction value over past 3 months was [amount] "
                    }
                },
                {
                    "key": "net_transaction_3_month_avg",
                    "value": {
                        "negative": "Your average net transaction value over past 3 months was [amount] ",
                        "positive": "Your average net transaction value over past 3 months was [amount] "
                    }
                },
                {
                    "key": "net_transaction_6_month_max",
                    "value": {
                        "negative": "Your maximum net income transaction value over past 6 months was [amount] ",
                        "positive": "Your maximum net income transaction value over past 6 months was [amount] "
                    }
                },
                {
                    "key": "net_transaction_6_month_min",
                    "value": {
                        "negative": "Your minimum net transaction value over past 6 months was [amount] ",
                        "positive": "Your minimum net transaction value over past 6 months was [amount] "
                    }
                },
                {
                    "key": "net_transaction_6_month_avg",
                    "value": {
                        "negative": "Your average net transaction value over past 6 months was [amount] ",
                        "positive": "Your average net transaction value over past 6 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_3_month_max",
                    "value": {
                        "negative": "Your maximum balance value over past 3 months was [amount] ",
                        "positive": "Your maximum balance value over past 3 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_3_month_min",
                    "value": {
                        "negative": "Your minimum balance value over past 3 months was [amount] ",
                        "positive": "Your minimum balance value over past 3 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_3_month_avg",
                    "value": {
                        "negative": "Your average balance value over past 3 months was [amount] ",
                        "positive": "Your average balance value over past 3 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_6_month_max",
                    "value": {
                        "negative": "Your maximum net income transaction value over past 6 months was [amount] ",
                        "positive": "Your maximum net income transaction value over past 6 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_6_month_min",
                    "value": {
                        "negative": "Your minimum balance value over past 6 months was [amount] ",
                        "positive": "Your minimum balance value over past 6 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_6_month_avg",
                    "value": {
                        "negative": "Your average balance value over past 6 months was [amount] ",
                        "positive": "Your average balance value over past 6 months was [amount] "
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio_3_month_max",
                    "value": {
                        "negative": "Your maximum balance difference over past 3 months was [%] ",
                        "positive": "Your maximum balance difference over past 3 months was [%] "
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio_3_month_min",
                    "value": {
                        "negative": "Your minimum balance difference over past 3 months was [%] ",
                        "positive": "Your minimum balance difference over past 3 months was [%] "
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio_3_month_avg",
                    "value": {
                        "negative": "Your average balance difference over past 3 months was [%] ",
                        "positive": "Your average balance difference over past 3 months was [%] "
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio_6_month_max",
                    "value": {
                        "negative": "Your maximum net income transaction difference over past 6 months was [%] ",
                        "positive": "Your maximum net income transaction difference over past 6 months was [%] "
                    }
                },
                {
                    "key": "new_balance_1_month_diff_ratio_6_month_min",
                    "value": {
                        "negative": "Your minimum balance difference over past 6 months was [%] ",
                        "positive": "Your minimum balance difference over past 6 months was [%] "
                    }
                },
                {
                    "key": "net_transaction_prev_month",
                    "value": {
                        "negative": "Your net transaction value last month was [amount]",
                        "positive": "Your net transaction value last month was [amount]"
                    }
                },
                {
                    "key": "CompanyProfitAfterTax",
                    "value": {
                        "negative": "Your last profit after tax value was [amount]",
                        "positive": "Your last profit after tax value was [amount]"
                    }
                },
                {
                    "key": "CompanyCurrentAssets",
                    "value": {
                        "negative": "Your last current assets value was [amount]",
                        "positive": "Your last current assets value was [amount]"
                    }
                },
                {
                    "key": "CompanyCurrentRatio",
                    "value": {
                        "negative": "Your last current ratio value was [amount]",
                        "positive": "Your last current ratio value was [amount]"
                    }
                },
                {
                    "key": "CompanyTangibleNetWorth",
                    "value": {
                        "negative": "Your last tangible net worth value was [amount]",
                        "positive": "Your last tangible net worth value was [amount]"
                    }
                },
                {
                    "key": "CompanyCashAndEquivalent",
                    "value": {
                        "negative": "Your last cash and equivalent value was [amount]",
                        "positive": "Your last cash and equivalent value was [amount]"
                    }
                },
                {
                    "key": "CompanyTotalAssetsLiabilityRatio",
                    "value": {
                        "negative": "Your last total assets to liability ratio value was [amount]",
                        "positive": "Your last total assets to liability ratio value was [amount]"
                    }
                }
            ]
        },
        "simple_variables": {}
    };
    return SBA_DRIVER_VARIABLES;
});