import React from 'react';
import {observer} from "mobx-react";
import CarouselListItemContent from "./ListItemContent";
import BaseListItem from "../BaseListItem";
import CardImage from "@common/components/CardImage";

@observer
export default class CarouselListItem extends BaseListItem {

    render() {
        const {item} = this.props;
        return (
            <CardImage
                image={item.imageSource}
                imageHeight={230}
                onPress={this.onPressed}
                activeAnimation
            >
                <CarouselListItemContent item={item}/>
            </CardImage>
        );
    }
}


