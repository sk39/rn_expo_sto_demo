import React, {PureComponent} from 'react';
import {FlatList, StatusBar, StyleSheet, View} from 'react-native';
import Toolbar from './Toolbar';
import {ListItem} from "../ListItem";
import AnimatedRow from "@common/components/Animation/AnimatedRow";
import {observer} from "mobx-react";
import {observable} from "mobx";
import ListPageSupport from "@common/components/PageSupport/ListPageSupport";
import TokenState from "../TokenState";
import Colors from "@constants/Colors";

interface Props {
    tokenState: TokenState;
}

@observer
export default class List extends PureComponent<Props> {

    @observable refreshing = false;

    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.props.tokenState.navigation.addListener(
            'didFocus',
            () => {
                this.props.tokenState.loadData(true);
            }
        );
    }

    onListItemPressed = item => {
        const {tokenState} = this.props
        tokenState.navigation.setParams({tabBarVisible: item == null})
        tokenState.selectItem(item);
    };

    renderItem = ({item, index}) => {
        const {tokenState} = this.props;
        return (
            <View key={item.name}
                  style={[styles.cardWrapper, {paddingTop: index === 0 ? 12 : 0}]}>
                <AnimatedRow delay={(index + 1) * 200}>
                    <ListItem
                        item={item}
                        tokenState={tokenState}
                        onPress={this.onListItemPressed}
                    />
                </AnimatedRow>
            </View>
        );
    };

    async onRefresh() {
        const {tokenState} = this.props;
        this.refreshing = true;
        await tokenState.loadData();
        this.refreshing = false;
    }

    render() {
        const {tokenState} = this.props;
        const {list, processing} = tokenState;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent backgroundColor={"rgba(0,0,0,0)"}/>
                <Toolbar/>
                <FlatList
                    data={list}
                    keyExtractor={item => item.name}
                    refreshing={this.refreshing}
                    onRefresh={this.onRefresh}
                    renderItem={this.renderItem}
                />
                <ListPageSupport processing={processing && list.length === 0} list={list}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backColor
    },
    cardWrapper: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    }
});
