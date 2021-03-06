import {Animated, Easing, StyleProp, ViewStyle} from "react-native";
import {observer} from "mobx-react";
import React, {Component} from "react";
import {observable} from "mobx";
import {CardPosition} from "@common/components/CardWithModal/CardModels";
import Layout from "@constants/Layout";

interface Props {
    style: any;
    imageWrapperStyle: StyleProp<ViewStyle>;
    pressItem: CardPosition;
    scrollY?: Animated.Value;
    imageHeight: number;
    imageHeightLarge: number;
    isChangeBodyHeight?: boolean;
    bodyHeight?: number,
    bodyHeightLarge?: number,
}

@observer
export default class AnimatedCard extends Component<Props> {

    @observable phase = new Animated.Value(0);

    open(duration): Promise<any> {
        return new Promise(resolve => {
            Animated.sequence([
                Animated.timing(this.phase, {
                    easing: Easing.inOut(Easing.ease),
                    toValue: 1,
                    duration,
                    delay: 0,
                    useNativeDriver: false,
                }),
            ]).start(resolve);
        })
    }

    close(duration): Promise<any> {
        return new Promise(resolve => {
            Animated.sequence([
                Animated.timing(this.phase, {
                    easing: Easing.inOut(Easing.ease),
                    toValue: 0,
                    duration,
                    delay: 0,
                    useNativeDriver: false,
                }),
            ]).start(resolve);
        })
    }

    render() {
        const {style, imageWrapperStyle, pressItem} = this.props;
        const {imageHeight, imageHeightLarge} = this.props;
        const {isChangeBodyHeight, bodyHeight, bodyHeightLarge} = this.props;
        const ani = {
            card: {
                position: "absolute",
                top: this.phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [pressItem.py, 0],
                }),
                left: this.phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [pressItem.px, 0],
                }),
                width: this.phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [pressItem.width, Layout.window.width],
                }),
                // borderRadius: this.phase.interpolate({
                //     inputRange: [0, 1],
                //     outputRange: [10, 0],
                // }),
                // ...getPlatformElevation(2)
            },
            image: {
                height: this.phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [imageHeight, imageHeightLarge],
                })
            },
            imageScale: {
                transform: [
                    {
                        translateY: this.props.scrollY.interpolate({
                            inputRange: [-200, 0, 200],
                            outputRange: [0, 0, 60],
                        })
                    }
                ]
            },
            body: isChangeBodyHeight ? {
                opacity: this.phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
                height: this.phase.interpolate({
                    inputRange: [0, 1],
                    outputRange: [bodyHeight, bodyHeightLarge],
                })
            } : {}
        };

        return (
            <Animated.View style={[style, ani.card]}>
                <Animated.View style={ani.imageScale}>
                    <Animated.View style={[imageWrapperStyle, ani.image]}>
                        {this.props.children[0]}
                    </Animated.View>
                </Animated.View>
                <Animated.View style={ani.body}>
                    {this.props.children[1]}
                </Animated.View>
            </Animated.View>
        )
    }
}

