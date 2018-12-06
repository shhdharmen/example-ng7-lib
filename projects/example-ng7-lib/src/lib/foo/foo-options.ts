import { Observable } from 'rxjs';

export interface FooOptions {
    characters: ECharacters; // characters to be shown
    changeWhen: EChangeWhen; // when the indicator should change the character?
    // when character has reach top of container or as soon as it becomes visible in container
    primaryLocator: string;
    items: any[];
    theme: ETheme;
}

export enum ECharacters {
    auto = 'AUTO'
}

export enum EChangeWhen {
    top = 'TOP',
    visible = 'VISIBLE'
}

export enum ETheme {
    plain = 'PLAIN'
}
