import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import Avatar from "./Avatar";
import {RootStoreProps} from "@store/RootStoreProvider";

interface Props {
    size?: number,
}

@inject("rootStore")
@observer
export default class LoginUserAvatar extends Component<Props & RootStoreProps> {

    static defaultProps = {
        size: 60,
    };

    @observable notSet;

    render() {
        const {size, rootStore} = this.props;
        const {email, shortName} = rootStore.auth;
        return (
            <Avatar
                size={size}
                demo={true}
                email={email}
                title={shortName}/>

        )
    }
}
