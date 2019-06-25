import React from 'react';
import TextBoxMenuItem from './menuItems/TextBoxMenuItem';
import CheckBoxMenuItem from './menuItems/CheckBoxMenuItem';
import CanvasMenuItem from './menuItems/CanvasMenuItem';
import ColorMenuItem from './menuItems/ColorMenuItem';
import ConfigMenu from './ConfigMenu';
import IUserConfig from './IUserConfig';
interface ILookingAtYouConfig {
    config: IUserConfig,
    store: { (partialState: Partial<IUserConfig>): void }
}
export default function LookingAtYouConfig(props: ILookingAtYouConfig) {
    return (
        <ConfigMenu width="14em" timerLength={1000}>
            <TextBoxMenuItem
                name={"X Sensitivity"}
                defaultValue={`${props.config.xSensitivity}`}
                isValidInput={(sens: string) => !isNaN(parseFloat(sens))}
                onValidInput={(sens: string) => props.store({ xSensitivity: parseFloat(sens) })}
                parse={(text: string) => `${parseFloat(text)}`} />
            <TextBoxMenuItem
                name={"Y Sensitivity"}
                defaultValue={`${props.config.ySensitivity}`}
                isValidInput={(sens: string) => !isNaN(parseFloat(sens))}
                onValidInput={(sens: string) => props.store({ ySensitivity: parseFloat(sens) })}
                parse={(text: string) => `${parseFloat(text)}`} />
            <TextBoxMenuItem
                name={"FPS"}
                defaultValue={`${props.config.fps}`}
                isValidInput={(fps: string) => !isNaN(parseInt(fps))}
                onValidInput={(fps: string) => props.store({ fps: parseInt(fps) })}
                parse={(text: string) => `${parseInt(text)}`} />
            <CheckBoxMenuItem
                name={"Swap Eyes"}
                checked={props.config.swapEyes}
                onInputChange={(swapEyes: boolean) => props.store({ swapEyes })} />
            <CheckBoxMenuItem
                name={"Toggle Debug"}
                checked={props.config.toggleDebug}
                onInputChange={(toggleDebug: boolean) => props.store({ toggleDebug })} />
            <ColorMenuItem
                name={"Iris Color"}
                color={props.config.irisColor}
                onInputChange={(irisColor: string) => props.store({ irisColor })} />
            <CanvasMenuItem
                name={"Left Camera"}/>
            <CanvasMenuItem
                name={"Right Camera"}/>
        </ConfigMenu>
    )
}