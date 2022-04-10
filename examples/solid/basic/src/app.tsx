import { createSignal, For, Show } from 'solid-js'
import { createTable, useTable } from '@natstack/table-solid'

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

const table = createTable<{ Row: Person }>()

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

    const instance = useTable(table, {
        data: data(),
        columns: columns(),
    })

    return (
        <div class="p-2">
            <table {...instance.getTableProps()}>
                <thead>
                    <For each={instance.getHeaderGroups()}>
                        {(headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <For each={headerGroup.headers}>
                                    {(header) => (
                                        <th {...header.getHeaderProps()}>
                                            <Show when={!header.isPlaceholder}>
                                                {header.renderHeader()}
                                            </Show>
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
                                        <td {...cell.getCellProps()}>{cell.renderCell()}</td>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </tbody>
                <tfoot>
                    <For each={instance.getFooterGroups()}>
                        {(footerGroup) => (
                            <tr {...footerGroup.getFooterGroupProps()}>
                                <For each={footerGroup.headers}>
                                    {(header) => (
                                        <th {...header.getFooterProps()}>
                                            <Show when={!header.isPlaceholder}>
                                                {header.renderFooter()}
                                            </Show>
                                        </th>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </tfoot>
            </table>
            <div class="h-4" />
        </div>
    )
}
