import faker from '@faker-js/faker'
import { createSignal, For, Show } from 'solid-js'
import {
    type ColumnOrderState,
    type ColumnPinningState,
    type VisibilityState,
    createTable,
    useTable,
} from '@natstack/table-solid'
import { makeData, Person } from './makeData'

let table = createTable<{ Row: Person }>()

const defaultColumns = table.createColumns([
    table.createGroup({
        header: 'Name',
        footer: (props) => props.column.id,
        columns: [
            table.createDataColumn('firstName', {
                cell: (info) => info.value,
                footer: (props) => props.column.id,
            }),
            table.createDataColumn((row) => row.lastName, {
                id: 'lastName',
                cell: (info) => info.value,
                header: () => <span>Last Name</span>,
                footer: (props) => props.column.id,
            }),
        ],
    }),
    table.createGroup({
        header: 'Info',
        footer: (props) => props.column.id,
        columns: [
            table.createDataColumn('age', {
                header: () => 'Age',
                footer: (props) => props.column.id,
            }),
            table.createGroup({
                header: 'More Info',
                columns: [
                    table.createDataColumn('visits', {
                        header: () => <span>Visits</span>,
                        footer: (props) => props.column.id,
                    }),
                    table.createDataColumn('status', {
                        header: 'Status',
                        footer: (props) => props.column.id,
                    }),
                    table.createDataColumn('progress', {
                        header: 'Profile Progress',
                        footer: (props) => props.column.id,
                    }),
                ],
            }),
        ],
    }),
])

