import {Animated, StyleSheet} from "react-native";
import {observer} from "mobx-react";
import React, {Component} from "react";
import Colors from "@constants/Colors";
import Layout from "@constants/Layout";
import ViewUtils from "@common/utils/ViewUtils";

interface Props {
    phase: Animated.Value;
    scrollY: Animated.Value;
    imageHeightLarge?: number;
}

@observer
export default class AnimatedCardHeader extends Component<Props> {

    static defaultProps = {
        imageHeightLarge: Layout.card.imageHeightLarge,
    };

    render() {
        const {phase, scrollY, imageHeightLarge} = this.props;
        const ani = {
            header: {
                transform: [
                    {
                        translateY: phase.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-(60 + ViewUtils.getPagePaddingTop()), 0],
                        })
                    },
                ]
            },
            background: {
                opacity: scrollY.interpolate({
                    inputRange: [0, imageHeightLarge],
                    outputRange: [0, 1],
                })
            }
        };

        return (
            <Animated.View style={[styles.header, ani.header]}>
                <Animated.View style={[styles.background, ani.background]}/>
                {this.props.children}
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        zIndex: 1,
        width: Layout.window.width,
        paddingTop: ViewUtils.getStatusBarHeight(),
    },
    background: {
        backgroundColor: Colors.toolBarInverse,
        ...StyleSheet.absoluteFillObject
    },
});
