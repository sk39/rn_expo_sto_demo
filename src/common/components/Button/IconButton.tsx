import React, {Component} from "react";
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from "react-native";
import {Icon} from "react-native-elements";

interface Props {
    name: string;
    type: string;
    containerStyle?: StyleProp<ViewStyle>;
    color?: string;
    shadowColor?: string;
    size?: number;
    onPress: () => void;
}

export default class IconButton extends Component<Props> {

    static defaultProps = {
        color: "white",
        shadowColor: "rgba(0,0,0,0.3)",
        size: 24,
    };

    render() {
        const {name, type, containerStyle, color, shadowColor, size, onPress} = this.props;
        return (
            <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
                <View style={styles.shadow}>
                    <Icon name={name}
                          type={type}
                          color={shadowColor}
                          size={size}/>
                </View>
                <Icon name={name}
                      type={type}
                      color={color}
                      size={size}/>
            </TouchableOpacity>
        )
    }
}

const size = 46;
const styles = StyleSheet.create({
    container: {
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center'
    },
    shadow: {
        position: "absolute",
        zIndex: 0,
        top: 12,
        right: 9,
    }
});
