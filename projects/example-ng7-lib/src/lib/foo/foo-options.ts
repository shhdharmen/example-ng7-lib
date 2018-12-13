export interface FooOptions {
    changeWhen: EChangeWhen; // when the indicator should change the character?
    // when character has reach top of container or as soon as it becomes visible in container
    containerHeight: number;
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
    circular = 'circular',
    waterDrop = 'water-drop',
    squareLike = 'square-like'
}

export enum EPosition {
    auto = 'AUTO',
    top = 'TOP'
}
