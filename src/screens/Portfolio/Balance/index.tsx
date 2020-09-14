import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {inject, observer} from "mobx-react";
import Colors from "@constants/Colors";
import AnimatedRow from "@common/components/Animation/AnimatedRow";
import {ActionSheet, Icon} from "native-base";
import SimpleList from "@common/components/List/SimpleList";
import NumberLabel from "@common/components/Label/NumberLabel";
import BalancePieChart from "./BalancePieChart";
import BalanceState from "./BalanceState";
import PortfolioChild from "../PortfolioChild";
import Skeleton from "@common/components/PageSupport/Skeleton";
import PortfolioListSupport from "../PortfolioListSupport";

@inject("rootStore")
@observer
export default class BalanceList extends PortfolioChild {

    balanceState: BalanceState;

    constructor(props) {
        super(props);
        this.balanceState = new BalanceState(props.rootStore.balance);
    }

    loadData() {
        this.balanceState.loadData();
    }

    showDetail(item) {
        this.props.navigation.navigate("TokenDetail", {symbol: item.symbol})
    }

    showInvest(item) {
        this.props.navigation.navigate("InvestToken", {symbol: item.symbol})
    }

    onSelect(item, index) {
        let actions = [];
        if (!item.symbol) {
            actions.push({label: "Deposit", method: () => alert("TODO:")})
            actions.push({label: "Withdraw", method: () => alert("TODO:")})
        } else {
            actions.push({label: "Show Detail", method: this.showDetail.bind(this)})
            actions.push({label: "Invest", method: this.showInvest.bind(this)})
        }

        actions.push({label: t("btn.cancel")});
        const CANCEL_INDEX = actions.length - 1;
        ActionSheet.show(
            {
                options: actions.map(a => a.label),
                cancelButtonIndex: CANCEL_INDEX,
                title: `${item.name} Actions`
            },
            buttonIndex => {
                const action = actions[buttonIndex];
                if (action && action.method) {
                    action.method(item)
                }
            }
        )
    }

    renderItem = ({item, index}) => {
        let valEL;
        if (!item.symbol) {
            valEL = (
                <View style={styles.valueWrapper}>
                    <NumberLabel
                        value={item.balanceBaseCurrency}
                        decimals={0}
                        prefix={"$"}
                        style={styles.balanceBaseCurrency}
                    />
                </View>
            )
        } else {
            valEL = (
                <View style={styles.valueWrapper}>
                    <NumberLabel
                        value={item.balanceBaseCurrency}
                        decimals={0}
                        prefix={"$"}
                        style={styles.balanceBaseCurrency}
                    />
                    <NumberLabel
                        value={item.balance}
                        decimals={1}
                        style={styles.value}
                        suffix={item.symbol}
                        suffixStyle={styles.unit}
                    />
                </View>
            );
        }
        return (
            <TouchableOpacity key={item.symbol || "base"} onPress={() => this.onSelect(item, index)}>
                <AnimatedRow delay={120 * index}>
                    <View style={styles.row}>
                        <View style={styles.tokenNameWrapper}>
                            <View style={[styles.mark, {backgroundColor: item.color}]}/>
                            <Text style={styles.tokenName}>{item.name}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            {valEL}
                            <Icon name='more-vertical' type="Feather" style={styles.moreIcon}/>
                        </View>
                    </View>
                </AnimatedRow>
            </TouchableOpacity>
        )
    }

    renderList() {
        const {auth} = this.props.rootStore;
        if (!auth.loggedIn || this.balanceState.list.length === 0) {
            return (
                <Skeleton line={4}/>
            )
        }
        return (
            <SimpleList
                data={this.balanceState.list}
                renderItem={this.renderItem}/>
        )
    }

    render() {
        const {balanceState} = this;
        return (
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>Your Balances</Text>
                </View>
                <BalancePieChart balanceState={balanceState} height={174} innerRadius={"86"}>
                    <Text style={styles.totalBalanceLabel}>
                        Total
                    </Text>
                    <NumberLabel
                        value={balanceState.total}
                        decimals={0}
                        prefix={"$"}
                        style={styles.totalBalance}/>
                </BalancePieChart>
                <View style={styles.listWrapper}>
                    {this.renderList()}
                </View>
                <PortfolioListSupport processing={this.balanceState.processing}
                                      errorMessage={this.balanceState.balancesStore.errorMessage}
                                      list={this.balanceState.list}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    titleWrapper: {
        paddingBottom: 16,
    },
    title: {
        marginTop: 8,
        fontSize: 18,
        color: Colors.toolBarInverse,
        opacity: 0.7,
        fontWeight: "700",
        letterSpacing: 1,
    },
    listWrapper: {
        minHeight: 40,
        paddingTop: 12,
    },
    totalBalanceLabel: {
        marginTop: -7,
        color: Colors.labelFont,
        fontSize: 14,
        opacity: 0.6,
        fontWeight: "700",
        letterSpacing: 1,
        ...Platform.select({
            ios: {
                marginBottom: 2,
            },
        })
    },
    totalBalance: {
        color: Colors.primaryDark,
        opacity: 0.8,
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: 1,
    },
    row: {
        padding: 8,
        paddingVertical: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 60,
        borderBottomWidth: 1,
        borderBottomColor: Colors.listBorder,
    },
    moreIcon: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.labelFontThin
    },
    tokenName: {
        color: Colors.labelFont,
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 2
    },
    label: {
        color: Colors.labelFont,
        fontSize: 16,
    },
    valueWrapper: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    value: {
        marginTop: 2,
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1
    },
    unit: {
        color: Colors.primary2,
        fontSize: 10,
        fontWeight: "700",
        lineHeight: 18,
        marginTop: 4,
        marginLeft: 4,
    },
    balanceBaseCurrency: {
        color: Colors.font,
        fontSize: 16,
        letterSpacing: 1,
    },
    tokenNameWrapper: {
        flexDirection: "row",
        alignItems: "center"
    },
    mark: {
        width: 8,
        height: 8,
        // borderRadius: 50,
        marginRight: 10
    }
});