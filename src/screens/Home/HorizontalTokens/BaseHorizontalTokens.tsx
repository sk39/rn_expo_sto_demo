import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import TokenState from "../../Token/TokenState";
import HomeChildTitle from "../HomeChildTitle";
import HomeListSupport from "../HomeListSupport";
import HorizontalListItem from "../../Token/List/Horizontal/ListItem";
import RootStore from "@store/RootStore";
import AnimatedSlide from "@common/components/Animation/AnimatedSlide";
import Colors from "@constants/Colors";

interface Props {
    rootStore: RootStore;
    navigation: Navigation
}

export default class BaseHorizontalTokens extends Component<Props> {

    tokenState: TokenState;
    title;
    list;

    constructor(props) {
        super(props);
        this.tokenState = new TokenState(props.navigation, props.rootStore)
    }

    onListItemPressed = item => {
        const {tokenState} = this;
        tokenState.navigation.setParams({tabBarVisible: item == null})
        tokenState.selectItem(item);
    };

    onLinkPress = () => {
        this.props.navigation.navigate("Tokens")
    }

    renderItem = ({item, index}) => {
        const {tokenState} = this;
        const {list} = tokenState;
        const style = {
            paddingRight: index === (list.length - 1) ? 12 : 8,
            paddingLeft: index === 0 ? 12 : 0,
            paddingVertical: 4,
        }

        return (
            <View key={item.name}
                  style={style}>
                <AnimatedSlide delay={(index + 1) * 36}
                               direction="toLeft"
                               duration={700}
                               moveDistance={8}>
                    <View style={styles.itemWrapper}>
                        <HorizontalListItem
                            item={item}
                            tokenState={tokenState}
                            onPress={this.onListItemPressed}
                        />
                    </View>
                </AnimatedSlide>
            </View>
        );
    };

    render() {
        const {tokenState} = this;
        const {processing} = tokenState;
        return (
            <View style={styles.container}>
                <HomeChildTitle title={this.title}
                                linkTitle="More"
                                onLinkPress={this.onLinkPress}
                />
                <FlatList
                    data={this.list}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.name}
                    renderItem={this.renderItem}
                />
                <HomeListSupport processing={processing && this.list.length === 0}
                                 list={this.list}
                                 paddingTop={30}
                                 errorMessage={tokenState.stoStore.errorMessage}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: 226,
    },
    itemWrapper: {
        borderWidth: 1,
        borderColor: Colors.listBorder
    }
});