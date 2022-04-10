import { type Component, type JSXElement, createSignal } from 'solid-js'
export * from '@izznatsir/table-core'

import {
    getValue,
    createTableInstance,
    PartialKeys,
    Options,
    TableInstance,
    CreateTableFactoryOptions,
    Table,
    init,
    AnyGenerics,
} from '@izznatsir/table-core'

export type Renderable<TProps> = Component<TProps> | JSXElement

export const render = <TProps extends {}>(Comp: Renderable<TProps>, props: TProps): JSXElement =>
    !Comp ? null : typeof Comp === 'function' ? <Comp {...props} /> : Comp

export type Render = typeof render

const { createTable, createTableFactory } = init({ render })

export { createTable, createTableFactory }

export function useTable<TGenerics extends AnyGenerics>(
    table: Table<TGenerics>,
    options: PartialKeys<
        Omit<Options<TGenerics>, keyof CreateTableFactoryOptions<any, any, any, any>>,
        'state' | 'onStateChange'
    >
): TableInstance<TGenerics> {
    // Compose in the generic options to the user options
    const resolvedOptions: Options<TGenerics> = {
        ...(table.__options ?? {}),
        state: {}, // Dummy state
        onStateChange: () => {}, // noop
        render,
        ...options,
    }

    // Create a new table instance
    const instance = createTableInstance<TGenerics>(resolvedOptions)

    // By default, manage table state here using the instance's initial state
    const [internalState, setInternalState] = createSignal(instance.initialState)

    // Combine internal state and controlled state as a derived signal,
    // so when the controlled part of the state is changed externally, it will
    // correctly trigger a rerender
    const state = () => {
        return {
            ...internalState(),
            ...getValue(options.state),
        }
    }

    // Compose the default state above with any user state. This will allow the user
    // to only control a subset of the state if desired.
    instance.setOptions((prev) => ({
        ...prev,
        ...options,
        state,
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: (updater) => {
            setInternalState(updater)
            options.onStateChange?.(updater)
        },
    }))

    return instance
}
