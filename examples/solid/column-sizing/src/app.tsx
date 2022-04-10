import { createSignal, For } from 'solid-js'
import { createTable, useTable, ColumnResizeMode } from '@natstack/table-solid'

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
]

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
    const [data] = createSignal([...defaultData])
    const [columns] = createSignal<typeof defaultColumns>([...defaultColumns])

    const [columnResizeMode, setColumnResizeMode] = createSignal<ColumnResizeMode>('onChange')

    const instance = useTable(table, {
        data,
        columns,
        columnResizeMode,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
    })

    return (
        <div class="p-2">
            <select
                value={columnResizeMode()}
                onChange={(e) => setColumnResizeMode(e.currentTarget.value as ColumnResizeMode)}
                class="border p-2 border-black rounded"
            >
                <option value="onEnd">Resize: "onEnd"</option>
                <option value="onChange">Resize: "onChange"</option>
            </select>
            <div class="h-4" />
            <div class="text-xl">{'<table/>'}</div>
            <div class="overflow-x-auto">
                <table
                    {...instance.getTableProps({
                        style: {
                            width:
                                instance.getHeaderGroups()[0].headers.reduce((acc, header) => {
                                    return acc + header.getWidth()
                                }, 0) + 'px',
                        },
                    })}
                >
                    <thead>
                        <For each={instance.getHeaderGroups()}>
                            {(headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    <For each={headerGroup.headers}>
                                        {(header) => (
                                            <th
                                                {...header.getHeaderProps((props: any) => ({
                                                    ...props,
                                                    style: {
                                                        ...props.style,
                                                        width: header.getWidth() + 'px',
                                                    },
                                                }))}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : header.renderHeader()}
                                                <div
                                                    {...header.getResizerProps((props: any) => ({
                                                        ...props,
                                                        class: `${props.class} resizer ${
                                                            header.column.getIsResizing()
                                                                ? 'isResizing'
                                                                : ''
                                                        }`,
                                                        style: {
                                                            ...props.style,
                                                            transform:
                                                                columnResizeMode() === 'onEnd' &&
                                                                header.column.getIsResizing()
                                                                    ? `translateX(${
                                                                          instance.getState()
                                                                              .columnSizingInfo
                                                                              .deltaOffset
                                                                      }px)`
                                                                    : '',
                                                        },
                                                    }))}
                                                />
                                            </th>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                    </thead>
                    <tbody {...instance.getTableBodyProps()}>
                        <For each={instance.getRowModel().rows}>
                            {(row) => (
                                <tr {...row.getRowProps()}>
                                    <For each={row.getVisibleCells()}>
                                        {(cell) => (
                                            <td
                                                {...cell.getCellProps((props: any) => ({
                                                    ...props,
                                                    style: {
                                                        ...props.style,
                                                        width: cell.column.getWidth() + 'px',
                                                    },
                                                }))}
                                            >
                                                {cell.renderCell()}
                                            </td>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
            <div class="h-4" />
            <div class="text-xl">{'<div/>'}</div>
            <div class="overflow-x-auto">
                <div
                    {...instance.getTableProps({
                        class: 'divTable',
                        style: {
                            width: instance.getTableWidth() + 'px',
                        },
                    })}
                >
                    <div class="thead">
                        <For each={instance.getHeaderGroups()}>
                            {(headerGroup) => (
                                <div
                                    {...headerGroup.getHeaderGroupProps({
                                        class: 'tr',
                                    })}
                                >
                                    <For each={headerGroup.headers}>
                                        {(header) => (
                                            <div
                                                {...header.getHeaderProps((props: any) => ({
                                                    ...props,
                                                    class: 'th',
                                                    style: {
                                                        ...props.style,
                                                        width: header.getWidth() + 'px',
                                                    },
                                                }))}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : header.renderHeader()}
                                                <div
                                                    {...header.getResizerProps((props: any) => ({
                                                        ...props,
                                                        class: `${props.class} resizer ${
                                                            header.column.getIsResizing()
                                                                ? 'isResizing'
                                                                : ''
                                                        }`,
                                                        style: {
                                                            ...props.style,
                                                            transform:
                                                                columnResizeMode() === 'onEnd' &&
                                                                header.column.getIsResizing()
                                                                    ? `translateX(${
                                                                          instance.getState()
                                                                              .columnSizingInfo
                                                                              .deltaOffset
                                                                      }px)`
                                                                    : '',
                                                        },
                                                    }))}
                                                />
                                            </div>
                                        )}
                                    </For>
                                </div>
                            )}
                        </For>
                    </div>
                    <div
                        {...instance.getTableBodyProps({
                            class: 'tbody',
                        })}
                    >
                        <For each={instance.getRowModel().rows}>
                            {(row) => (
                                <div
                                    {...row.getRowProps({
                                        class: 'tr',
                                    })}
                                >
                                    <For each={row.getVisibleCells()}>
                                        {(cell) => (
                                            <div
                                                {...cell.getCellProps((props: any) => ({
                                                    ...props,
                                                    class: 'td',
                                                    style: {
                                                        ...props.style,
                                                        width: cell.column.getWidth() + 'px',
                                                    },
                                                }))}
                                            >
                                                {cell.renderCell()}
                                            </div>
                                        )}
                                    </For>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
            <div class="h-4" />
            <pre>
                {JSON.stringify(
                    {
                        columnSizing: instance.getState().columnSizing,
                        columnSizingInfo: instance.getState().columnSizingInfo,
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    )
}