export default function App() {
    const [data, setData] = createSignal(makeData(5000))
    const [columns] = createSignal([...defaultColumns])

    const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
    const [columnOrder, setColumnOrder] = createSignal<ColumnOrderState>([])
    const [columnPinning, setColumnPinning] = createSignal<ColumnPinningState>({})

    const [isSplit, setIsSplit] = createSignal(false)
    const rerender = () => setData(() => makeData(5000))

    const instance = useTable(table, {
        data,
        columns,
        state: () => ({
            columnVisibility: columnVisibility(),
            columnOrder: columnOrder(),
            columnPinning: columnPinning(),
        }),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        onColumnPinningChange: setColumnPinning,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
    })

    const randomizeColumns = () => {
        instance.setColumnOrder(
            faker.helpers.shuffle(instance.getAllLeafColumns().map((d) => d.id))
        )
    }

    const getHeaderProps = (headerProps: ReturnType<typeof instance.getHeaderProps>) => {
        return {
            ...headerProps,
            class: 'h-16',
        }
    }

    return (
        <div class="p-2">
            <div class="inline-block border border-black shadow rounded">
                <div class="px-1 border-b border-black">
                    <label>
                        <input {...instance.getToggleAllColumnsVisibilityProps()} /> Toggle All
                    </label>
                </div>
                <For each={instance.getAllLeafColumns()}>
                    {(column) => {
                        return (
                            <div class="px-1">
                                <label>
                                    <input {...column.getToggleVisibilityProps()} /> {column.id}
                                </label>
                            </div>
                        )
                    }}
                </For>
            </div>
            <div class="h-4" />
            <div class="flex flex-wrap gap-2">
                <button onClick={() => rerender()} class="border p-1">
                    Regenerate
                </button>
                <button onClick={() => randomizeColumns()} class="border p-1">
                    Shuffle Columns
                </button>
            </div>
            <div class="h-4" />
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isSplit()}
                        onChange={(e) => setIsSplit(e.currentTarget.checked)}
                    />{' '}
                    Split Mode
                </label>
            </div>
            <div
                classList={{
                    flex: true,
                    'gap-4': isSplit(),
                }}
            >
                {isSplit() ? (
                    <table {...instance.getTableProps({})} class="border-2 border-black">
                        <thead>
                            <For each={instance.getLeftHeaderGroups()}>
                                {(headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((header) => (
                                            <th {...getHeaderProps(header.getHeaderProps())}>
                                                <div class="whitespace-nowrap">
                                                    <Show when={!header.isPlaceholder}>
                                                        {header.renderHeader()}
                                                    </Show>
                                                </div>
                                                <Show
                                                    when={
                                                        !header.isPlaceholder &&
                                                        header.column.getCanPin()
                                                    }
                                                >
                                                    <div class="flex gap-1 justify-center">
                                                        <Show
                                                            when={
                                                                header.column.getIsPinned() !==
                                                                'left'
                                                            }
                                                        >
                                                            <button
                                                                class="border rounded px-2"
                                                                onClick={() => {
                                                                    header.column.pin('left')
                                                                }}
                                                            >
                                                                {'<='}
                                                            </button>
                                                        </Show>
                                                        <Show when={header.column.getIsPinned()}>
                                                            <button
                                                                class="border rounded px-2"
                                                                onClick={() => {
                                                                    header.column.pin(false)
                                                                }}
                                                            >
                                                                X
                                                            </button>
                                                        </Show>
                                                        <Show
                                                            when={
                                                                header.column.getIsPinned() ===
                                                                'right'
                                                            }
                                                        >
                                                            <button
                                                                class="border rounded px-2"
                                                                onClick={() => {
                                                                    header.column.pin('right')
                                                                }}
                                                            >
                                                                {'=>'}
                                                            </button>
                                                        </Show>
                                                    </div>
                                                </Show>
                                            </th>
                                        ))}
                                    </tr>
                                )}
                            </For>
                        </thead>
                        <tbody {...instance.getTableBodyProps()}>
                            <For each={instance.getRowModel().rows.slice(0, 20)}>
                                {(row) => {
                                    return (
                                        <tr {...row.getRowProps()}>
                                            <For each={row.getLeftVisibleCells()}>
                                                {(cell) => {
                                                    return (
                                                        <td {...cell.getCellProps()}>
                                                            {cell.renderCell()}
                                                        </td>
                                                    )
                                                }}
                                            </For>
                                        </tr>
                                    )
                                }}
                            </For>
                        </tbody>
                    </table>
                ) : null}
                <table {...instance.getTableProps({})} class="border-2 border-black">
                    <thead>
                        <For
                            each={
                                isSplit()
                                    ? instance.getCenterHeaderGroups()
                                    : instance.getHeaderGroups()
                            }
                        >
                            {(headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    <For each={headerGroup.headers}>
                                        {(header) => (
                                            <th {...getHeaderProps(header.getHeaderProps())}>
                                                <div class="whitespace-nowrap">
                                                    <Show when={!header.isPlaceholder}>
                                                        {header.renderHeader()}
                                                    </Show>
                                                </div>
                                                <Show
                                                    when={
                                                        !header.isPlaceholder &&
                                                        header.column.getCanPin()
                                                    }
                                                >
                                                    <div class="flex gap-1 justify-center">
                                                        <Show
                                                            when={
                                                                header.column.getIsPinned() !==
                                                                'left'
                                                            }
                                                        >
                                                            <button
                                                                class="border rounded px-2"
                                                                onClick={() => {
                                                                    header.column.pin('left')
                                                                }}
                                                            >
                                                                {'<='}
                                                            </button>
                                                        </Show>
                                                        <Show when={header.column.getIsPinned()}>
                                                            <button
                                                                class="border rounded px-2"
                                                                onClick={() => {
                                                                    header.column.pin(false)
                                                                }}
                                                            >
                                                                X
                                                            </button>
                                                        </Show>
                                                        <Show
                                                            when={
                                                                header.column.getIsPinned() ===
                                                                'right'
                                                            }
                                                        >
                                                            <button
                                                                class="border rounded px-2"
                                                                onClick={() => {
                                                                    header.column.pin('right')
                                                                }}
                                                            >
                                                                {'=>'}
                                                            </button>
                                                        </Show>
                                                    </div>
                                                </Show>
                                            </th>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                    </thead>
                    <tbody {...instance.getTableBodyProps()}>
                        <For each={instance.getRowModel().rows.slice(0, 20)}>
                            {(row) => {
                                return (
                                    <tr {...row.getRowProps()}>
                                        <For
                                            each={
                                                isSplit()
                                                    ? row.getCenterVisibleCells()
                                                    : row.getVisibleCells()
                                            }
                                        >
                                            {(cell) => (
                                                <td {...cell.getCellProps()}>
                                                    {cell.renderCell()}
                                                </td>
                                            )}
                                        </For>
                                    </tr>
                                )
                            }}
                        </For>
                    </tbody>
                </table>
                <Show when={isSplit()}>
                    <table {...instance.getTableProps({})} class="border-2 border-black">
                        <thead>
                            <For each={instance.getRightHeaderGroups()}>
                                {(headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        <For each={headerGroup.headers}>
                                            {(header) => (
                                                <th {...getHeaderProps(header.getHeaderProps())}>
                                                    <div class="whitespace-nowrap">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : header.renderHeader()}
                                                    </div>
                                                    <Show
                                                        when={
                                                            !header.isPlaceholder &&
                                                            header.column.getCanPin()
                                                        }
                                                    >
                                                        <div class="flex gap-1 justify-center">
                                                            <Show
                                                                when={
                                                                    header.column.getIsPinned() !==
                                                                    'left'
                                                                }
                                                            >
                                                                <button
                                                                    class="border rounded px-2"
                                                                    onClick={() => {
                                                                        header.column.pin('left')
                                                                    }}
                                                                >
                                                                    {'<='}
                                                                </button>
                                                            </Show>
                                                            <Show
                                                                when={header.column.getIsPinned()}
                                                            >
                                                                <button
                                                                    class="border rounded px-2"
                                                                    onClick={() => {
                                                                        header.column.pin(false)
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </Show>
                                                            <Show
                                                                when={
                                                                    header.column.getIsPinned() ===
                                                                    'right'
                                                                }
                                                            >
                                                                <button
                                                                    class="border rounded px-2"
                                                                    onClick={() => {
                                                                        header.column.pin('right')
                                                                    }}
                                                                >
                                                                    {'=>'}
                                                                </button>
                                                            </Show>
                                                        </div>
                                                    </Show>
                                                </th>
                                            )}
                                        </For>
                                    </tr>
                                )}
                            </For>
                        </thead>
                        <tbody {...instance.getTableBodyProps()}>
                            <For each={instance.getRowModel().rows.slice(0, 20)}>
                                {(row) => (
                                    <tr {...row.getRowProps()}>
                                        <For each={row.getRightVisibleCells()}>
                                            {(cell) => (
                                                <td {...cell.getCellProps()}>
                                                    {cell.renderCell()}
                                                </td>
                                            )}
                                        </For>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                </Show>
            </div>
        </div>
    )
}
