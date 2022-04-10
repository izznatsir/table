import { createSignal, For } from 'solid-js'
import { type SortingState, createTable, sortRowsFn, useTable } from '@izznatsir/table-solid'
import { makeData, Person } from './makeData'

let table = createTable<{ Row: Person }>()

export default function App() {
    const [sorting, setSorting] = createSignal<SortingState>([])

    const columns = table.createColumns([
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

    const [data, setData] = createSignal(makeData(100000))
    const refreshData = () => setData(makeData(100000))

    const instance = useTable(table, {
        data,
        columns,
        state: () => ({ sorting: sorting() }),
        onSortingChange: setSorting,
        sortRowsFn: sortRowsFn,
        debugTable: true,
    })

    return (
        <div className="p-2">
            <div className="h-2" />
            <table {...instance.getTableProps({})}>
                <thead>
                    <For each={instance.getHeaderGroups()}>
                        {(headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <For each={headerGroup.headers}>
                                    {(header) => {
                                        return (
                                            <th {...header.getHeaderProps()}>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...(header.column.getCanSort()
                                                            ? header.column.getToggleSortingProps({
                                                                  class: 'cursor-pointer select-none',
                                                              })
                                                            : {})}
                                                    >
                                                        {header.renderHeader()}
                                                        {{
                                                            asc: ' 🔼',
                                                            desc: ' 🔽',
                                                        }[header.column.getIsSorted() as string] ??
                                                            null}
                                                    </div>
                                                )}
                                            </th>
                                        )
                                    }}
                                </For>
                            </tr>
                        )}
                    </For>
                </thead>
                <tbody {...instance.getTableBodyProps()}>
                    <For each={instance.getRowModel().rows.slice(0, 10)}>
                        {(row) => {
                            return (
                                <tr {...row.getRowProps()}>
                                    <For each={row.getVisibleCells()}>
                                        {(cell) => (
                                            <td {...cell.getCellProps()}>{cell.renderCell()}</td>
                                        )}
                                    </For>
                                </tr>
                            )
                        }}
                    </For>
                </tbody>
            </table>
            <div>{instance.getRowModel().rows.length} Rows</div>
            <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div>
            <pre>{JSON.stringify(sorting(), null, 2)}</pre>
        </div>
    )
}
